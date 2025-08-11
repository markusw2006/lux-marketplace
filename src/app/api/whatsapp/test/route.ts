import { NextRequest, NextResponse } from 'next/server';
import { whatsappService } from '@/lib/whatsapp';

// Test endpoint to send sample WhatsApp messages
export async function POST(request: NextRequest) {
  try {
    const { type, phone } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'booking_confirmation':
        result = await whatsappService.sendBookingConfirmation({
          customerPhone: phone,
          customerName: 'Juan Pérez',
          serviceName: 'Limpieza Profunda',
          proName: 'Carlos Mendoza',
          proPhone: '+52 55 9876 5432',
          bookingId: 'BK12345',
          date: 'Lunes 15 de Enero, 2025',
          time: '2:00 PM - 4:00 PM',
          address: 'Calle Reforma 123, Roma Norte, CDMX',
          total: '$850 MXN'
        });
        break;

      case 'pro_assignment':
        result = await whatsappService.sendProJobAssignment({
          proPhone: phone,
          proName: 'Carlos Mendoza',
          customerName: 'Juan Pérez',
          customerPhone: '+52 55 1234 5678',
          serviceName: 'Limpieza Profunda',
          date: 'Lunes 15 de Enero, 2025',
          time: '2:00 PM - 4:00 PM',
          address: 'Calle Reforma 123, Roma Norte, CDMX',
          total: '$850 MXN',
          bookingId: 'BK12345'
        });
        break;

      case 'reminder':
        result = await whatsappService.sendServiceReminder({
          customerPhone: phone,
          customerName: 'Juan Pérez',
          serviceName: 'Limpieza Profunda',
          proName: 'Carlos Mendoza',
          proPhone: '+52 55 9876 5432',
          date: 'Martes 16 de Enero',
          time: '2:00 PM',
          address: 'Calle Reforma 123, Roma Norte, CDMX',
          bookingId: 'BK12345'
        });
        break;

      case 'arrival':
        result = await whatsappService.sendProArrivalNotification({
          customerPhone: phone,
          customerName: 'Juan Pérez',
          proName: 'Carlos Mendoza',
          proPhone: '+52 55 9876 5432',
          estimatedMinutes: 15
        });
        break;

      case 'completion':
        result = await whatsappService.sendJobCompletionNotification({
          customerPhone: phone,
          customerName: 'Juan Pérez',
          serviceName: 'Limpieza Profunda',
          proName: 'Carlos Mendoza',
          total: '$850 MXN',
          bookingId: 'BK12345'
        });
        break;

      case 'payment':
        result = await whatsappService.sendPaymentConfirmation({
          customerPhone: phone,
          proPhone: '+52 55 9876 5432', // This would normally be separate calls
          customerName: 'Juan Pérez',
          proName: 'Carlos Mendoza',
          amount: '$850 MXN',
          serviceName: 'Limpieza Profunda',
          bookingId: 'BK12345'
        });
        break;

      case 'review':
        result = await whatsappService.sendReviewRequest({
          customerPhone: phone,
          customerName: 'Juan Pérez',
          proName: 'Carlos Mendoza',
          serviceName: 'Limpieza Profunda',
          bookingId: 'BK12345'
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid message type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: result.success,
      messageId: result.messageId,
      error: result.error,
      type: type
    });

  } catch (error) {
    console.error('WhatsApp test error:', error);
    return NextResponse.json(
      { error: 'Failed to send test message' },
      { status: 500 }
    );
  }
}

// GET endpoint to list available test types
export async function GET() {
  return NextResponse.json({
    available_types: [
      'booking_confirmation',
      'pro_assignment', 
      'reminder',
      'arrival',
      'completion',
      'payment',
      'review'
    ],
    usage: 'POST with { "type": "booking_confirmation", "phone": "+525512345678" }'
  });
}