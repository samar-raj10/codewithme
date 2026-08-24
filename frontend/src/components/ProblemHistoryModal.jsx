import React from 'react';
import { X, CheckCircle2, XCircle, Clock, Calendar, History } from 'lucide-react';
import { formatDate, formatDateTime, STAGE_LABELS } from '../utils/dateHelpers';

export function ProblemHistoryModal({ problem, onClose }) {
  if (!problem) return null;

  const history = problem.revisionHistory || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-leetcode-dark-card border border-gray-200 dark:border-leetcode-dark-border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-base px-2.5 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 text-leetcode-orange">
              #{problem.questionNumber}
            </span>
            <h3 className="font-bold text-gray-900 dark:text-white text-base truncate max-w-xs">
              {problem.questionTitle || 'Revision History'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* First Attempt Info */}
        <div className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100 dark:border-zinc-700/60 text-xs flex items-center justify-between text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-leetcode-orange" />
            <span>First Attempt Logged:</span>
          </div>
          <span className="font-medium text-gray-900 dark:text-white">
            {formatDateTime(problem.firstAttemptDate)}
          </span>
        </div>

        {/* Revision History Timeline */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Revision Checkpoint Logs ({history.length})
          </h4>

          {history.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-500 dark:text-gray-400">
              No revisions completed yet. First revision scheduled for {formatDate(problem.nextRevisionDate)}.
            </div>
          ) : (
            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200 dark:before:bg-zinc-700">
              {history.map((log, index) => {
                const stageLabel = STAGE_LABELS[log.stage] || log.stage;
                return (
                  <div key={index} className="relative flex items-start gap-3">
                    {/* Timeline Node */}
                    <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-white dark:bg-leetcode-dark-card border-2 border-leetcode-orange flex items-center justify-center">
                      {log.wasCompleted ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <XCircle className="w-3 h-3 text-gray-400" />
                      )}
                    </div>

                    <div className="flex-1 p-3 rounded-xl bg-gray-50 dark:bg-zinc-800/40 border border-gray-100 dark:border-zinc-700/40 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {stageLabel}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                          log.wasCompleted
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-gray-100 text-gray-600 dark:bg-zinc-700 dark:text-gray-300'
                        }`}>
                          {log.wasCompleted ? 'Completed' : 'Skipped'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                        <span>Scheduled: {formatDate(log.scheduledDate)}</span>
                        <span>Done: {formatDateTime(log.completedDate)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-800 dark:text-gray-200 text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
