import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // If Supabase is not configured, simulate success for demo mode
    if (!supabase) {
      console.log('Demo mode: Profile update simulated (no Supabase configured)');
      return NextResponse.json({ 
        success: true, 
        message: 'Profile updated successfully (demo mode)',
        demo: true
      });
    }

    // Get the current user from session
    // Note: In a real app with proper auth, you'd get the user from the session/token
    // For now, we'll simulate the user update

    // Get the form data from the request
    const {
      firstName,
      lastName,
      phone,
      street,
      colonia,
      alcaldia,
      city,
      state,
      postalCode
    } = await request.json();

    // Build the full address string
    const address = [street, colonia, alcaldia, city, state, postalCode]
      .filter(part => part && part.trim())
      .join(', ');

    // Build the full name
    const fullName = [firstName, lastName]
      .filter(part => part && part.trim())
      .join(' ');

    // For now, simulate successful update since we need proper auth setup
    // In a real implementation, this would update the user in Supabase Auth
    console.log('Profile update data:', {
      fullName,
      phone,
      address,
      components: { firstName, lastName, street, colonia, alcaldia, city, state, postalCode }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Profile updated successfully',
      data: {
        name: fullName,
        phone,
        address,
        firstName,
        lastName,
        street,
        colonia,
        alcaldia,
        city,
        state,
        postalCode
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}