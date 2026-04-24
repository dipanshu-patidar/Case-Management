const prisma = require('../../config/db');
const notificationsService = require('../notifications/notifications.service');
const bcrypt = require('bcryptjs');

const getAll = async (query) => {
  return await prisma.user.findMany({
    select: {
      id: true,
      full_name: true,
      email: true,
      role: true,
      is_active: true,
      last_login_at: true,
      created_at: true,
      _count: {
        select: { assigned_matters: true },
      },
    },
    orderBy: { created_at: 'desc' },
  });
};

const getById = async (id) => {
  return await prisma.user.findUnique({
    where: { id: parseInt(id) },
    select: {
      id: true,
      full_name: true,
      email: true,
      role: true,
      is_active: true,
      created_at: true,
    },
  });
};

const create = async (data) => {
  const salt = await bcrypt.genSalt(10);
  data.password_hash = await bcrypt.hash(data.password, salt);
  delete data.password;
  
  const user = await prisma.user.create({ data });

  if (user.role === 'client') {
    const admins = await prisma.user.findMany({
      where: { role: 'admin' },
      select: { id: true }
    });

    for (const admin of admins) {
      await notificationsService.createNotification({
        user_id: admin.id,
        title: 'New Client Registered',
        message: `${user.full_name} has registered and is awaiting onboarding.`,
        type: 'client',
        reference_id: user.id
      });
    }
  }

  delete user.password_hash;
  return user;
};

const update = async (id, data) => {
  if (data.password) {
    const salt = await bcrypt.genSalt(10);
    data.password_hash = await bcrypt.hash(data.password, salt);
    delete data.password;
  }
  
  const user = await prisma.user.update({
    where: { id: parseInt(id) },
    data,
  });
  delete user.password_hash;
  return user;
};

const remove = async (id) => {
  return await prisma.user.delete({ where: { id: parseInt(id) } });
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
