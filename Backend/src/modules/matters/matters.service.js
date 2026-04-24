const prisma = require('../../config/db');
const billingService = require('../billing/billing.service');

const canAccessMatter = (matter, user) => {
  if (!matter || !user) return false;
  if (user.role === 'admin') return true;
  if (user.role === 'lawyer') return matter.assigned_lawyer_id === user.id;
  if (user.role === 'client') return matter.client?.user_id === user.id;
  return false;
};

const nextMatterNumber = async () => {
  const count = await prisma.matter.count();
  return `MT-${String(count + 1).padStart(5, '0')}`;
};

const getAll = async (query, user) => {
  const { status, client_id, lawyer_id, page = 1, limit = 10 } = query;
  const take = parseInt(limit);
  const skip = (parseInt(page) - 1) * take;

  const where = {};
  if (status) where.status = status;
  if (client_id) where.client_id = parseInt(client_id);
  if (lawyer_id) where.assigned_lawyer_id = parseInt(lawyer_id);
  if (user?.role === 'lawyer') where.assigned_lawyer_id = user.id;
  if (user?.role === 'client') where.client = { user_id: user.id };

  return await prisma.matter.findMany({
    where,
    skip,
    take,
    include: {
      client: { select: { id: true, full_name: true } },
      assigned_lawyer: { select: { id: true, full_name: true } },
    },
    orderBy: { created_at: 'desc' },
  });
};

const getById = async (id, user) => {
  const matter = await prisma.matter.findUnique({
    where: { id: parseInt(id) },
    include: {
      client: true,
      assigned_lawyer: { select: { id: true, full_name: true, email: true } },
      created_by: { select: { id: true, full_name: true } },
      documents: {
        include: {
          uploader: { select: { id: true, full_name: true } },
        },
      },
      drafts: {
        orderBy: { updated_at: 'desc' },
      },
      communications: {
        orderBy: { created_at: 'desc' },
        take: 50,
        include: {
          sender: { select: { id: true, full_name: true, role: true } },
        },
      },
      status_history: {
        orderBy: { created_at: 'desc' },
        take: 20,
      },
      invoices: {
        include: { payments: true }
      },
      activities: {
        orderBy: { created_at: 'desc' },
        take: 20,
        include: {
          actor: { select: { id: true, full_name: true } },
        },
      },
    }
  });
  if (!matter) return null;
  if (!canAccessMatter(matter, user)) {
    const err = new Error('Not authorized to access this matter');
    err.statusCode = 403;
    throw err;
  }

  // Standardize invoices
  if (matter.invoices) {
    matter.invoices = matter.invoices.map(billingService.calculateInvoiceFields);
  }

  if (user?.role === 'client') {
    matter.documents = (matter.documents || []).filter((d) =>
      d.visibility === 'client_shared' || d.visibility === 'client_visible',
    );
    matter.communications = (matter.communications || []).filter((c) =>
      c.visibility === 'client_visible' || c.visibility === 'client_shared',
    );
    matter.drafts = (matter.drafts || []).filter((d) =>
      d.status === 'sent_for_signature' || d.status === 'signed',
    );
  }
  return matter;
};

const create = async (data, user) => {
  if (user?.role === 'client') {
    const err = new Error('Client cannot create matters');
    err.statusCode = 403;
    throw err;
  }
  if (user?.role === 'lawyer') {
    if (data.assigned_lawyer_id && Number(data.assigned_lawyer_id) !== user.id) {
      const err = new Error('Lawyer can only create matters assigned to self');
      err.statusCode = 403;
      throw err;
    }
    data.assigned_lawyer_id = user.id;
    data.created_by_user_id = user.id;
  }
  const payload = { ...data };
  if (!payload.matter_number) {
    payload.matter_number = await nextMatterNumber();
  }
  const matter = await prisma.matter.create({ data: payload });
  
  // Log activity
  await prisma.activity.create({
    data: {
      matter_id: matter.id,
      entity_type: 'matter',
      entity_id: matter.id,
      action: 'created',
      description: `Matter ${matter.matter_number} created: ${matter.title}`,
      actor_user_id: data.created_by_user_id
    }
  });

  return matter;
};

const update = async (id, data, user) => {
  const idInt = parseInt(id, 10);
  const existing = await prisma.matter.findUnique({ where: { id: idInt } });
  if (!existing) {
    const err = new Error('Matter not found');
    err.statusCode = 404;
    throw err;
  }
  if (!canAccessMatter(existing, user)) {
    const err = new Error('Not authorized to update this matter');
    err.statusCode = 403;
    throw err;
  }
  if (user?.role === 'client') {
    const err = new Error('Client cannot update matters');
    err.statusCode = 403;
    throw err;
  }
  if (user?.role === 'lawyer') {
    delete data.client_id;
    delete data.assigned_lawyer_id;
    delete data.created_by_user_id;
  }

  const { updated_by_user_id, ...prismaData } = data;
  if (prismaData.next_hearing) {
    prismaData.next_hearing = new Date(prismaData.next_hearing);
  }
  const matter = await prisma.matter.update({
    where: { id: idInt },
    data: prismaData,
  });

  if (data.status && data.status !== existing.status) {
    const actorId = updated_by_user_id ?? existing.created_by_user_id;

    await prisma.activity.create({
      data: {
        matter_id: matter.id,
        entity_type: 'matter',
        entity_id: matter.id,
        action: 'status_updated',
        description: `Matter status changed to ${data.status}`,
        actor_user_id: actorId,
      },
    });

    await prisma.matterStatusHistory.create({
      data: {
        matter_id: matter.id,
        old_status: existing.status,
        new_status: data.status,
        changed_by_user_id: actorId,
      },
    });
  }

  return matter;
};

const remove = async (id, user) => {
  if (user?.role !== 'admin') {
    const err = new Error('Only admin can delete matters');
    err.statusCode = 403;
    throw err;
  }
  return await prisma.matter.delete({ where: { id: parseInt(id, 10) } });
};


module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};