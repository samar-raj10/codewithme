import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle, SkipForward, AlertTriangle, Clock, ExternalLink, StickyNote, History } from 'lucide-react';
import { formatDate, getRelativeTimeString, STAGE_LABELS, STAGE_BADGE_COLORS } from '../utils/dateHelpers';

export function DueSection({ dueProblems = [], onRevise, onViewHistory }) {
  const [loadingId, setLoadingId] = useState(null);

  const handleMarkComplete = async (problem, e) => {
    e.stopPropagation();
    setLoadingId(problem._id);
    try {
      // Trigger festive confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
      await onRevise(problem._id, 'complete');
    } finally {
      setLoadingId(null);
    }
  };

  const handleSkip = async (problem, e) => {
    e.stopPropagation();
    setLoadingId(problem._id);
    try {
      await onRevise(problem._id, 'skip');
    } finally {
      setLoadingId(null);
    }
  };

  if (dueProblems.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-amber-500/5 to-transparent border border-emerald-500/20 dark:border-emerald-500/30 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-500 text-2xl flex-shrink-0">
            🎯
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              All Caught Up! No Revisions Due Today
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
              You've completed all scheduled checkpoints for today. Keep logging new problems as you solve them!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-leetcode-orange animate-ping" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
            Due for Revision Today ({dueProblems.length})
          </h2>
        </div>
        <span className="text-xs text-leetcode-orange font-medium">
          Action required to advance stage
        </span>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dueProblems.map((problem) => {
          const isOverdue = problem.status === 'overdue';
          const stageBadge = STAGE_BADGE_COLORS[problem.revisionStage] || STAGE_BADGE_COLORS.day3;
          const stageLabel = STAGE_LABELS[problem.revisionStage] || problem.revisionStage;
          const isProcessing = loadingId === problem._id;

          return (
            <div
              key={problem._id}
              className={`p-5 rounded-2xl border transition-all duration-200 bg-white dark:bg-leetcode-dark-card flex flex-col justify-between shadow-md relative overflow-hidden ${
                isOverdue
                  ? 'border-red-300 dark:border-red-900/60 shadow-red-500/5'
                  : 'border-amber-300 dark:border-amber-700/60 shadow-amber-500/5'
              }`}
            >
              {/* Top Accent Strip */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 ${
                  isOverdue ? 'bg-red-500' : 'bg-leetcode-orange'
                }`}
              />

              <div>
                {/* Header info */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-zinc-800 text-leetcode-orange border border-gray-200 dark:border-zinc-700">
                      #{problem.questionNumber}
                    </span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${stageBadge}`}>
                      {stageLabel}
                    </span>
                  </div>

                  <button
                    onClick={() => onViewHistory(problem)}
                    title="View revision history"
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1"
                  >
                    <History className="w-4 h-4" />
                  </button>
                </div>

                {/* Question Title */}
                <h3 className="font-semibold text-gray-900 dark:text-white text-base line-clamp-1 mb-2">
                  {problem.questionTitle || `LeetCode Problem #${problem.questionNumber}`}
                </h3>

                {/* LeetCode link */}
                <a
                  href={`https://leetcode.com/problemset/all/?search=${problem.questionNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-500 hover:underline mb-3"
                >
                  <span>Open on LeetCode</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                {/* Due status details */}
                <div className="flex items-center gap-2 text-xs mb-3">
                  {isOverdue ? (
                    <div className="flex items-center gap-1 text-red-600 dark:text-red-400 font-medium">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{getRelativeTimeString(problem.nextRevisionDate)}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Due Today ({formatDate(problem.nextRevisionDate)})</span>
                    </div>
                  )}
                </div>

                {/* Notes Preview if available */}
                {problem.notes && (
                  <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100 dark:border-zinc-700/50 mb-4 text-xs text-gray-600 dark:text-gray-300 italic flex items-start gap-1.5">
                    <StickyNote className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{problem.notes}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-gray-100 dark:border-zinc-800/80 flex items-center gap-2">
                <button
                  onClick={(e) => handleMarkComplete(problem, e)}
                  disabled={isProcessing}
                  className="flex-1 py-2 px-3 rounded-xl bg-leetcode-green hover:bg-emerald-600 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Mark Revised</span>
                </button>

                <button
                  onClick={(e) => handleSkip(problem, e)}
                  disabled={isProcessing}
                  className="py-2 px-3 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 font-medium text-xs flex items-center justify-center gap-1 transition-all disabled:opacity-50"
                  title="Keep visible without advancing stage"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                  <span>Skip</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
