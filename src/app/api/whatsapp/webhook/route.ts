import { NextRequest, NextResponse } from 'next/server';
import { whatsappService } from '@/lib/whatsapp';

// GET - Webhook verification
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (!mode || !token || !challenge) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  const verificationResult = whatsappService.verifyWebhook(mode, token, challenge);
  
  if (verificationResult) {
    console.log('WhatsApp webhook verified successfully');
    return new NextResponse(verificationResult, { status: 200 });
  } else {
    console.log('WhatsApp webhook verification failed');
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403 }
    );
  }
}

// POST - Handle incoming messages
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Log incoming webhook for debugging
    console.log('WhatsApp webhook received:', JSON.stringify(body, null, 2));

    // Process webhook data
    if (body.object === 'whatsapp_business_account') {
      for (const entry of body.entry || []) {
        for (const change of entry.changes || []) {
          if (change.field === 'messages') {
            const value = change.value;
            
            // Handle incoming messages
            if (value.messages) {
              for (const message of value.messages) {
                await handleIncomingMessage(message, value.contacts?.[0]);
              }
            }

            // Handle message status updates
            if (value.statuses) {
              for (const status of value.statuses) {
                await handleMessageStatus(status);
              }
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleIncomingMessage(message: any, contact: any) {
  console.log('Processing incoming message:', {
    from: message.from,
    type: message.type,
    timestamp: message.timestamp
  });

  const customerPhone = message.from;
  const messageText = message.text?.body?.toLowerCase() || '';

  // Handle specific customer responses
  if (messageText.includes('cancelar') || messageText.includes('cancel')) {
    await handleCancellationRequest(customerPhone);
  } else if (messageText.includes('reagendar') || messageText.includes('reschedule')) {
    await handleRescheduleRequest(customerPhone);
  } else if (messageText.includes('contacto') || messageText.includes('help')) {
    await handleHelpRequest(customerPhone);
  } else {
    // Default response for unrecognized messages
    await sendDefaultResponse(customerPhone);
  }
}

async function handleMessageStatus(status: any) {
  console.log('Message status update:', {
    id: status.id,
    status: status.status,
    timestamp: status.timestamp
  });

  // Handle delivery confirmations, read receipts, etc.
  // This is useful for tracking message delivery success
}

async function handleCancellationRequest(customerPhone: string) {
  await whatsappService.sendMessage({
    to: customerPhone,
    type: 'text',
    text: {
      body: `📞 Entendemos que quieres cancelar tu servicio.

Para procesar tu cancelación:
1. Ve a: lux.mx/my-bookings
2. O llama a soporte: +52-55-XXXX-XXXX

Nuestro equipo te ayudará con el proceso de cancelación y reembolso si aplica.

¡Gracias! 🙏`
    }
  });
}

async function handleRescheduleRequest(customerPhone: string) {
  await whatsappService.sendMessage({
    to: customerPhone,
    type: 'text',
    text: {
      body: `📅 ¿Necesitas reagendar tu servicio?

Opciones para reagendar:
1. Ve a: lux.mx/my-bookings
2. Responde con la nueva fecha y hora preferida
3. Llama a soporte: +52-55-XXXX-XXXX

Sin cargo por cambios con 24h de anticipación ✨`
    }
  });
}

async function handleHelpRequest(customerPhone: string) {
  await whatsappService.sendMessage({
    to: customerPhone,
    type: 'text',
    text: {
      body: `🆘 ¡Estamos aquí para ayudarte!

Opciones de soporte:
• Ver mis reservas: lux.mx/my-bookings
• Preguntas frecuentes: lux.mx/faq
• Chat en vivo: lux.mx/support
• Teléfono: +52-55-XXXX-XXXX

Horarios: Lun-Vie 8am-8pm, Sáb 9am-6pm

¿En qué más te podemos ayudar? 😊`
    }
  });
}

async function sendDefaultResponse(customerPhone: string) {
  await whatsappService.sendMessage({
    to: customerPhone,
    type: 'text',
    text: {
      body: `👋 ¡Gracias por contactarnos!

Para una respuesta rápida:
• "Cancelar" - Cancelar servicio
• "Reagendar" - Cambiar fecha/hora  
• "Ayuda" - Soporte general

O visita: lux.mx/support

¡Te ayudaremos pronto! 🌟`
    }
  });
}