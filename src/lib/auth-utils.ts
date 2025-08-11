import { NextRequest } from 'next/server';
import { supabase } from './supabase';
import { mockAuth } from './mock-auth';

export async function requireAdmin(request: NextRequest) {
  try {
    if (!supabase) {
      // Mock mode - check if user has admin role in mock session
      // In a real app, you'd validate the session token
      const authHeader = request.headers.get('authorization');
      const mockUser = mockAuth.getCurrentUser();
      
      if (!mockUser || mockUser.role !== 'admin') {
        return { error: 'Admin access required', status: 403 };
      }
      
      return { user: mockUser };
    }

    // Real Supabase mode
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return { error: 'Authentication required', status: 401 };
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return { error: 'Invalid authentication', status: 401 };
    }

    // Check user role in database
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || userProfile?.role !== 'admin') {
      return { error: 'Admin access required', status: 403 };
    }

    return { user, userProfile };

  } catch (error) {
    console.error('Auth middleware error:', error);
    return { error: 'Authentication failed', status: 500 };
  }
}

export function isAdmin(userRole: string | undefined): boolean {
  return userRole === 'admin';
}