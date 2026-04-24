const prisma = require('../../config/db');
const notificationsService = require('../notifications/notifications.service');

const communicationScope = (user) => {
  if (!user || user.role === 'admin') return {};
  if (user.role === 'lawyer') {
    return { 
      matter: { assigned_lawyer_id: user.id } 
    };
  }
  if (user.role === 'client') {
    return {
      matter: { client: { user_id: user.id } },
      visibility: { in: ['client_visible', 'client_shared'] },
    };
  }
  return { id: -1 }; // Should not happen with proper auth
};

const getAll = async (query, user) => {
  const { matter_id, visibility, communication_type, page = 1, limit = 100 } = query;
  const take = parseInt(limit);
  const skip = (parseInt(page) - 1) * take;

  const where = { ...communicationScope(user) };
  if (matter_id) where.matter_id = parseInt(matter_id);
  if (visibility) where.visibility = visibility;
  if (communication_type) where.communication_type = communication_type;

  return await prisma.communication.findMany({
    where,
    skip,
    take,
    include: {
      sender: { select: { id: true, full_name: true, role: true } },
      matter: { select: { id: true, matter_number: true, title: true } }
    },
    orderBy: { created_at: 'desc' },
  });
};

const getById = async (id, user) => {
  const comm = await prisma.communication.findUnique({
    where: { id: parseInt(id) },
    include: {
      sender: { select: { id: true, full_name: true, role: true } },
      matter: { select: { id: true, title: true } }
    }
  });
  if (!comm) return null;
  if (user?.role === 'lawyer') {
    const ok = await prisma.matter.count({ where: { id: comm.matter_id, assigned_lawyer_id: user.id } });
    if (!ok) {
      const err = new Error('Not authorized to access this communication');
      err.statusCode = 403;
      throw err;
    }
  }
  if (user?.role === 'client') {
    const ok = await prisma.matter.count({ where: { id: comm.matter_id, client: { user_id: user.id } } });
    if (!ok || (comm.visibility !== 'client_visible' && comm.visibility !== 'client_shared')) {
      const err = new Error('Not authorized to access this communication');
      err.statusCode = 403;
      throw err;
    }
  }
  return comm;
};

const create = async (data, user) => {
  if (user?.role === 'lawyer') {
    const allowed = await prisma.matter.count({
      where: { id: parseInt(data.matter_id), assigned_lawyer_id: user.id },
    });
    if (!allowed) {
      const err = new Error('Not authorized to create communication for this matter');
      err.statusCode = 403;
      throw err;
    }
  }
  if (user?.role === 'client') {
    const allowed = await prisma.matter.count({
      where: { id: parseInt(data.matter_id), client: { user_id: user.id } },
    });
    if (!allowed) {
      const err = new Error('Not authorized to message on this matter');
      err.statusCode = 403;
      throw err;
    }
    // Clients always create client_visible portal messages by default if not specified
    if (!data.visibility) data.visibility = 'client_visible';
    if (!data.communication_type) data.communication_type = 'portal_message';
  }

  // Ensure consistent types
  if (data.matter_id) data.matter_id = parseInt(data.matter_id);
  
  // Set sender from session
  data.sender_user_id = user.id;
  data.sender_role = user.role;

  const message = await prisma.communication.create({ data });
  
  // Log activity with descriptive text
  const typeLabel = (message.communication_type || 'communication').replace(/_/g, ' ');
  await prisma.activity.create({
    data: {
      matter_id: message.matter_id,
      entity_type: 'communication',
      entity_id: message.id,
      action: 'created',
      description: `${typeLabel.charAt(0).toUpperCase() + typeLabel.slice(1)} logged by ${user.full_name} (${user.role})`,
      actor_user_id: user.id
    }
  });

  // Notify recipient
  const matter = await prisma.matter.findUnique({
    where: { id: message.matter_id },
    include: { client: { select: { user_id: true } } }
  });

  let recipientId = null;
  if (user?.role === 'client') {
    recipientId = matter.assigned_lawyer_id;
  } else {
    recipientId = matter.client?.user_id;
  }

  if (recipientId) {
    await notificationsService.createNotification({
      user_id: recipientId,
      title: 'New Message Received',
      message: `${user.full_name} sent you a message regarding matter ${matter.matter_number}.`,
      type: 'system',
      reference_id: message.matter_id
    });
  }

  return message;
};

const update = async (id, data, user) => {
  const existing = await prisma.communication.findUnique({ where: { id: parseInt(id, 10) } });
  if (!existing) {
    const err = new Error('Communication not found');
    err.statusCode = 404;
    throw err;
  }
  if (user?.role === 'lawyer') {
    const allowed = await prisma.matter.count({
      where: { id: existing.matter_id, assigned_lawyer_id: user.id },
    });
    if (!allowed) {
      const err = new Error('Not authorized to update this communication');
      err.statusCode = 403;
      throw err;
    }
  }
  if (user?.role === 'client') {
    const err = new Error('Client cannot update communications');
    err.statusCode = 403;
    throw err;
  }
  return await prisma.communication.update({
    where: { id: parseInt(id) },
    data,
  });
};

const remove = async (id, user) => {
  if (user?.role !== 'admin') {
    const err = new Error('Only admin can delete communications');
    err.statusCode = 403;
    throw err;
  }
  return await prisma.communication.delete({ where: { id: parseInt(id) } });
};

const markRead = async (id, user) => {
  const comm = await getById(id, user);
  if (!comm) throw new Error('Communication not found');
  
  return await prisma.communication.update({
    where: { id: comm.id },
    data: { 
      is_read: true,
      read_at: new Date()
    }
  });
};

const markMatterRead = async (matterId, user) => {
  const mid = parseInt(matterId);
  const where = {
    matter_id: mid,
    is_read: false,
    ...communicationScope(user)
  };

  // Optimization: If Admin/Lawyer, they are marking messages from CLIENTS as read.
  // If Client, they are marking messages from STAFF as read.
  if (user.role === 'client') {
    where.sender_role = { not: 'client' };
  } else {
    where.sender_role = 'client';
  }

  const unreadCount = await prisma.communication.count({ where });
  console.log("Marking as read for matter:", mid);
  console.log("Unread before:", unreadCount);

  return await prisma.communication.updateMany({
    where,
    data: {
      is_read: true,
      read_at: new Date()
    }
  });
};


module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  markRead,
  markMatterRead,
};