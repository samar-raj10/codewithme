import React, { useState } from 'react';
import { PlusCircle, Hash, Type, FileText, Loader2, Sparkles } from 'lucide-react';

export function SidebarForm({ onSubmitProblem, isSubmitting }) {
  const [questionNumber, setQuestionNumber] = useState('');
  const [questionTitle, setQuestionTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const num = parseInt(questionNumber.trim(), 10);
    if (!questionNumber || isNaN(num) || num <= 0) {
      setError('Please enter a valid positive question number');
      return;
    }

    try {
      await onSubmitProblem({
        questionNumber: num,
        questionTitle: questionTitle.trim(),
        notes: notes.trim()
      });
      // Reset form on success
      setQuestionNumber('');
      setQuestionTitle('');
      setNotes('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log problem');
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-leetcode-dark-card border border-gray-200 dark:border-leetcode-dark-border shadow-sm">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-zinc-800">
        <Sparkles className="w-5 h-5 text-leetcode-orange" />
        <h2 className="text-base font-bold text-gray-900 dark:text-white">
          Log Solved Problem
        </h2>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/60 text-xs text-red-600 dark:text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Question Number */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Question Number <span className="text-leetcode-orange">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Hash className="w-4 h-4" />
            </div>
            <input
              type="number"
              min="1"
              step="1"
              required
              placeholder="e.g. 1, 206, 146"
              value={questionNumber}
              onChange={(e) => setQuestionNumber(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/80 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-leetcode-orange/50 transition-all font-mono"
            />
          </div>
        </div>

        {/* Question Title */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Question Title <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Type className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="e.g. Two Sum, Reverse Linked List"
              value={questionTitle}
              onChange={(e) => setQuestionTitle(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/80 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-leetcode-orange/50 transition-all"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Approach & Notes <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <div className="absolute top-2.5 left-3 pointer-events-none text-gray-400">
              <FileText className="w-4 h-4" />
            </div>
            <textarea
              rows="3"
              placeholder="Jot down time/space complexity, key tricks, edge cases..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/80 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-leetcode-orange/50 transition-all resize-none"
            />
          </div>
        </div>

        {/* Info Note */}
        <p className="text-[11px] text-gray-500 dark:text-gray-400 italic">
          📅 First revision date will automatically be set to <strong>3 days</strong> from now.
        </p>

        {/* Submit CTA */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 px-4 rounded-xl bg-leetcode-orange hover:bg-leetcode-orange-hover text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-leetcode-orange/20 transition-all disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Logging Attempt...</span>
            </>
          ) : (
            <>
              <PlusCircle className="w-4 h-4" />
              <span>Start Revision Cycle</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
