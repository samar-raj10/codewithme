import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const AuthContext = createContext();

// Helper to generate a consistent, deterministic user ID from email for local/demo mode
function getDeterministicUserId(email) {
  if (!email) return 'demo-local-user-id';
  const clean = email.toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
  return `user_${clean}`;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Check local storage for demo user session fallback
      const savedDemoUser = localStorage.getItem('leetrevise_demo_user');
      if (savedDemoUser) {
        try {
          const parsedUser = JSON.parse(savedDemoUser);
          const userId = getDeterministicUserId(parsedUser.email);
          const currentUser = { id: userId, email: parsedUser.email };
          setUser(currentUser);
          setSession({ access_token: `demo-user-${userId}`, user: currentUser });
        } catch (e) {
          console.error('Error parsing demo user session:', e);
        }
      }
      setLoading(false);
      return;
    }

    // 1. Get initial Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 2. Listen for live auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sign Up with Email and Password
  const signUp = async (email, password) => {
    if (!isSupabaseConfigured) {
      const userId = getDeterministicUserId(email);
      const mockUser = { id: userId, email };
      localStorage.setItem('leetrevise_demo_user', JSON.stringify(mockUser));
      setUser(mockUser);
      setSession({ access_token: `demo-user-${userId}`, user: mockUser });
      return { data: { user: mockUser }, error: null };
    }
    const { data, error } = await supabase.auth.signUp({ email, password });
    return { data, error };
  };

  // Sign In with Email and Password
  const signIn = async (email, password) => {
    if (!isSupabaseConfigured) {
      const userId = getDeterministicUserId(email);
      const mockUser = { id: userId, email };
      localStorage.setItem('leetrevise_demo_user', JSON.stringify(mockUser));
      setUser(mockUser);
      setSession({ access_token: `demo-user-${userId}`, user: mockUser });
      return { data: { user: mockUser }, error: null };
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  };

  // Sign Out
  const signOut = async () => {
    if (!isSupabaseConfigured) {
      localStorage.removeItem('leetrevise_demo_user');
      setUser(null);
      setSession(null);
      return { error: null };
    }
    const { error } = await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    return { error };
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut, isSupabaseConfigured }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
