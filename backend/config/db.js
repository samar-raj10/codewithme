const mongoose = require('mongoose');

let mongoMemoryServer = null;

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/leetrevise';
  const useMemoryDb = process.env.USE_MEMORY_DB === 'true';

  if (useMemoryDb) {
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();
      console.log(`[Database] Using MongoMemoryServer at ${memoryUri}`);
      await mongoose.connect(memoryUri);
      console.log('[Database] MongoDB connected (In-Memory)');
      return;
    } catch (err) {
      console.error('[Database] Failed to start MongoMemoryServer:', err.message);
    }
  }

  try {
    // Try standard MongoDB URI with short timeout fallback
    console.log(`[Database] Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000 // 3 seconds timeout
    });
    console.log('[Database] MongoDB connected successfully');
  } catch (error) {
    console.warn(`[Database] Could not connect to local MongoDB at ${mongoUri} (${error.message}).`);
    console.log('[Database] Falling back to MongoMemoryServer for instant execution...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();
      await mongoose.connect(memoryUri);
      console.log('[Database] Connected to MongoDB (In-Memory Fallback)');
    } catch (memErr) {
      console.error('[Database] Critical Error: Unable to establish database connection:', memErr.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
