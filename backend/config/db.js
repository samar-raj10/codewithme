const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  // Reuse existing connection if connected
  if (isConnected || mongoose.connection.readyState >= 1) {
    isConnected = true;
    return;
  }

  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/leetrevise';
  const useMemoryDb = process.env.USE_MEMORY_DB === 'true';
  const isVercel = Boolean(process.env.VERCEL);

  // Forced Memory DB mode (local dev only)
  if (useMemoryDb && !isVercel) {
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();
      console.log(`[Database] Using MongoMemoryServer at ${memoryUri}`);
      await mongoose.connect(memoryUri);
      isConnected = true;
      return;
    } catch (err) {
      console.error('[Database] Failed to start MongoMemoryServer:', err.message);
    }
  }

  try {
    console.log(`[Database] Connecting to MongoDB...`);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });
    isConnected = true;
    console.log('[Database] MongoDB connected successfully');
  } catch (error) {
    console.warn(`[Database] Standard MongoDB connection failed: ${error.message}`);

    // Attempt memory DB fallback only in local non-Vercel environment
    if (!isVercel && process.env.NODE_ENV !== 'production') {
      try {
        console.log('[Database] Falling back to MongoMemoryServer for local dev execution...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongoMemoryServer = await MongoMemoryServer.create();
        const memoryUri = mongoMemoryServer.getUri();
        await mongoose.connect(memoryUri);
        isConnected = true;
        console.log('[Database] Connected to MongoDB (In-Memory Fallback)');
        return;
      } catch (memErr) {
        console.error('[Database] Memory server fallback failed:', memErr.message);
      }
    }

    throw new Error(`Database connection failed: ${error.message}`);
  }
};

module.exports = connectDB;
