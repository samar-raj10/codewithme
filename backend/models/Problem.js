const mongoose = require('mongoose');
const { REVISION_STAGES } = require('../config/constants');
const { calculateProblemStatus } = require('../utils/dateUtils');

const RevisionLogSchema = new mongoose.Schema({
  stage: {
    type: String,
    enum: REVISION_STAGES,
    required: true
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  completedDate: {
    type: Date,
    default: Date.now
  },
  wasCompleted: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const ProblemSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'userId is required'],
    index: true
  },
  questionNumber: {
    type: Number,
    required: [true, 'Question number is required'],
    min: [1, 'Question number must be a positive integer'],
    validate: {
      validator: Number.isInteger,
      message: 'Question number must be an integer'
    }
  },
  questionTitle: {
    type: String,
    trim: true,
    default: ''
  },
  firstAttemptDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  revisionStage: {
    type: String,
    enum: REVISION_STAGES,
    default: 'day3',
    required: true
  },
  nextRevisionDate: {
    type: Date,
    required: true
  },
  revisionHistory: [RevisionLogSchema],
  status: {
    type: String,
    enum: ['pending', 'due', 'overdue', 'in-random-cycle'],
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Method to update problem status dynamically based on current date vs nextRevisionDate
ProblemSchema.methods.updateCalculatedStatus = function() {
  this.status = calculateProblemStatus(this.nextRevisionDate, this.revisionStage);
  return this.status;
};

// Index for efficient sorting and querying
ProblemSchema.index({ userId: 1, questionNumber: 1 });
ProblemSchema.index({ userId: 1, nextRevisionDate: 1 });
ProblemSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('Problem', ProblemSchema);
