import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    // Update user metadata in Supabase Auth
    const { data: updateData, error: updateError } = await supabase.auth.updateUser({
      data: {
        name: fullName,
        full_name: fullName,
        phone: phone || null,
        address: address || null,
        firstName: firstName || null,
        lastName: lastName || null,
        street: street || null,
        colonia: colonia || null,
        alcaldia: alcaldia || null,
        city: city || null,
        state: state || null,
        postalCode: postalCode || null
      }
    });

    if (updateError) {
      console.error('Error updating user:', updateError);
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Profile updated successfully',
      user: updateData.user 
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}