import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth-utils';

// GET /api/admin/pro-applications/[id] - Get specific application
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  
  // Check admin permissions
  const authResult = await requireAdmin(request);
  if (authResult.error) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    const applicationId = params.id;

    if (!supabase) {
      // Mock data when Supabase is not configured
      const mockApplication = {
        id: 1,
        application_id: applicationId,
        first_name: 'Carlos',
        last_name: 'Mendoza',
        email: 'carlos.mendoza@example.com',
        phone: '+52 55 1234 5678',
        services: ['Plumbing', 'Handyman'],
        experience: '5-10',
        location: 'Mexico City',
        has_license: true,
        has_insurance: true,
        has_vehicle: true,
        status: 'pending',
        admin_notes: null,
        created_at: '2025-01-10T10:00:00Z',
        updated_at: '2025-01-10T10:00:00Z'
      };
      
      return NextResponse.json({ application: mockApplication });
    }

    // Get application from database
    const { data: application, error } = await supabase
      .from('pro_applications')
      .select('*')
      .eq('application_id', applicationId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Application not found' },
          { status: 404 }
        );
      }
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch application' },
        { status: 500 }
      );
    }

    return NextResponse.json({ application });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/pro-applications/[id] - Update specific application
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  
  // Check admin permissions
  const authResult = await requireAdmin(request);
  if (authResult.error) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    const applicationId = params.id;
    const updates = await request.json();

    if (!supabase) {
      // Mock response when Supabase is not configured
      console.log('Mock: Updating application', applicationId, 'with', updates);
      return NextResponse.json({ 
        success: true,
        message: 'Application updated successfully (mock)' 
      });
    }

    // Update application in database
    const { data, error } = await supabase
      .from('pro_applications')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('application_id', applicationId)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Application not found' },
          { status: 404 }
        );
      }
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to update application' },
        { status: 500 }
      );
    }

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