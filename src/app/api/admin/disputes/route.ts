import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Supabase client with service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// GET - Fetch all disputes
export async function GET() {
  try {
    console.log('Fetching disputes data for admin dashboard...');
    
    if (!supabase) {
      console.error('Supabase client not initialized - check environment variables');
      return NextResponse.json({ 
        error: 'Database connection not configured' 
      }, { status: 500 });
    }

    // Try to fetch disputes - table may not exist yet
    const { data: disputes, error } = await supabase
      .from('disputes')
      .select(`
        *,
        bookings!inner(
          id,
          service_id,
          customer_id,
          assigned_pro_id,
          services(
            title_en
          )
        ),
        opener:profiles!opener_id(
          display_name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      // If disputes table doesn't exist or has errors, return empty array
      console.log('Disputes table not available or no disputes found:', error.message);
      return NextResponse.json({ disputes: [] });
    }

    // Transform disputes data
    const transformedDisputes = disputes?.map(dispute => ({
      id: dispute.id,
      booking_id: dispute.booking_id,
      service_title: dispute.bookings?.services?.title_en || 'Unknown Service',
      opener_name: dispute.opener?.display_name || 'Unknown User',
      reason: dispute.reason,
      details: dispute.details,
      status: dispute.status,
      created_at: dispute.created_at,
      updated_at: dispute.updated_at
    })) || [];

    console.log(`Found ${transformedDisputes.length} disputes`);
    return NextResponse.json({ disputes: transformedDisputes });

  } catch (error) {
    console.error('Error in GET /api/admin/disputes:', error);
    // Return empty array if there's any error (table likely doesn't exist yet)
    return NextResponse.json({ disputes: [] });
  }
}

// POST - Create new dispute (for future implementation)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!supabase) {
      return NextResponse.json({ 
        error: 'Database connection not configured' 
      }, { status: 500 });
    }

    // TODO: Implement dispute creation when disputes table is ready
    const disputeData = {
      booking_id: body.booking_id,
      opener_id: body.opener_id,
      reason: body.reason,
      details: body.details,
      status: 'open',
      created_at: new Date().toISOString()
    };

    return NextResponse.json({ 
      message: 'Dispute creation not yet implemented',
      dispute: disputeData 
    });

  } catch (error) {
    console.error('Error in POST /api/admin/disputes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


