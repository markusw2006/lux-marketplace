import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    
    if (!supabase) {
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

    // Insert into pro_applications table
    const { data, error } = await supabase
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
      return NextResponse.json(
        { success: false, error: 'Failed to save application' },
        { status: 500 }
      );
    }

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
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}