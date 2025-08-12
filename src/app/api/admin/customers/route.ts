import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Supabase client with service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// GET - Fetch all customers
export async function GET() {
  try {
    console.log('Fetching customers data for admin dashboard...');
    
    if (!supabase) {
      console.error('Supabase client not initialized - check environment variables');
      return NextResponse.json({ 
        error: 'Database connection not configured' 
      }, { status: 500 });
    }

    // Fetch customers from users table and bookings separately
    const { data: customers, error: customersError } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (customersError) {
      console.error('Error fetching customers:', customersError);
      return NextResponse.json({ error: customersError.message }, { status: 500 });
    }

    // Fetch all bookings to calculate customer statistics
    const { data: allBookings } = await supabase
      .from('bookings')
      .select('id, customer_id, status, fixed_price_total, created_at');

    // Create a map of customer bookings
    const customerBookingsMap = new Map();
    allBookings?.forEach(booking => {
      if (!customerBookingsMap.has(booking.customer_id)) {
        customerBookingsMap.set(booking.customer_id, []);
      }
      customerBookingsMap.get(booking.customer_id).push(booking);
    });

    // Transform customer data and calculate statistics
    const transformedCustomers = customers?.map(customer => {
      // Calculate customer statistics from their bookings
      const customerBookings = customerBookingsMap.get(customer.id) || [];
      const totalBookings = customerBookings.length;
      const totalSpent = customerBookings
        .filter((b: any) => b.status === 'completed')
        .reduce((sum: number, b: any) => sum + (b.fixed_price_total || 0), 0);

      return {
        user_id: customer.id,
        display_name: `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'Unknown Customer',
        email: customer.email || null,
        phone: customer.phone || null,
        total_bookings: totalBookings,
        total_spent: totalSpent,
        created_at: customer.created_at,
        role: customer.role,
        blacklisted: false, // TODO: Add blacklist functionality
        notes: null, // TODO: Add customer notes
        last_booking: customerBookings.length > 0 
          ? Math.max(...customerBookings.map((b: any) => new Date(b.created_at).getTime()))
          : null
      };
    }) || [];

    console.log(`Found ${transformedCustomers.length} customers`);
    return NextResponse.json({ customers: transformedCustomers });

  } catch (error) {
    console.error('Error in GET /api/admin/customers:', error);
    return NextResponse.json({ customers: [] });
  }
}