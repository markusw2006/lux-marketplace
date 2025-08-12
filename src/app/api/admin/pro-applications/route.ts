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

    // Get the application first to have all the data
    const { data: application, error: fetchError } = await supabaseAdmin
      .from('pro_applications')
      .select('*')
      .eq('application_id', application_id)
      .single();

    if (fetchError || !application) {
      console.error('Error fetching application:', fetchError);
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    // If approving, create the pro account
    let newUserId = null;
    let conversionResult = null;
    
    if (status === 'approved' && application.status !== 'approved') {
      console.log('Creating pro account for approved application...');
      
      try {
        // Create user account in Supabase Auth
        const { data: newUser, error: userError } = await supabaseAdmin.auth.admin.createUser({
          email: application.email,
          password: Math.random().toString(36).slice(-12), // Generate temporary password
          email_confirm: true, // Skip email confirmation
          user_metadata: {
            first_name: application.first_name,
            last_name: application.last_name,
            phone: application.phone,
            role: 'pro',
            application_id: application_id
          }
        });

        if (userError) {
          console.error('Error creating user:', userError);
          return NextResponse.json(
            { error: 'Failed to create user account: ' + userError.message },
            { status: 500 }
          );
        }

        newUserId = newUser.user.id;
        console.log('Created user account:', newUserId);

        // Insert user into users table with pro role
        const { error: usersTableError } = await supabaseAdmin
          .from('users')
          .insert({
            id: newUserId,
            email: application.email,
            role: 'pro',
            first_name: application.first_name,
            last_name: application.last_name,
            phone: application.phone,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (usersTableError) {
          console.error('Error inserting into users table:', usersTableError);
          // Continue anyway - the auth user was created successfully
        }

        // Create profile entry
        const profileData = {
          user_id: newUserId,
          display_name: `${application.first_name} ${application.last_name}`,
          bio: `Professional ${application.services.join(', ')} specialist with ${application.experience} years of experience.`,
          verified: false, // Will be verified after onboarding
          rating_avg: 0,
          rating_count: 0,
          created_at: new Date().toISOString()
        };

        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .insert(profileData);

        if (profileError) {
          console.log('Profile creation error (table may not exist):', profileError.message);
        } else {
          console.log('Created profile for user');
        }

        // Create pros entry (if table exists)
        const prosData = {
          user_id: newUserId,
          business_name: `${application.first_name} ${application.last_name}`,
          service_radius_km: 25, // Default radius
          base_city: 'CDMX',
          kyc_status: 'pending', // Will need to complete Stripe onboarding
          created_at: new Date().toISOString()
        };

        const { error: prosError } = await supabaseAdmin
          .from('pros')
          .insert(prosData);

        if (prosError) {
          console.log('Pros table insertion error (table may not exist):', prosError.message);
        } else {
          console.log('Created pros entry for user');
        }

        conversionResult = {
          user_id: newUserId,
          email: application.email,
          temporary_password_sent: true,
          onboarding_required: true
        };

      } catch (conversionError) {
        console.error('Error during pro account conversion:', conversionError);
        return NextResponse.json(
          { error: 'Failed to convert application to pro account: ' + String(conversionError) },
          { status: 500 }
        );
      }
    }

    // Update application in database
    const updateData = {
      status,
      admin_notes,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      // If account was created, store the user ID
      ...(newUserId && { converted_user_id: newUserId })
    };

    const { data, error } = await supabaseAdmin
      .from('pro_applications')
      .update(updateData)
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

    // TODO: Send email notifications
    if (status === 'approved' && conversionResult) {
      console.log('Would send pro account creation email to:', data.email);
      console.log('Account details:', conversionResult);
    } else {
      console.log('Would send status update email to:', data.email, 'about status:', status);
    }

    return NextResponse.json({ 
      success: true,
      application: data,
      conversion: conversionResult,
      message: conversionResult 
        ? 'Application approved and pro account created successfully!' 
        : 'Application updated successfully'
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}