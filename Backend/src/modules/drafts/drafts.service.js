const prisma = require('../../config/db');

const getAll = async (query, user) => {
  const { matter_id, status, page = 1, limit = 10 } = query;
  const take = parseInt(limit);
  const skip = (parseInt(page) - 1) * take;

  const where = {};
  if (matter_id) where.matter_id = parseInt(matter_id);
  if (status) where.status = status;
  if (user?.role === 'lawyer') where.matter = { assigned_lawyer_id: user.id };
  if (user?.role === 'client') where.matter = { client: { user_id: user.id } };

  return await prisma.draft.findMany({
    where,
    skip,
    take,
    include: {
      matter: { select: { id: true, title: true } },
      created_by: { select: { id: true, full_name: true } }
    },
    orderBy: { created_at: 'desc' },
  });
};

const getById = async (id, user) => {
  const draft = await prisma.draft.findUnique({
    where: { id: parseInt(id) },
    include: {
      signatures: {
        select: { id: true, signed_at: true, ip_address: true, signed_by_user_id: true }
      },
      created_by: { select: { id: true, full_name: true } }
    }
  });
  if (!draft) return null;
  if (user?.role === 'lawyer') {
    const ok = await prisma.matter.count({ where: { id: draft.matter_id, assigned_lawyer_id: user.id } });
    if (!ok) {
      const err = new Error('Not authorized to access this draft');
      err.statusCode = 403;
      throw err;
    }
  }
  if (user?.role === 'client') {
    const ok = await prisma.matter.count({ where: { id: draft.matter_id, client: { user_id: user.id } } });
    if (!ok || !['sent_for_signature', 'signed'].includes(draft.status)) {
      const err = new Error('Not authorized to access this draft');
      err.statusCode = 403;
      throw err;
    }
  }
  return draft;
};

const create = async (data, user) => {
  if (user?.role === 'lawyer') {
    const allowed = await prisma.matter.count({
      where: { id: data.matter_id, assigned_lawyer_id: user.id },
    });
    if (!allowed) {
      const err = new Error('Not authorized to create draft for this matter');
      err.statusCode = 403;
      throw err;
    }
    data.created_by_user_id = user.id;
    data.last_updated_by_user_id = user.id;
  }
  if (user?.role === 'client') {
    const err = new Error('Client cannot create drafts');
    err.statusCode = 403;
    throw err;
  }
  return await prisma.draft.create({ data });
};

const update = async (id, data, user) => {
  const existing = await prisma.draft.findUnique({ where: { id: parseInt(id, 10) } });
  if (!existing) {
    const err = new Error('Draft not found');
    err.statusCode = 404;
    throw err;
  }
  if (user?.role === 'lawyer') {
    const allowed = await prisma.matter.count({
      where: { id: existing.matter_id, assigned_lawyer_id: user.id },
    });
    if (!allowed) {
      const err = new Error('Not authorized to update this draft');
      err.statusCode = 403;
      throw err;
    }
    data.last_updated_by_user_id = user.id;
  }
  if (user?.role === 'client') {
    const err = new Error('Client cannot update drafts');
    err.statusCode = 403;
    throw err;
  }
  return await prisma.draft.update({
    where: { id: parseInt(id) },
    data,
  });
};

const remove = async (id, user) => {
  if (user?.role !== 'admin') {
    const err = new Error('Only admin can delete drafts');
    err.statusCode = 403;
    throw err;
  }
  return await prisma.draft.delete({ where: { id: parseInt(id) } });
};

const signDraft = async (draftId, userId, signatureData, ipAddress, deviceInfo, user) => {
  if (user?.role !== 'client') {
    const err = new Error('Only client can sign drafts');
    err.statusCode = 403;
    throw err;
  }
  return await prisma.$transaction(async (tx) => {
    const draftForClient = await tx.draft.findUnique({
      where: { id: parseInt(draftId, 10) },
      include: { matter: { include: { client: true } } },
    });
    if (!draftForClient || draftForClient.matter?.client?.user_id !== userId) {
      const err = new Error('Not authorized to sign this draft');
      err.statusCode = 403;
      throw err;
    }
    // 1. Create signature record
    const signature = await tx.signature.create({
      data: {
        draft_id: parseInt(draftId),
        signed_by_user_id: userId,
        signature_data: signatureData,
        ip_address: ipAddress,
        device_info: deviceInfo,
        signed_at: new Date()
      }
    });

    // 2. Update draft status
    const draft = await tx.draft.update({
      where: { id: parseInt(draftId) },
      data: {
        status: 'signed',
        signed_at: new Date()
      }
    });

    // 3. Log activity
    await tx.activity.create({
      data: {
        matter_id: draft.matter_id,
        entity_type: 'signature',
        entity_id: signature.id,
        action: 'signed',
        description: `Draft "${draft.title}" signed by client`,
        actor_user_id: userId
      }
    });

    return { signature, draft };
  });
};


module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  signDraft,
};