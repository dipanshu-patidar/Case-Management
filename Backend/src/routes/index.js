const express = require('express');
const router = express.Router();

const authRoutes = require('../modules/auth/auth.routes');
const usersRoutes = require('../modules/users/users.routes');
const leadsRoutes = require('../modules/leads/leads.routes');
const clientsRoutes = require('../modules/clients/clients.routes');
const mattersRoutes = require('../modules/matters/matters.routes');
const documentsRoutes = require('../modules/documents/documents.routes');
const communicationsRoutes = require('../modules/communications/communications.routes');
const billingRoutes = require('../modules/billing/billing.routes');
const draftsRoutes = require('../modules/drafts/drafts.routes');
const dashboardsRoutes = require('../modules/dashboards/dashboards.routes');
const marketingRoutes = require('../modules/marketing/marketing.routes');
const conflictsRoutes = require('../modules/conflicts/conflicts.routes');
const timersRoutes = require('../modules/timers/timers.routes');
const reportsRoutes = require('../modules/reports/reports.routes');
const foldersRoutes = require('../modules/documents/folders.routes');
const settingsRoutes = require('../modules/settings/settings.routes');
const notificationRoutes = require('../modules/notifications/notifications.routes');

const searchRoutes = require('../modules/search/search.routes');

const marketingController = require('../modules/marketing/marketing.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

router.use('/auth', authRoutes);
router.get('/public/social-links', marketingController.getSocialLinks);
router.put('/admin/social-links', protect, authorize('admin'), marketingController.updateSocialLinks);

router.use('/search', searchRoutes);
router.use('/users', usersRoutes);
router.use('/leads', leadsRoutes);
router.use('/clients', clientsRoutes);
router.use('/matters', mattersRoutes);
router.use('/documents', documentsRoutes);
router.use('/folders', foldersRoutes);
router.use('/settings', settingsRoutes);
router.use('/communications', communicationsRoutes);
router.use('/billing', billingRoutes);
router.use('/drafts', draftsRoutes);
router.use('/dashboard', dashboardsRoutes);
router.use('/dashboards', dashboardsRoutes);
router.use('/marketing', marketingRoutes);
router.use('/conflicts', conflictsRoutes);
router.use('/timers', timersRoutes);
router.use('/reports', reportsRoutes);
router.use('/notifications', notificationRoutes);

module.exports = router;
