import React from "react";
import { Target, Clock, Shuffle, Flame } from "lucide-react";

export function StatsOverview({ stats }) {
  if (!stats) return null;

  const cards = [
    {
      title: "Total Tracked",
      value: stats.totalTracked || 0,
      subtext: "Problems in cycle",
      icon: <Target className="w-5 h-5 text-blue-500" />,
      bg: "bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "Due for Revision",
      value: stats.dueCount || 0,
      subtext: stats.dueCount > 0 ? "Requires action today" : "All caught up!",
      icon: <Clock className="w-5 h-5 text-leetcode-orange" />,
      bg:
        stats.dueCount > 0
          ? "bg-amber-500/15 border-amber-500/30"
          : "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Random Cycle",
      value: stats.inRandomCycleCount || 0,
      subtext: "Long-term memory mode",
      icon: <Shuffle className="w-5 h-5 text-purple-500" />,
      bg: "bg-purple-500/10 border-purple-500/20",
    },
    {
      title: "Active Streak",
      value: `${stats.streak || 0} Days`,
      subtext: "Consecutive revision days",
      icon: <Flame className="w-5 h-5 text-leetcode-orange" />,
      bg: "bg-leetcode-orange/10 border-leetcode-orange/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <div
          key={i}
          className={`p-4 rounded-2xl border transition-all duration-200 bg-white dark:bg-leetcode-dark-card dark:border-leetcode-dark-border shadow-sm flex flex-col justify-between`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {card.title}
            </span>
            <div className={`p-2 rounded-xl border ${card.bg}`}>
              {card.icon}
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              {card.value}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {card.subtext}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
