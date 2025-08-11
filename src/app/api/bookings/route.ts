import { NextRequest } from "next/server";
import { getSupabaseService } from "@/lib/db";
import { getServiceById } from "@/lib/pricing";

export async function GET(_req: NextRequest) {
  const sb = getSupabaseService();
  if (!sb) return Response.json({ bookings: [], message: "Supabase not configured" });
  
  try {
    const { data: bookings, error } = await sb
      .from("bookings")
      .select("*")
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (error) {
      console.error('Error fetching bookings:', error);
      return Response.json({ bookings: [], error: error.message });
    }

    // Enrich bookings with service details for the UI
    const enrichedBookings = (bookings || []).map(booking => {
      const service = getServiceById(booking.service_id?.toString() || '');
      
      return {
        id: booking.id.toString(),
        service_title: service?.title_en || 'Unknown Service',
        status: booking.status || 'booked',
        scheduled_date: booking.sla_window_start || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        total_amount: Math.round((booking.fixed_price_total || 0) / 100), // Convert cents to pesos
        pro_name: null, // TODO: Join with pros table when implemented
        pro_phone: null,
        created_at: booking.created_at || new Date().toISOString(),
        addons: booking.addons,
        assignment_status: booking.assignment_status || 'pending',
        // Add time window information
        sla_window_start: booking.sla_window_start,
        sla_window_end: booking.sla_window_end
      };
    });
    
    return Response.json({ 
      bookings: enrichedBookings,
      count: enrichedBookings.length,
      raw_count: bookings?.length || 0 
    });
  } catch (error) {
    console.error('Bookings fetch error:', error);
    return Response.json({ bookings: [], error: 'Failed to fetch bookings' });
  }
}


