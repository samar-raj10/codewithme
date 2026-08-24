const { STAGE_INTERVALS, RANDOM_CYCLE_MIN_DAYS, RANDOM_CYCLE_MAX_DAYS } = require('../config/constants');

/**
 * Add specified number of days to a given Date object.
 */
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Generate a random number of days within the configurable random cycle range.
 */
function getRandomCycleDays() {
  return Math.floor(Math.random() * (RANDOM_CYCLE_MAX_DAYS - RANDOM_CYCLE_MIN_DAYS + 1)) + RANDOM_CYCLE_MIN_DAYS;
}

/**
 * Compute the next stage and next revision date given the current stage and completion date.
 */
function getNextStageAndDate(currentStage, completionDate = new Date()) {
  let nextStage;
  let daysToAdd;

  switch (currentStage) {
    case 'day3':
      nextStage = 'day7';
      daysToAdd = STAGE_INTERVALS.day7; // 7 days
      break;
    case 'day7':
      nextStage = 'day10';
      daysToAdd = STAGE_INTERVALS.day10; // 10 days
      break;
    case 'day10':
      nextStage = 'day21';
      daysToAdd = STAGE_INTERVALS.day21; // 21 days
      break;
    case 'day21':
    case 'random-cycle':
      nextStage = 'random-cycle';
      daysToAdd = getRandomCycleDays(); // 15..45 days
      break;
    default:
      nextStage = 'day3';
      daysToAdd = STAGE_INTERVALS.day3;
      break;
  }

  const nextRevisionDate = addDays(completionDate, daysToAdd);

  return {
    nextStage,
    nextRevisionDate,
    daysToAdd
  };
}

/**
 * Determine the dynamic status of a problem based on nextRevisionDate and today's date.
 */
function calculateProblemStatus(nextRevisionDate, stage) {
  const now = new Date();
  
  // Start of today (00:00:00.000)
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // End of today (23:59:59.999)
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  const nextRev = new Date(nextRevisionDate);

  if (nextRev < startOfToday) {
    return 'overdue';
  } else if (nextRev >= startOfToday && nextRev <= endOfToday) {
    return 'due';
  } else {
    // In the future
    if (stage === 'random-cycle') {
      return 'in-random-cycle';
    }
    return 'pending';
  }
}

/**
 * Helper to get normalized date string YYYY-MM-DD
 */
function formatDateKey(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

module.exports = {
  addDays,
  getRandomCycleDays,
  getNextStageAndDate,
  calculateProblemStatus,
  formatDateKey
};
