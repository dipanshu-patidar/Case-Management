const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const notificationsService = require('../notifications/notifications.service');

exports.getAllEvents = async () => {
  const events = [];

  // 1. Invoice due
  const invoices = await prisma.invoice.findMany({
    where: { due_date: { not: null } },
    select: { id: true, invoice_number: true, amount: true, due_date: true, status: true, description: true }
  });

  invoices.forEach(i => {
    events.push({
      id: i.id,
      title: `Invoice ${i.invoice_number} due`,
      date: i.due_date,
      type: 'invoice',
      amount: i.amount,
      status: i.status,
      description: i.description,
      raw_id: i.id
    });
  });

  // 2. Matters
  const matters = await prisma.matter.findMany({
    select: { id: true, title: true, created_at: true, matter_number: true, description: true }
  });

  matters.forEach(m => {
    events.push({
      id: m.id,
      title: `Matter Opened: ${m.title}`,
      date: m.created_at,
      type: 'matter',
      matter_id: m.id,
      matter_number: m.matter_number,
      description: m.description,
      raw_id: m.id
    });
  });

  // 3. Manual events
  const custom = await prisma.calendarEvent.findMany({
    include: {
      matter: { select: { matter_number: true, title: true } }
    }
  });

  custom.forEach(e => {
    events.push({
      id: e.id,
      title: e.title,
      date: e.event_date,
      type: e.type,
      matter_id: e.matter_id,
      matter_number: e.matter?.matter_number,
      matter_title: e.matter?.title,
      description: e.description,
      raw_id: e.id
    });
  });

  return events;
};

exports.createEvent = async (userId, body) => {
  let eventDate = new Date(body.date || new Date());
  
  if (body.time) {
    const [hours, minutes] = body.time.split(':');
    eventDate.setHours(parseInt(hours, 10));
    eventDate.setMinutes(parseInt(minutes, 10));
  }

  const event = await prisma.calendarEvent.create({
    data: {
      title: body.title,
      event_date: eventDate,
      matter_id: body.matter_id ? Number(body.matter_id) : null,
      type: body.type || 'custom',
      description: body.description || null,
      created_by: userId
    }
  });

  if (event.matter_id && (event.type === 'hearing' || event.type === 'deadline')) {
    const matter = await prisma.matter.findUnique({
      where: { id: event.matter_id },
      select: { assigned_lawyer_id: true, matter_number: true }
    });
    if (matter?.assigned_lawyer_id) {
      await notificationsService.createNotification({
        user_id: matter.assigned_lawyer_id,
        title: `Critical Alert: ${event.type.charAt(0).toUpperCase() + event.type.slice(1)}`,
        message: `New ${event.type} "${event.title}" set for matter ${matter.matter_number}.`,
        type: 'deadline',
        reference_id: event.matter_id
      });
    }
  }

  return event;
};
