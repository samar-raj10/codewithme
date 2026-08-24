const Problem = require('../models/Problem');
const { addDays, getNextStageAndDate, calculateProblemStatus, formatDateKey } = require('../utils/dateUtils');

/**
 * @desc    Log a new LeetCode problem attempt
 * @route   POST /api/problems
 */
exports.createProblem = async (req, res) => {
  try {
    const { questionNumber, questionTitle, notes } = req.body;

    // Input Validation
    if (questionNumber === undefined || questionNumber === null || questionNumber === '') {
      return res.status(400).json({ success: false, message: 'questionNumber is required' });
    }

    const num = Number(questionNumber);
    if (isNaN(num) || !Number.isInteger(num) || num <= 0) {
      return res.status(400).json({ success: false, message: 'questionNumber must be a positive integer' });
    }

    const now = new Date();
    const firstAttemptDate = now;
    const revisionStage = 'day3';
    const nextRevisionDate = addDays(firstAttemptDate, 3);
    const initialStatus = calculateProblemStatus(nextRevisionDate, revisionStage);

    const problem = new Problem({
      questionNumber: num,
      questionTitle: (questionTitle || '').trim(),
      firstAttemptDate,
      revisionStage,
      nextRevisionDate,
      status: initialStatus,
      notes: (notes || '').trim(),
      revisionHistory: []
    });

    await problem.save();

    return res.status(201).json({
      success: true,
      message: 'Problem logged successfully for spaced repetition',
      data: problem
    });
  } catch (error) {
    console.error('Error creating problem:', error);
    return res.status(500).json({ success: false, message: 'Server error creating problem', error: error.message });
  }
};

/**
 * @desc    Get all tracked problems with optional filtering, sorting, and search
 * @route   GET /api/problems
 */
exports.getProblems = async (req, res) => {
  try {
    const { status, sortBy = 'nextRevisionDate', order = 'asc', search } = req.query;

    let query = {};

    if (search) {
      const searchNum = Number(search);
      if (!isNaN(searchNum)) {
        query.$or = [
          { questionNumber: searchNum },
          { questionTitle: { $regex: search, $options: 'i' } }
        ];
      } else {
        query.questionTitle = { $regex: search, $options: 'i' };
      }
    }

    let problems = await Problem.find(query);

    // Dynamic status sync for each problem based on today's date
    let modified = false;
    for (let p of problems) {
      const currentCalculatedStatus = p.updateCalculatedStatus();
      if (p.isModified('status')) {
        await p.save();
        modified = true;
      }
    }

    // Filter by status if requested
    if (status && ['pending', 'due', 'overdue', 'in-random-cycle'].includes(status)) {
      problems = problems.filter(p => p.status === status);
    } else if (status === 'due-today') {
      problems = problems.filter(p => p.status === 'due' || p.status === 'overdue');
    }

    // Sort problems
    const sortOrder = order === 'desc' ? -1 : 1;
    problems.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (sortBy === 'nextRevisionDate' || sortBy === 'firstAttemptDate' || sortBy === 'createdAt') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }

      if (valA < valB) return -1 * sortOrder;
      if (valA > valB) return 1 * sortOrder;
      return 0;
    });

    return res.status(200).json({
      success: true,
      count: problems.length,
      data: problems
    });
  } catch (error) {
    console.error('Error fetching problems:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching problems', error: error.message });
  }
};

/**
 * @desc    Get problems due today or overdue
 * @route   GET /api/problems/due
 */
exports.getDueProblems = async (req, res) => {
  try {
    const problems = await Problem.find({});

    // Update status dynamically and filter due/overdue
    const dueProblems = [];
    for (let p of problems) {
      p.updateCalculatedStatus();
      if (p.isModified('status')) {
        await p.save();
      }
      if (p.status === 'due' || p.status === 'overdue') {
        dueProblems.push(p);
      }
    }

    // Sort by nextRevisionDate ascending (overdue first)
    dueProblems.sort((a, b) => new Date(a.nextRevisionDate) - new Date(b.nextRevisionDate));

    return res.status(200).json({
      success: true,
      count: dueProblems.length,
      data: dueProblems
    });
  } catch (error) {
    console.error('Error fetching due problems:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching due problems', error: error.message });
  }
};

/**
 * @desc    Mark a revision checkpoint as completed or skipped
 * @route   PATCH /api/problems/:id/revise
 */
