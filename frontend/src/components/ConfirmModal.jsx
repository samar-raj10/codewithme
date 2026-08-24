import React from 'react';
import { AlertTriangle } from 'lucide-react';

export function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Delete', isDanger = true }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-leetcode-dark-card border border-gray-200 dark:border-leetcode-dark-border rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-base">
              {title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {message}
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 text-xs font-semibold hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl text-white text-xs font-semibold transition-colors ${
              isDanger ? 'bg-red-600 hover:bg-red-700' : 'bg-leetcode-orange hover:bg-leetcode-orange-hover'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
