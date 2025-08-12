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
  const [loggedOut, setLoggedOut] = useState(false);

  useEffect(() => {
    // Check if user was manually logged out, but reset the flag on reload to allow fresh logins
    const wasLoggedOut = localStorage.getItem('manually_logged_out') === 'true';
    if (wasLoggedOut) {
      // Only stay logged out if it's recent (within 5 minutes)
      const logoutTime = localStorage.getItem('logout_timestamp');
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000;
      
      if (logoutTime && (now - parseInt(logoutTime)) < fiveMinutes) {
        setLoggedOut(true);
        setLoading(false);
        return;
      } else {
        // Clear old logout flag
        localStorage.removeItem('manually_logged_out');
        localStorage.removeItem('logout_timestamp');
      }
    }

    // If Supabase is not configured, check for mock user
    if (!supabase) {
      const mockUser = mockAuth.getCurrentUser();
      if (mockUser && !loggedOut) {
        setUser(mockUser as any);
        setUserProfile(mockUser);
      }
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && !loggedOut) {
        setUser(session.user);
        fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserProfile(null);
        setLoggedOut(false); // Reset logout flag when Supabase confirms sign out
      } else if (event === 'SIGNED_IN' && session?.user) {
        // Clear logout flag when user successfully signs in
        setLoggedOut(false);
        localStorage.removeItem('manually_logged_out');
        localStorage.removeItem('logout_timestamp');
        setUser(session.user);
        fetchUserProfile(session.user.id);
      } else if (session?.user && !loggedOut) {
        setUser(session.user);
        fetchUserProfile(session.user.id);
      } else if (!session?.user) {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [loggedOut]);

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
    // Set logout flag immediately to prevent re-login
    setLoggedOut(true);
    
    try {
      if (supabase) {
        // Try multiple logout strategies for Supabase
        try {
          // First try global logout
          await supabase.auth.signOut({ scope: 'global' });
        } catch (globalError) {
          console.warn('Global logout failed, trying local logout:', globalError);
          try {
            // Fallback to local logout
            await supabase.auth.signOut({ scope: 'local' });
          } catch (localError) {
            console.warn('Local logout failed, forcing manual cleanup:', localError);
            // Force manual session cleanup if both fail
            if (supabase.auth.admin) {
              try {
                await supabase.auth.admin.signOut();
              } catch (adminError) {
                console.warn('Admin logout failed:', adminError);
              }
            }
          }
        }
      } else {
        // Use mock auth sign out
        mockAuth.signOut();
      }
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      // Always clear local state regardless of Supabase success/failure
      setUser(null);
      setUserProfile(null);
      
      // Clear any stored profile data and session data
      if (typeof window !== 'undefined') {
        // Set logout flag in localStorage to persist across page reloads
        localStorage.setItem('manually_logged_out', 'true');
        localStorage.setItem('logout_timestamp', Date.now().toString());
        
        // Clear all profile data from localStorage
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('profile_') || 
              key.startsWith('supabase.') || 
              key.includes('auth.') ||
              key.includes('session')) {
            localStorage.removeItem(key);
          }
        });
        
        // Clear other auth-related data
        localStorage.removeItem('mockUser');
        
        // Clear sessionStorage as well
        try {
          Object.keys(sessionStorage).forEach(key => {
            if (key.startsWith('supabase.') || 
                key.includes('auth.') ||
                key.includes('session')) {
              sessionStorage.removeItem(key);
            }
          });
        } catch (e) {
          console.warn('Could not clear sessionStorage:', e);
        }
        
        // Clear any cookies related to auth
        try {
          document.cookie.split(';').forEach(cookie => {
            const eqPos = cookie.indexOf('=');
            const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
            if (name.includes('supabase') || name.includes('auth') || name.includes('session')) {
              document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.vercel.app`;
              document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
            }
          });
        } catch (e) {
          console.warn('Could not clear cookies:', e);
        }
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