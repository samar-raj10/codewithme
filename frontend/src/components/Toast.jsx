import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const { type, message } = toast;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
  };

  const bgStyles = {
    success: 'border-emerald-500/30 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 shadow-emerald-500/10',
    error: 'border-red-500/30 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 shadow-red-500/10',
    info: 'border-blue-500/30 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 shadow-blue-500/10'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in max-w-sm w-full">
      <div className={`flex items-center gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md ${bgStyles[type] || bgStyles.info}`}>
        {icons[type] || icons.info}
        <p className="text-sm font-medium flex-1">{message}</p>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
