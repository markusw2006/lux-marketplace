import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase client with service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// GET - Debug service IDs and bookings relationship
export async function GET() {
  try {
    console.log('Debug service-booking relationship...');
    
    if (!supabase) {
      return NextResponse.json({ 
        error: 'Database connection not configured' 
      }, { status: 500 });
    }

    // Get all services
    const { data: services } = await supabase
      .from('services')
      .select('id, title_en');

    // Get booking service_ids
    const { data: bookings } = await supabase
      .from('bookings')
      .select('id, service_id')
      .limit(5);

    console.log('Services:', services);
    console.log('Bookings service_ids:', bookings?.map(b => ({ id: b.id, service_id: b.service_id })));

    return NextResponse.json({ 
      services,
      bookingServiceIds: bookings?.map(b => ({ id: b.id, service_id: b.service_id })),
      message: 'Debug data retrieved'
    });

  } catch (error) {
    console.error('Error in debug route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}