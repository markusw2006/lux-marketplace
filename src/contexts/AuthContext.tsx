'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { mockAuth } from '@/lib/mock-auth';

interface AuthContextType {
  user: User | null;
  userProfile: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If Supabase is not configured, check for mock user
    if (!supabase) {
      const mockUser = mockAuth.getCurrentUser();
      if (mockUser) {
        setUser(mockUser as any);
        setUserProfile(mockUser);
      }
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    if (!supabase) return;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const signOut = async () => {
    try {
      if (supabase) {
        // Try to sign out from Supabase, but don't worry if it fails
        await supabase.auth.signOut();
      } else {
        // Use mock auth sign out
        mockAuth.signOut();
      }
    } catch (error) {
      // Ignore Supabase logout errors (like 403) - just clear local state
      console.warn('Supabase logout failed, clearing local state:', error);
    } finally {
      // Always clear local state regardless of Supabase success/failure
      setUser(null);
      setUserProfile(null);
      
      // Clear stored data
      if (typeof window !== 'undefined') {
        // Clear profile data
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('profile_')) {
            localStorage.removeItem(key);
          }
        });
        localStorage.removeItem('mockUser');
      }
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}