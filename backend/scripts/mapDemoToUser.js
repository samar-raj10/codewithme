/**
 * Migration Script: Map Demo / Unassigned Problems to a Target User ID
 * Usage:
 *   node scripts/mapDemoToUser.js <TARGET_USER_ID>
 */

const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = require('../config/db');
const Problem = require('../models/Problem');

async function mapDemoRecords() {
  const targetUserId = process.argv[2] || process.env.TARGET_USER_ID || 'demo-local-user-id';

  console.log(`🔌 Connecting to MongoDB...`);
  await connectDB();

  try {
    const filter = {
      $or: [
        { userId: { $exists: false } },
        { userId: null },
        { userId: '' },
        { userId: 'undefined' },
        { userId: 'demo-local-user-id' },
        { userId: { $regex: /^demo-/ } }
      ]
    };

    const countBefore = await Problem.countDocuments(filter);
    console.log(`Found ${countBefore} unassigned/demo problem records in the database.`);

    if (countBefore === 0) {
      console.log('✨ All problems are already assigned to user accounts!');
    } else {
      const result = await Problem.updateMany(filter, { $set: { userId: targetUserId } });
      console.log(`✅ Successfully mapped ${result.modifiedCount} problem records to target User ID: "${targetUserId}"`);
    }

    const allProblems = await Problem.find({});
    console.log('\n--- Current Database Summary ---');
    allProblems.forEach(p => {
      console.log(`• #${p.questionNumber} ${p.questionTitle || ''} (ID: ${p._id}) -> userId: "${p.userId}"`);
    });
  } catch (error) {
    console.error('❌ Error during mapping:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed.');
    process.exit(0);
  }
}

mapDemoRecords();
