import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    
    console.log('Received application data:', formData);
    
    if (!supabaseAdmin) {
      // Fallback for when Supabase is not configured
      console.log('Pro application (mock):', formData);
      return NextResponse.json({ 
        success: true, 
        applicationId: 'MOCK-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        message: 'Application received (mock mode)'
      });
    }

    // Generate application ID
    const applicationId = 'APP-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    console.log('Inserting with application ID:', applicationId);

    // Insert into pro_applications table using admin client
    const { data, error } = await supabaseAdmin
      .from('pro_applications')
      .insert([{
        application_id: applicationId,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        services: formData.services,
        experience: formData.experience,
        location: formData.location,
        has_license: formData.hasLicense,
        has_insurance: formData.hasInsurance,
        has_vehicle: formData.hasVehicle,
        status: 'pending',
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        { success: false, error: `Database error: ${error.message}` },
        { status: 500 }
      );
    }

    console.log('Successfully inserted application:', data);

    // TODO: Send confirmation email using your email service
    // For now, just log the email that would be sent
    console.log('Would send confirmation email to:', formData.email);
    
    return NextResponse.json({ 
      success: true, 
      applicationId: applicationId,
      message: 'Application submitted successfully'
    });

  } catch (error) {
    console.error('API error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { success: false, error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}