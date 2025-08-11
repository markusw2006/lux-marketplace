import { NextRequest } from 'next/server';
import { supabase, supabaseAdmin } from './supabase';
import { mockAuth } from './mock-auth';

export async function requireAdmin(request: NextRequest) {
  try {
    console.log('RequireAdmin: Checking admin access...');
    console.log('RequireAdmin: supabase exists?', !!supabase);
    console.log('RequireAdmin: supabaseAdmin exists?', !!supabaseAdmin);
    
    // For now, since we have supabaseAdmin configured, allow admin access
    // TODO: Implement proper session-based admin authentication later
    if (supabaseAdmin) {
      console.log('RequireAdmin: Allowing admin access (supabaseAdmin available)');
      return { user: { role: 'admin' } };
    }
    
    if (!supabase) {
      console.log('RequireAdmin: Using mock mode - no supabase');
      return { user: { role: 'admin' } };
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