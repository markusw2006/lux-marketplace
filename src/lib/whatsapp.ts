// WhatsApp Business API integration
interface WhatsAppConfig {
  accessToken: string;
  phoneNumberId: string;
  businessAccountId: string;
  webhookVerifyToken: string;
}

interface WhatsAppMessage {
  to: string;
  type: 'template' | 'text' | 'image';
  template?: {
    name: string;
    language: {
      code: string;
    };
    components: Array<{
      type: string;
      parameters: Array<{
        type: string;
        text: string;
      }>;
    }>;
  };
  text?: {
    body: string;
  };
  image?: {
    link: string;
    caption?: string;
  };
}

class WhatsAppService {
  private config: WhatsAppConfig;
  private baseUrl: string = 'https://graph.facebook.com/v18.0';

  constructor() {
    this.config = {
      accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
      businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '',
      webhookVerifyToken: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || 'lux_webhook_2024'
    };
  }

  async sendMessage(message: WhatsAppMessage): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.config.accessToken || !this.config.phoneNumberId) {
      console.log('WhatsApp Mock Mode: Would send message to', message.to);
      return { 
        success: true, 
        messageId: 'mock_' + Math.random().toString(36).substr(2, 9)
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/${this.config.phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          ...message
        })
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          messageId: data.messages?.[0]?.id
        };
      } else {
        console.error('WhatsApp API Error:', data);
        return {
          success: false,
          error: data.error?.message || 'Failed to send message'
        };
      }
    } catch (error) {
      console.error('WhatsApp Service Error:', error);
      return {
        success: false,
        error: 'Network error'
      };
    }
  }

  // Booking confirmation message
  async sendBookingConfirmation(params: {
    customerPhone: string;
    customerName: string;
    serviceName: string;
    proName: string;
    proPhone: string;
    bookingId: string;
    date: string;
    time: string;
    address: string;
    total: string;
  }) {
    const message = {
      to: params.customerPhone,
      type: 'text' as const,
      text: {
        body: `🎉 ¡Reserva confirmada!

📅 Servicio: ${params.serviceName}
🗓️ Fecha: ${params.date} a las ${params.time}
📍 Dirección: ${params.address}

👨‍🔧 Profesional asignado: ${params.proName}
📞 Contacto del profesional: ${params.proPhone}

💰 Total: ${params.total}
🔗 Seguimiento: lux.mx/booking/${params.bookingId}

¡Gracias por elegir Lux! 🌟`
      }
    };

    return this.sendMessage(message);
  }

  // Pro job assignment notification
  async sendProJobAssignment(params: {
    proPhone: string;
    proName: string;
    customerName: string;
    customerPhone: string;
    serviceName: string;
    date: string;
    time: string;
    address: string;
    total: string;
    bookingId: string;
  }) {
    const message = {
      to: params.proPhone,
      type: 'text' as const,
      text: {
        body: `🔔 ¡Nuevo trabajo asignado!

👤 Cliente: ${params.customerName}
📞 Contacto: ${params.customerPhone}
🛠️ Servicio: ${params.serviceName}
📅 Fecha: ${params.date} a las ${params.time}
📍 Dirección: ${params.address}
💰 Pago: ${params.total}

🔗 Ver detalles: lux.mx/pro/booking/${params.bookingId}

¡Que tengas un excelente trabajo! 💪`
      }
    };

    return this.sendMessage(message);
  }

  // Service reminder (24h before)
  async sendServiceReminder(params: {
    customerPhone: string;
    customerName: string;
    serviceName: string;
    proName: string;
    proPhone: string;
    date: string;
    time: string;
    address: string;
    bookingId: string;
  }) {
    const message = {
      to: params.customerPhone,
      type: 'text' as const,
      text: {
        body: `⏰ Recordatorio de servicio - Mañana

👋 Hola ${params.customerName},

📅 Tu servicio de ${params.serviceName} está programado para mañana ${params.date} a las ${params.time}

👨‍🔧 Profesional: ${params.proName} (${params.proPhone})
📍 Dirección: ${params.address}

Si necesitas reagendar: lux.mx/booking/${params.bookingId}

¡Nos vemos mañana! ✨`
      }
    };

    return this.sendMessage(message);
  }

  // Pro arrival notification
  async sendProArrivalNotification(params: {
    customerPhone: string;
    customerName: string;
    proName: string;
    proPhone: string;
    estimatedMinutes: number;
  }) {
    const message = {
      to: params.customerPhone,
      type: 'text' as const,
      text: {
        body: `🚗 ¡${params.proName} está en camino!

⏱️ Tiempo estimado de llegada: ${params.estimatedMinutes} minutos
📞 Contacto directo: ${params.proPhone}

Te avisaremos cuando llegue. ¡Gracias por tu paciencia! 🙏`
      }
    };

    return this.sendMessage(message);
  }

  // Job completion notification
  async sendJobCompletionNotification(params: {
    customerPhone: string;
    customerName: string;
    serviceName: string;
    proName: string;
    total: string;
    bookingId: string;
  }) {
    const message = {
      to: params.customerPhone,
      type: 'text' as const,
      text: {
        body: `✅ ¡Servicio completado!

👋 Hola ${params.customerName},

🛠️ Tu servicio de ${params.serviceName} ha sido completado por ${params.proName}
💰 Total pagado: ${params.total}

⭐ Por favor califica tu experiencia:
lux.mx/review/${params.bookingId}

¡Gracias por usar Lux! 🌟`
      }
    };

    return this.sendMessage(message);
  }

  // Payment confirmation
  async sendPaymentConfirmation(params: {
    customerPhone: string;
    proPhone: string;
    customerName: string;
    proName: string;
    amount: string;
    serviceName: string;
    bookingId: string;
  }) {
    // Message to customer
    await this.sendMessage({
      to: params.customerPhone,
      type: 'text' as const,
      text: {
        body: `💳 Pago confirmado

Hola ${params.customerName},

✅ Pago procesado: ${params.amount}
🛠️ Servicio: ${params.serviceName}
👨‍🔧 Profesional: ${params.proName}

Recibo: lux.mx/receipt/${params.bookingId}

¡Gracias por tu pago! 🙏`
      }
    });

    // Message to pro
    return this.sendMessage({
      to: params.proPhone,
      type: 'text' as const,
      text: {
        body: `💰 ¡Pago recibido!

👤 Cliente: ${params.customerName}
💳 Monto: ${params.amount}
🛠️ Servicio: ${params.serviceName}

El pago será transferido a tu cuenta en 24-48 horas.

¡Excelente trabajo! 👏`
      }
    });
  }

  // Review request follow-up
  async sendReviewRequest(params: {
    customerPhone: string;
    customerName: string;
    proName: string;
    serviceName: string;
    bookingId: string;
  }) {
    const message = {
      to: params.customerPhone,
      type: 'text' as const,
      text: {
        body: `⭐ ¿Cómo estuvo tu experiencia?

Hola ${params.customerName},

Nos encantaría saber sobre tu servicio de ${params.serviceName} con ${params.proName}.

Tu opinión nos ayuda a mejorar 📝
Calificar servicio: lux.mx/review/${params.bookingId}

¡Tu feedback es muy valioso! 💙`
      }
    };

    return this.sendMessage(message);
  }

  // Webhook verification
  verifyWebhook(mode: string, token: string, challenge: string): string | null {
    if (mode === 'subscribe' && token === this.config.webhookVerifyToken) {
      return challenge;
    }
    return null;
  }
}

export const whatsappService = new WhatsAppService();
export type { WhatsAppMessage };