import { NextRequest } from "next/server";
import { getSupabaseService } from "@/lib/db";

export async function GET(_req: NextRequest) {
  try {
    console.log('Testing database connection...');
    
    const sb = getSupabaseService();
    if (!sb) {
      return Response.json({ 
        error: 'Supabase service client not configured',
        env_check: {
          url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          service_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY
        }
      });
    }

    console.log('Supabase client created, testing connection...');

    // Test basic connection
    const { data, error, count } = await sb
      .from('bookings')
      .select('*', { count: 'exact' })
      .limit(5);

    console.log('Database query result:', { data: data?.length || 0, error, count });

    if (error) {
      return Response.json({ 
        error: 'Database query failed', 
        details: error,
        supabase_configured: true 
      });
    }

    // Test insert capability
    const testInsert = {
      service_id: 1,
      customer_id: null,
      fixed_price_total: 10000,
      addons: {},
      status: 'booked'
    };

    console.log('Testing insert with:', testInsert);

    const { data: insertData, error: insertError } = await sb
      .from('bookings')
      .insert(testInsert)
      .select()
      .single();

    return Response.json({
      success: true,
      connection: 'OK',
      existing_bookings: data?.length || 0,
      total_count: count,
      test_insert: insertError ? { error: insertError } : { success: true, id: insertData?.id },
      environment: {
        url_configured: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        service_key_configured: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      }
    });

  } catch (error) {
    console.error('Database test error:', error);
    return Response.json({ 
      error: 'Test failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}