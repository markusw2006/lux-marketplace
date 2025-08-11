import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
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
    if (!supabase) {
      // Mock data when Supabase is not configured
      const mockApplications = [
        {
          id: 1,
          application_id: 'APP-ABC123',
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
        },
        {
          id: 2,
          application_id: 'APP-DEF456',
          first_name: 'Ana',
          last_name: 'López',
          email: 'ana.lopez@example.com',
          phone: '+52 55 9876 5432',
          services: ['Cleaning'],
          experience: '3-5',
          location: 'Mexico City',
          has_license: false,
          has_insurance: true,
          has_vehicle: false,
          status: 'under_review',
          admin_notes: 'Good references, checking background',
          created_at: '2025-01-09T14:30:00Z',
          updated_at: '2025-01-10T09:15:00Z'
        }
      ];
      
      return NextResponse.json({ applications: mockApplications });
    }

    // Get applications from database
    const { data: applications, error } = await supabase
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

    if (!supabase) {
      // Mock response when Supabase is not configured
      console.log('Mock: Updating application', { application_id, status, admin_notes });
      return NextResponse.json({ 
        success: true,
        message: 'Application updated successfully (mock)' 
      });
    }

    // Update application in database
    const { data, error } = await supabase
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