exports.reviseProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const { action = 'complete' } = req.body; // 'complete' or 'skip'

    const problem = await Problem.findById(id);
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    const now = new Date();

    if (action === 'complete') {
      // 1. Log in revisionHistory
      problem.revisionHistory.push({
        stage: problem.revisionStage,
        scheduledDate: problem.nextRevisionDate,
        completedDate: now,
        wasCompleted: true
      });

      // 2. Advance stage and recalculate nextRevisionDate
      const { nextStage, nextRevisionDate } = getNextStageAndDate(problem.revisionStage, now);
      problem.revisionStage = nextStage;
      problem.nextRevisionDate = nextRevisionDate;

      // 3. Recalculate status
      problem.updateCalculatedStatus();

      await problem.save();

      return res.status(200).json({
        success: true,
        message: `Marked revision complete! Advanced to stage: ${nextStage}`,
        data: problem
      });
    } else if (action === 'skip') {
      // Log skip in history
      problem.revisionHistory.push({
        stage: problem.revisionStage,
        scheduledDate: problem.nextRevisionDate,
        completedDate: now,
        wasCompleted: false
      });

      // Keep stage as is, but problem remains overdue/due without silently advancing
      problem.updateCalculatedStatus();
      await problem.save();

      return res.status(200).json({
        success: true,
        message: 'Problem revision skipped for now.',
        data: problem
      });
    } else {
      return res.status(400).json({ success: false, message: "Invalid action. Must be 'complete' or 'skip'" });
    }
  } catch (error) {
    console.error('Error marking revision:', error);
    return res.status(500).json({ success: false, message: 'Server error revising problem', error: error.message });
  }
};

/**
 * @desc    Edit notes, title, or question number
 * @route   PATCH /api/problems/:id
 */
exports.updateProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const { questionNumber, questionTitle, notes } = req.body;

    const problem = await Problem.findById(id);
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    if (questionNumber !== undefined) {
      const num = Number(questionNumber);
      if (isNaN(num) || !Number.isInteger(num) || num <= 0) {
        return res.status(400).json({ success: false, message: 'questionNumber must be a positive integer' });
      }
      problem.questionNumber = num;
    }

    if (questionTitle !== undefined) {
      problem.questionTitle = questionTitle.trim();
    }

    if (notes !== undefined) {
      problem.notes = notes.trim();
    }

    await problem.save();

    return res.status(200).json({
      success: true,
      message: 'Problem updated successfully',
      data: problem
    });
  } catch (error) {
    console.error('Error updating problem:', error);
    return res.status(500).json({ success: false, message: 'Server error updating problem', error: error.message });
  }
};

/**
 * @desc    Delete a problem
 * @route   DELETE /api/problems/:id
 */
exports.deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;

    const problem = await Problem.findByIdAndDelete(id);
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    return res.status(200).json({
      success: true,
      message: `Problem #${problem.questionNumber} removed from tracking`,
      data: { id }
    });
  } catch (error) {
    console.error('Error deleting problem:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting problem', error: error.message });
  }
};

/**
 * @desc    Get dashboard statistics, streak, and revision activity heatmap
 * @route   GET /api/problems/stats
 */
exports.getStats = async (req, res) => {
  try {
    const problems = await Problem.find({});

    let totalTracked = problems.length;
    let dueCount = 0;
    let inRandomCycleCount = 0;

    const completedDatesMap = {}; // 'YYYY-MM-DD': count

    problems.forEach(p => {
      p.updateCalculatedStatus();
      if (p.status === 'due' || p.status === 'overdue') {
        dueCount++;
      }
      if (p.revisionStage === 'random-cycle' || p.status === 'in-random-cycle') {
        inRandomCycleCount++;
      }

      // Process revision history for heatmap & streak
      p.revisionHistory.forEach(entry => {
        if (entry.wasCompleted && entry.completedDate) {
          const dateKey = formatDateKey(entry.completedDate);
          completedDatesMap[dateKey] = (completedDatesMap[dateKey] || 0) + 1;
        }
      });
    });

    // Calculate streak
    const sortedCompletedDates = Object.keys(completedDatesMap).sort().reverse(); // newest first
    let streak = 0;
    
    if (sortedCompletedDates.length > 0) {
      const todayStr = formatDateKey(new Date());
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = formatDateKey(yesterday);

      // Check if user has done revision today or yesterday to maintain active streak
      let currentCheck = new Date();
      if (!completedDatesMap[todayStr] && completedDatesMap[yesterdayStr]) {
        currentCheck = yesterday;
      } else if (!completedDatesMap[todayStr] && !completedDatesMap[yesterdayStr]) {
        streak = 0;
      }

      if (completedDatesMap[formatDateKey(currentCheck)]) {
        let checkDate = currentCheck;
        while (completedDatesMap[formatDateKey(checkDate)]) {
          streak++;
          checkDate = new Date(checkDate);
          checkDate.setDate(checkDate.getDate() - 1);
        }
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        totalTracked,
        dueCount,
        inRandomCycleCount,
        streak,
        heatmapData: completedDatesMap
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching stats', error: error.message });
  }
};
