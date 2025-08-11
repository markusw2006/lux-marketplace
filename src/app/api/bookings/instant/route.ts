import { NextRequest } from "next/server";
import { getStripe } from "@/lib/stripe";
import { computeServiceTotalCents } from "@/lib/pricing";
import { calculatePlatformFeeCents } from "@/lib/fees";
import { getSupabaseService } from "@/lib/db";
import { whatsappService } from "@/lib/whatsapp";

export async function POST(req: NextRequest) {
  console.log('=== BOOKING API CALLED ===');
  console.log('Request URL:', req.url);
  console.log('Request method:', req.method);
  
  const payload = await req.json();
  console.log('Received payload:', JSON.stringify(payload, null, 2));

  const serviceId = payload.serviceId as string;
  const addons = (payload.addons as Record<string, number>) || {};
  const customerInfo = payload.customerInfo || {};
  const windowStart = payload.windowStart as string | undefined;
  const windowEnd = payload.windowEnd as string | undefined;
  
  console.log('Parsed data:', { serviceId, addons, customerInfo, windowStart, windowEnd });

  // Calculate pricing
  const amount = computeServiceTotalCents(serviceId, addons);
  const platformFee = calculatePlatformFeeCents(amount);
  
  // For now, we don't have connected accounts set up, so no transfer
  const connectedAccountId = payload.connectedAccountId as string | undefined;

  // Check if Stripe is properly configured
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey || stripeSecretKey === 'your-stripe-secret-key') {
    // Return mock response for testing when Stripe isn't configured
    console.log('Mock payment mode: Stripe not configured, returning mock client_secret');
    
    // Still create booking record for testing
    const sb = getSupabaseService();
    let bookingId = null;
    if (sb) {
      try {
        const bookingData = {
          service_id: serviceId, // Keep as string
          customer_id: null,
          fixed_price_total: amount,
          addons,
          sla_window_start: windowStart,
          sla_window_end: windowEnd,
          status: 'booked'
        };
        
        console.log('Attempting to create booking:', bookingData);
        
        const { data, error } = await sb.from("bookings").insert(bookingData).select().single();
        
        if (error) {
          console.error('Supabase booking insert error:', error);
          console.error('Error details:', { code: error.code, message: error.message, details: error.details });
        }
        
        if (data) {
          bookingId = data.id;
          console.log('Booking created successfully with ID:', bookingId);
        }
      } catch (error) {
        console.error('Failed to create booking (catch block):', error);
      }
    }
    
    // Send WhatsApp notifications (mock mode)
    if (customerInfo.phone && bookingId) {
      try {
        await sendBookingNotifications({
          bookingId,
          customerPhone: customerInfo.phone,
          customerName: customerInfo.name || 'Cliente',
          serviceName: payload.serviceName || 'Servicio',
          amount,
          windowStart,
          windowEnd
        });
      } catch (error) {
        console.error('Failed to send WhatsApp notifications:', error);
      }
    }
    
    return Response.json({ 
      client_secret: 'mock_pi_test_client_secret',
      mock_mode: true 
    });
  }

  try {
    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "mxn",
      capture_method: "manual",
      // Don't set application fee if no connected account
      ...(connectedAccountId && { application_fee_amount: platformFee }),
      ...(connectedAccountId && { 
        transfer_data: { destination: connectedAccountId } 
      }),
      metadata: { 
        booking_seed: "true",
        service_id: serviceId,
        customer_email: customerInfo.email || '',
        customer_name: customerInfo.name || ''
      },
    });

    // Create booking record (basic implementation for now)
    const sb = getSupabaseService();
    let bookingId = null;
    if (sb) {
      try {
        const bookingData = {
          service_id: serviceId, // Keep as string - don't convert to number
          customer_id: null, // We don't have user auth yet
          fixed_price_total: amount,
          addons,
          sla_window_start: windowStart,
          sla_window_end: windowEnd,
          status: 'booked'
        };
        
        console.log('Attempting to create booking (Stripe mode):', bookingData);
        
        const { data, error } = await sb.from("bookings").insert(bookingData).select().single();
        
        if (error) {
          console.error('Supabase booking insert error (Stripe mode):', error);
          console.error('Error details:', { code: error.code, message: error.message, details: error.details });
        }
        
        if (data) {
          bookingId = data.id;
          console.log('Booking created successfully with ID (Stripe mode):', bookingId);
        }
      } catch (error) {
        console.error('Failed to create booking (Stripe mode catch):', error);
        // Continue anyway - payment is more important
      }
    }
    
    // Send WhatsApp notifications
    if (customerInfo.phone && bookingId) {
      try {
        await sendBookingNotifications({
          bookingId,
          customerPhone: customerInfo.phone,
          customerName: customerInfo.name || 'Cliente',
          serviceName: payload.serviceName || 'Servicio',
          amount,
          windowStart,
          windowEnd
        });
      } catch (error) {
        console.error('Failed to send WhatsApp notifications:', error);
        // Continue - don't fail booking due to notification issues
      }
    }

    return Response.json({ client_secret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Stripe error:', error);
    return Response.json({ error: 'Payment processing failed' }, { status: 500 });
  }
}

// Helper function to send booking notifications
async function sendBookingNotifications(params: {
  bookingId: string;
  customerPhone: string;
  customerName: string;
  serviceName: string;
  amount: number;
  windowStart?: string;
  windowEnd?: string;
}) {
  // Format the amount for display
  const totalFormatted = `$${(params.amount / 100).toLocaleString('es-MX')} MXN`;
  
  // Format date/time
  const formatDateTime = (dateTime?: string) => {
    if (!dateTime) return 'Por confirmar';
    const date = new Date(dateTime);
    return date.toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Mock professional assignment (in real system, this would come from DB)
  const mockPro = {
    name: 'Carlos Mendoza',
    phone: '+52 55 1234 5678'
  };

  // Send booking confirmation to customer
  await whatsappService.sendBookingConfirmation({
    customerPhone: params.customerPhone,
    customerName: params.customerName,
    serviceName: params.serviceName,
    proName: mockPro.name,
    proPhone: mockPro.phone,
    bookingId: params.bookingId,
    date: formatDateTime(params.windowStart),
    time: params.windowEnd ? `${formatDateTime(params.windowStart)} - ${formatDateTime(params.windowEnd)}` : formatDateTime(params.windowStart),
    address: 'Dirección proporcionada',
    total: totalFormatted
  });

  // Send job assignment to pro (mock)
  await whatsappService.sendProJobAssignment({
    proPhone: mockPro.phone,
    proName: mockPro.name,
    customerName: params.customerName,
    customerPhone: params.customerPhone,
    serviceName: params.serviceName,
    date: formatDateTime(params.windowStart),
    time: params.windowEnd ? `${formatDateTime(params.windowStart)} - ${formatDateTime(params.windowEnd)}` : formatDateTime(params.windowStart),
    address: 'Dirección proporcionada',
    total: totalFormatted,
    bookingId: params.bookingId
  });
}

export const runtime = "nodejs";

