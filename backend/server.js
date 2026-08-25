const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const problemRoutes = require('./routes/problemRoutes');

// Load environment variables
dotenv.config();

const app = express();

// Dynamic CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : true;

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

// Middleware to ensure DB is connected for serverless invocations
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('[Database Middleware Error]:', err.message);
    res.status(500).json({
      success: false,
      message: 'Database connection error. Please verify MONGO_URI environment variable on Vercel.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Healthcheck routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// API Routes mounted on both /api/problems and /problems for fail-safe URL matching
app.use('/api/problems', problemRoutes);
app.use('/problems', problemRoutes);

// Production Static Serving & SPA Fallback (When served together on single server)
if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
  const distPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(distPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/problems')) {
      return next();
    }
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
}

// 404 Handler for unhandled API endpoints
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Resource not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Export Express app for Vercel Serverless Functions
module.exports = app;

// Only start TCP listener if running outside Vercel serverless environment
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5050;
  app.listen(PORT, () => {
    console.log(`🚀 LeetRevise Backend server running on port ${PORT} [Mode: ${process.env.NODE_ENV || 'development'}]`);
  });
}
