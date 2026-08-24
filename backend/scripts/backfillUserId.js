/**
 * One-off Migration Script: Backfill userId for existing orphaned problems
 * Usage:
 *   node scripts/backfillUserId.js <YOUR_SUPABASE_USER_ID>
 * Or set TARGET_USER_ID in .env and run:
 *   node scripts/backfillUserId.js
 */

const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = require('../config/db');
const Problem = require('../models/Problem');

async function backfill() {
  const targetUserId = process.argv[2] || process.env.TARGET_USER_ID;

  if (!targetUserId) {
    console.error('❌ Error: Please provide a target Supabase User ID as a command argument or TARGET_USER_ID env var.');
    console.log('Usage: node scripts/backfillUserId.js <YOUR_SUPABASE_USER_ID>');
    process.exit(1);
  }

  console.log(`🔌 Connecting to database...`);
  await connectDB();

  try {
    console.log(`🔍 Searching for problems without userId...`);
    const filter = { $or: [{ userId: { $exists: false } }, { userId: null }, { userId: '' }] };
    
    const countBefore = await Problem.countDocuments(filter);
    console.log(`Found ${countBefore} orphaned problem records.`);

    if (countBefore === 0) {
      console.log('✨ All problems already have a valid userId assigned! No migration needed.');
    } else {
      const result = await Problem.updateMany(filter, { $set: { userId: targetUserId } });
      console.log(`✅ Successfully backfilled ${result.modifiedCount} problems to userId: "${targetUserId}"`);
    }
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Database connection closed.');
    process.exit(0);
  }
}

backfill();
