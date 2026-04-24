const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const routes = require('./routes');
const reportRoutes = require('./modules/reports/reports.routes');
const calendarRoutes = require('./modules/calendar/calendar.routes');
const dashboardRoutes = require('./modules/dashboards/dashboards.routes');
const { errorHandler } = require('./middlewares/error.middleware');

dotenv.config();

const app = express();

// Middleware
const clientOrigin = (process.env.CLIENT_URL || 'http://localhost:5173').trim();
app.use(cors({
  origin: clientOrigin,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static folder for uploads
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'VkTori Legal Backend is running' });
});

// API Routes
app.use('/api', routes);
app.use('/api/reports', reportRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/dashboards', dashboardRoutes);

// Error Handling
app.use(errorHandler);

module.exports = app;
