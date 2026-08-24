/**
 * Spaced Repetition Constants & Configurations
 */

const REVISION_STAGES = ['day3', 'day7', 'day10', 'day21', 'random-cycle'];

// Interval mapping in days for fixed stages
const STAGE_INTERVALS = {
  day3: 3,
  day7: 7,
  day10: 10,
  day21: 21
};

// Configurable random cycle bounds (in days)
const RANDOM_CYCLE_MIN_DAYS = 15;
const RANDOM_CYCLE_MAX_DAYS = 45;

module.exports = {
  REVISION_STAGES,
  STAGE_INTERVALS,
  RANDOM_CYCLE_MIN_DAYS,
  RANDOM_CYCLE_MAX_DAYS
};
