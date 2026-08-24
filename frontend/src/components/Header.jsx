import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, Flame, RefreshCw, Layers, PlusCircle, LogOut, User } from 'lucide-react';

export function Header({ stats, onRefresh, onOpenMobileLog }) {
  const { darkMode, toggleDarkMode } = useTheme();
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-leetcode-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-leetcode-dark-border transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-leetcode-orange to-amber-400 flex items-center justify-center shadow-lg shadow-leetcode-orange/20 text-white font-bold text-xl">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">
                Leet<span className="text-leetcode-orange">Revise</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md bg-leetcode-orange/10 text-leetcode-orange border border-leetcode-orange/20">
                Spaced Repetition
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
              Never forget solved LeetCode problems
            </p>
          </div>
        </div>

        {/* User Badge, Stats & Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {stats && (
            <div className="hidden md:flex items-center gap-3 bg-gray-100 dark:bg-zinc-800/80 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-zinc-700/60 text-xs">
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold" title="Current daily revision streak">
                <Flame className="w-4 h-4 text-leetcode-orange animate-bounce-subtle" />
                <span>{stats.streak || 0} Day Streak</span>
              </div>
              <div className="w-px h-3 bg-gray-300 dark:bg-zinc-600" />
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                <Layers className="w-3.5 h-3.5" />
                <span>{stats.totalTracked || 0} Tracked</span>
              </div>
            </div>
          )}

          {/* User Account Email Badge */}
          {user && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700/60 text-xs text-gray-700 dark:text-gray-300 font-medium">
              <User className="w-3.5 h-3.5 text-leetcode-orange" />
              <span className="truncate max-w-[140px]">{user.email}</span>
            </div>
          )}

          {/* Quick Refresh */}
          <button
            onClick={onRefresh}
            title="Refresh dashboard data"
            className="p-2 rounded-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Mobile Log Button */}
          <button
            onClick={onOpenMobileLog}
            className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-leetcode-orange hover:bg-leetcode-orange-hover text-white text-xs font-semibold shadow-md transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Log</span>
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
          </button>

          {/* Sign Out Button */}
          {user && (
            <button
              onClick={signOut}
              title="Sign Out of LeetRevise"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 text-xs font-semibold transition-all shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
