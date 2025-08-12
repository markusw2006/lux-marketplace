import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Supabase client with service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// GET - Fetch all bookings with transaction data
export async function GET() {
  try {
    console.log('Fetching bookings data for admin dashboard...');
    
    if (!supabase) {
      console.error('Supabase client not initialized - check environment variables');
      return NextResponse.json({ 
        error: 'Database connection not configured' 
      }, { status: 500 });
    }

    // Fetch bookings and related data separately (join in app layer)
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (bookingsError) {
      console.error('Error fetching bookings:', bookingsError);
      return NextResponse.json({ error: bookingsError.message }, { status: 500 });
    }

    // Fetch services separately
    const { data: services } = await supabase
      .from('services')
      .select('id, title_en, title_es, fixed_base_price');

    // Fetch transactions separately  
    const { data: transactions } = await supabase
      .from('transactions')
      .select('id, booking_id, amount_total, platform_fee, status, created_at');

    // Create lookup maps (handle both UUID and slug IDs)
    const servicesMap = new Map();
    services?.forEach(s => {
      servicesMap.set(s.id, s);
      
      // Also create a fallback mapping from title to service for slug-based lookups
      const slug = s.title_en?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      if (slug) {
        servicesMap.set(slug, s);
      }
    });
    
    // Special case mappings for common service IDs that don't match
    servicesMap.set('basic-cleaning', services?.find(s => s.title_en === 'Basic Cleaning Service'));
    
    const transactionsMap = new Map();
    transactions?.forEach(t => {
      if (!transactionsMap.has(t.booking_id)) {
        transactionsMap.set(t.booking_id, []);
      }
      transactionsMap.get(t.booking_id).push(t);
    });

    // Transform data for admin dashboard (using app-layer joins)
    const transformedBookings = bookings?.map(booking => {
      const service = servicesMap.get(booking.service_id);
      const bookingTransactions = transactionsMap.get(booking.id) || [];
      
      return {
        id: booking.id,
        service_title: service?.title_en || 'Unknown Service',
        customer_name: booking.customer_name || 'Unknown Customer',
        customer_email: booking.customer_email || null,
        pro_name: 'Unassigned', // No assigned_pro_id in current schema
        status: booking.status,
        total_amount: booking.fixed_price_total || service?.fixed_base_price || 0,
        platform_fee: bookingTransactions[0]?.platform_fee || 0,
        created_at: booking.created_at,
        sla_window_start: booking.sla_window_start,
        sla_window_end: booking.sla_window_end,
        assignment_status: booking.assignment_status,
        customer_id: booking.customer_id,
        customer_address: booking.customer_address
      };
    }) || [];

    console.log(`Found ${transformedBookings.length} bookings`);
    return NextResponse.json({ bookings: transformedBookings });

  } catch (error) {
    console.error('Error in GET /api/admin/bookings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}