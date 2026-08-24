import React, { useMemo } from 'react';
import { Calendar } from 'lucide-react';

export function RevisionHeatmap({ heatmapData = {} }) {
  // Generate list of days for the past 16 weeks (~112 days) up to today
  const weeks = useMemo(() => {
    const totalDays = 112; // 16 weeks * 7 days
    const end = new Date();
    const result = [];
    let currentWeek = [];

    for (let i = totalDays - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(end.getDate() - i);
      const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const count = heatmapData[dateKey] || 0;

      currentWeek.push({
        date,
        dateKey,
        count
      });

      if (currentWeek.length === 7) {
        result.push(currentWeek);
        currentWeek = [];
      }
    }
    if (currentWeek.length > 0) {
      result.push(currentWeek);
    }
    return result;
  }, [heatmapData]);

  const getColorClass = (count) => {
    if (count === 0) return 'bg-gray-100 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700/60';
    if (count === 1) return 'bg-emerald-300 dark:bg-emerald-800/80 border-emerald-400 dark:border-emerald-700';
    if (count === 2) return 'bg-emerald-400 dark:bg-emerald-600 border-emerald-500 dark:border-emerald-500';
    return 'bg-emerald-500 dark:bg-emerald-500 border-emerald-600 dark:border-emerald-400 shadow-sm shadow-emerald-500/20';
  };

  const totalRevisionsInPeriod = Object.values(heatmapData).reduce((acc, curr) => acc + curr, 0);

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-leetcode-dark-card border border-gray-200 dark:border-leetcode-dark-border shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-leetcode-orange" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Revision Consistency Heatmap
          </h3>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {totalRevisionsInPeriod} total revisions logged
        </span>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex gap-1.5 min-w-max justify-between">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1.5">
              {week.map((day) => (
                <div
                  key={day.dateKey}
                  title={`${day.dateKey}: ${day.count} revision${day.count === 1 ? '' : 's'}`}
                  className={`w-3.5 h-3.5 rounded-sm border transition-all hover:scale-125 hover:z-10 ${getColorClass(day.count)}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 mt-3 pt-3 border-t border-gray-100 dark:border-zinc-800">
        <span>16 Weeks Activity</span>
        <div className="flex items-center gap-1.5">
          <span>Less</span>
          <div className="w-2.5 h-2.5 rounded-sm bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700" />
          <div className="w-2.5 h-2.5 rounded-sm bg-emerald-300 dark:bg-emerald-800/80" />
          <div className="w-2.5 h-2.5 rounded-sm bg-emerald-400 dark:bg-emerald-600" />
          <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500 dark:bg-emerald-500" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
