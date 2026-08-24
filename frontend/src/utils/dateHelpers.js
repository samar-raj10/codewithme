/**
 * Frontend Date & Stage Formatting Helpers
 */

export function formatDate(dateInput) {
  if (!dateInput) return '—';
  const d = new Date(dateInput);
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function formatDateTime(dateInput) {
  if (!dateInput) return '—';
  const d = new Date(dateInput);
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function getRelativeTimeString(dateInput) {
  if (!dateInput) return '';
  const now = new Date();
  const date = new Date(dateInput);
  
  // Set to start of day for comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  
  const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays < -1) return `${Math.abs(diffDays)} days overdue`;
  return `In ${diffDays} days`;
}

export const STAGE_LABELS = {
  day3: 'Stage 1: Day 3',
  day7: 'Stage 2: Day 7',
  day10: 'Stage 3: Day 10',
  day21: 'Stage 4: Day 21',
  'random-cycle': 'Random Cycle'
};

export const STAGE_BADGE_COLORS = {
  day3: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  day7: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
  day10: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
  day21: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  'random-cycle': 'bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300 border-pink-200 dark:border-pink-800'
};

export const STATUS_BADGE_CONFIG = {
  overdue: {
    label: 'Overdue',
    classes: 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 border-red-200 dark:border-red-800/60 font-semibold'
  },
  due: {
    label: 'Due Today',
    classes: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-700/60 font-semibold'
  },
  pending: {
    label: 'Upcoming',
    classes: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
  },
  'in-random-cycle': {
    label: 'In Random Cycle',
    classes: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800/60'
  }
};
