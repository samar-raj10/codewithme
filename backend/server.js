const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const problemRoutes = require('./routes/problemRoutes');

// Load environment variables
dotenv.config();

const app = express();

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

// Dynamic CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : true;

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// API Routes
app.use('/api/problems', problemRoutes);

// Healthcheck route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Production Static Serving & SPA Fallback (When served together on single server)
if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
  const distPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(distPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
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
