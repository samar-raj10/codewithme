import React, { useState } from 'react';
import { Search, History, Edit3, Trash2, ArrowUpDown, ExternalLink, Calendar, Filter, CheckCircle2, ChevronRight } from 'lucide-react';
import { formatDate, getRelativeTimeString, STAGE_LABELS, STAGE_BADGE_COLORS, STATUS_BADGE_CONFIG } from '../utils/dateHelpers';

export function ProblemTable({
  problems = [],
  filterStatus,
  setFilterStatus,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  onViewHistory,
  onEditProblem,
  onDeleteProblem,
  onRevise
}) {
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const filterTabs = [
    { key: 'all', label: 'All Problems' },
    { key: 'due-today', label: 'Due Today / Overdue' },
    { key: 'pending', label: 'Upcoming' },
    { key: 'in-random-cycle', label: 'Random Cycle' }
  ];

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-leetcode-dark-card border border-gray-200 dark:border-leetcode-dark-border shadow-sm space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-white">
            All Tracked Problems ({problems.length})
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            View revision schedule, stages, and notes
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xs w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search by # or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-leetcode-orange/50 transition-all"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-gray-100 dark:border-zinc-800 text-xs">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterStatus(tab.key)}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
              filterStatus === tab.key
                ? 'bg-leetcode-orange text-white font-semibold shadow-sm shadow-leetcode-orange/20'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table / List View */}
      {problems.length === 0 ? (
        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
          <p className="text-sm font-medium">No problems found</p>
          <p className="text-xs mt-1">Try clearing your filters or log a new problem attempt above.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 dark:border-zinc-800 text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold">
                <th className="py-3 px-3">
                  <button
                    onClick={() => handleSort('questionNumber')}
                    className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  >
                    <span>#</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-3">Title</th>
                <th className="py-3 px-3">Stage</th>
                <th className="py-3 px-3">
                  <button
                    onClick={() => handleSort('nextRevisionDate')}
                    className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  >
                    <span>Next Revision</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/60">
              {problems.map((problem) => {
                const statusConfig = STATUS_BADGE_CONFIG[problem.status] || STATUS_BADGE_CONFIG.pending;
                const stageBadge = STAGE_BADGE_COLORS[problem.revisionStage] || STAGE_BADGE_COLORS.day3;
                const stageLabel = STAGE_LABELS[problem.revisionStage] || problem.revisionStage;
                const isDueOrOverdue = problem.status === 'due' || problem.status === 'overdue';

                return (
                  <tr
                    key={problem._id}
                    className="hover:bg-gray-50/80 dark:hover:bg-zinc-800/40 transition-colors group"
                  >
                    {/* Question # */}
                    <td className="py-3.5 px-3">
                      <span className="font-mono font-bold text-leetcode-orange bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded border border-gray-200 dark:border-zinc-700">
                        #{problem.questionNumber}
                      </span>
                    </td>

                    {/* Title & Notes */}
                    <td className="py-3.5 px-3 max-w-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-gray-900 dark:text-white truncate">
                          {problem.questionTitle || `LeetCode #${problem.questionNumber}`}
                        </span>
                        <a
                          href={`https://leetcode.com/problemset/all/?search=${problem.questionNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="opacity-0 group-hover:opacity-100 text-blue-500 hover:underline transition-opacity"
                          title="Open on LeetCode"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      {problem.notes && (
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1 italic mt-0.5">
                          {problem.notes}
                        </p>
                      )}
                    </td>

                    {/* Stage */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded border text-[11px] font-medium ${stageBadge}`}>
                        {stageLabel}
                      </span>
                    </td>

                    {/* Next Revision Date */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="font-medium text-gray-900 dark:text-gray-200">
                        {formatDate(problem.nextRevisionDate)}
                      </div>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400">
                        {getRelativeTimeString(problem.nextRevisionDate)}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full border text-[11px] ${statusConfig.classes}`}>
                        {statusConfig.label}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        {isDueOrOverdue && (
                          <button
                            onClick={() => onRevise(problem._id, 'complete')}
                            className="p-1.5 rounded-lg bg-leetcode-green/10 text-leetcode-green hover:bg-leetcode-green hover:text-white transition-colors"
                            title="Mark as Revised"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => onViewHistory(problem)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                          title="View revision history"
                        >
                          <History className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEditProblem(problem)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                          title="Edit title or notes"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteProblem(problem)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                          title="Delete problem"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
