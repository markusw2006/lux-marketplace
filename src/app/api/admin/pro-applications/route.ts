import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth-utils';

// GET /api/admin/pro-applications - List all applications
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
      // Return empty applications array when Supabase is not configured
      // This shows the live system is working but no real data exists yet
      return NextResponse.json({ applications: [] });
    }

    console.log('Fetching applications from database...');

    // Get applications from database using admin client
    const { data: applications, error } = await supabaseAdmin
      .from('pro_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch applications' },
        { status: 500 }
      );
    }

    return NextResponse.json({ applications });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/pro-applications - Update application status
export async function PATCH(request: NextRequest) {
  // Check admin permissions
  const authResult = await requireAdmin(request);
  if (authResult.error) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    const { application_id, status, admin_notes } = await request.json();

    if (!application_id || !status) {
      return NextResponse.json(
        { error: 'Application ID and status are required' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      // Mock response when Supabase is not configured
      console.log('Mock: Updating application', { application_id, status, admin_notes });
      return NextResponse.json({ 
        success: true,
        message: 'Application updated successfully (mock)' 
      });
    }

    // Update application in database using admin client
    const { data, error } = await supabaseAdmin
      .from('pro_applications')
      .update({
        status,
        admin_notes,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
        // TODO: Set reviewed_by to the current admin user ID when auth is integrated
      })
      .eq('application_id', application_id)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to update application' },
        { status: 500 }
      );
    }

    // TODO: Send email notification to applicant about status change
    console.log('Would send email notification to:', data.email, 'about status:', status);

    return NextResponse.json({ 
      success: true,
      application: data,
      message: 'Application updated successfully' 
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}