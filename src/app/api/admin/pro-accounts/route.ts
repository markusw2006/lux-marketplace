import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth-utils';

// GET /api/admin/pro-accounts - List all pro accounts created from applications
export async function GET(request: NextRequest) {
  // Check admin permissions
  const authResult = await requireAdmin(request);
  if (authResult.error) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ accounts: [] });
    }

    console.log('Fetching pro accounts from database...');

    // Get users with pro role
    const { data: proUsers, error: usersError } = await supabaseAdmin
      .from('users')
      .select(`
        id,
        email,
        first_name,
        last_name,
        phone,
        role,
        created_at,
        updated_at
      `)
      .eq('role', 'pro')
      .order('created_at', { ascending: false });

    if (usersError) {
      console.error('Database error:', usersError);
      return NextResponse.json(
        { error: 'Failed to fetch pro accounts' },
        { status: 500 }
      );
    }

    // Get associated applications if they exist
    const { data: applications, error: appsError } = await supabaseAdmin
      .from('pro_applications')
      .select('*')
      .eq('status', 'approved')
      .not('converted_user_id', 'is', null);

    if (appsError) {
      console.log('Applications fetch error (table may not exist):', appsError.message);
    }

    // Match users with their applications
    const accounts = proUsers?.map(user => {
      const application = applications?.find(app => app.converted_user_id === user.id);
      return {
        user_id: user.id,
        email: user.email,
        name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown',
        phone: user.phone,
        created_at: user.created_at,
        application_id: application?.application_id || null,
        services: application?.services || [],
        experience: application?.experience || null,
        conversion_date: application?.reviewed_at || user.created_at
      };
    }) || [];

    console.log(`Found ${accounts.length} pro accounts`);
    return NextResponse.json({ accounts });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}