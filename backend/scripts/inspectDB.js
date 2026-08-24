const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = require('../config/db');
const Problem = require('../models/Problem');

async function inspectDB() {
  await connectDB();
  const problems = await Problem.find({});
  console.log(`Total problems in DB: ${problems.length}`);
  problems.forEach(p => {
    console.log(`ID: ${p._id}, Question: #${p.questionNumber} ${p.questionTitle}, userId: "${p.userId}"`);
  });
  process.exit(0);
}

inspectDB();
