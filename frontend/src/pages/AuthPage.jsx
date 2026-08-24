import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, UserPlus, Sparkles, AlertCircle, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';

export function AuthPage() {
  const { signIn, signUp, isSupabaseConfigured } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error: authError } = await signUp(email, password);
        if (authError) {
          setError(authError.message);
        } else if (data?.user && !data?.session) {
          setSuccessMsg('Account created! Please check your email to confirm your account before logging in.');
        } else {
          setSuccessMsg('Account created successfully!');
        }
      } else {
        const { error: authError } = await signIn(email, password);
        if (authError) {
          setError(authError.message || 'Invalid email or password.');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-leetcode-dark text-gray-900 dark:text-gray-100 px-4 transition-colors">
      {/* Container */}
      <div className="w-full max-w-md space-y-6">
        {/* Brand Logo & Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-leetcode-orange to-amber-400 items-center justify-center shadow-lg shadow-leetcode-orange/20 text-white font-bold text-2xl mb-1">
            ⚡
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Leet<span className="text-leetcode-orange">Revise</span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Sign in to access your personal LeetCode spaced-repetition dashboard
          </p>
        </div>

        {!isSupabaseConfigured && (
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Demo Mode Active</p>
              <p className="text-[11px] mt-0.5 text-amber-700 dark:text-amber-400">
                To link live Supabase Auth, add <code>VITE_SUPABASE_URL</code> & <code>VITE_SUPABASE_ANON_KEY</code> to <code>frontend/.env</code>. You can log in below to test demo mode right away!
              </p>
            </div>
          </div>
        )}

        {/* Auth Form Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-leetcode-dark-card border border-gray-200 dark:border-leetcode-dark-border shadow-xl space-y-5">
          {/* Toggle Tabs */}
          <div className="grid grid-cols-2 p-1 bg-gray-100 dark:bg-zinc-800/80 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setIsSignUp(false); setError(''); setSuccessMsg(''); }}
              className={`py-2 rounded-lg transition-all ${
                !isSignUp
                  ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsSignUp(true); setError(''); setSuccessMsg(''); }}
              className={`py-2 rounded-lg transition-all ${
                isSignUp
                  ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/60 text-xs text-red-600 dark:text-red-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-700 dark:text-emerald-300 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-500" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-leetcode-orange/50 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-leetcode-orange/50 transition-all"
                />
              </div>
            </div>

            {/* Confirm Password Field (Sign Up Only) */}
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-leetcode-orange/50 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-leetcode-orange hover:bg-leetcode-orange-hover text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-leetcode-orange/20 transition-all disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : isSignUp ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In to Dashboard</span>
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-[11px] text-center text-gray-400 dark:text-gray-500">
          🔒 Secure authentication powered by Supabase. Your problem data is encrypted and isolated.
        </p>
      </div>
    </div>
  );
}
