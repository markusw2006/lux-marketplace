import { NextRequest } from "next/server";
import { getSupabaseService } from "@/lib/db";

export async function POST(_req: NextRequest) {
  console.log('=== DIRECT TEST INSERT ===');
  
  const sb = getSupabaseService();
  if (!sb) {
    return Response.json({ error: 'Supabase not configured' });
  }

  const testBooking = {
    service_id: 'basic-cleaning',
    customer_id: null,
    fixed_price_total: 12700,
    addons: { oven: 1 },
    status: 'booked',
    customer_name: 'Test Customer',
    customer_email: 'test@example.com',
    customer_phone: '555-1234',
    customer_address: 'Test Address 123'
  };

  console.log('Inserting test booking:', testBooking);

  try {
    const { data, error } = await sb
      .from("bookings")
      .insert(testBooking)
      .select()
      .single();

    console.log('Insert result:', { data, error });

    if (error) {
      console.error('Insert error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      return Response.json({ 
        error: 'Insert failed', 
        details: error,
        testData: testBooking 
      });
    }

    // Check if it was actually saved
    const { data: checkData, error: checkError } = await sb
      .from("bookings")
      .select("*")
      .limit(5);

    console.log('All bookings after insert:', checkData);

    return Response.json({ 
      success: true, 
      insertedData: data,
      allBookings: checkData,
      testData: testBooking
    });

  } catch (error) {
    console.error('Catch block error:', error);
    return Response.json({ 
      error: 'Exception caught', 
      details: error instanceof Error ? error.message : 'Unknown error',
      testData: testBooking
    });
  }
}