'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function WhatsAppTestPage() {
  const [phone, setPhone] = useState('+52 55 1234 5678');
  const [selectedType, setSelectedType] = useState('booking_confirmation');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const messageTypes = [
    { value: 'booking_confirmation', label: '📅 Confirmación de Reserva', description: 'Confirma nueva reserva al cliente' },
    { value: 'pro_assignment', label: '👨‍🔧 Asignación de Trabajo', description: 'Notifica trabajo a profesional' },
    { value: 'reminder', label: '⏰ Recordatorio', description: 'Recordatorio 24h antes del servicio' },
    { value: 'arrival', label: '🚗 Profesional en Camino', description: 'Notifica que el pro está llegando' },
    { value: 'completion', label: '✅ Trabajo Completado', description: 'Confirma finalización del servicio' },
    { value: 'payment', label: '💳 Confirmación de Pago', description: 'Confirma pago procesado' },
    { value: 'review', label: '⭐ Solicitud de Reseña', description: 'Pide calificación del servicio' }
  ];

  const sendTestMessage = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/whatsapp/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: selectedType,
          phone: phone
        })
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Error de red al enviar mensaje'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center space-x-4">
              <Link href="/admin/simple" className="flex items-center space-x-2 text-lg font-semibold hover:text-blue-200">
                <img src="/lux_logo.svg" alt="Lux" className="h-8 w-auto" />
                <span>Admin</span>
              </Link>
              <span className="text-blue-200">|</span>
              <span className="text-blue-200 text-sm">WhatsApp Test</span>
            </div>
            <div className="text-sm text-blue-200">
              Test Mode
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-4">
                <li>
                  <Link href="/admin/simple" className="text-gray-500 hover:text-gray-700">
                    Admin Dashboard
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-4 text-sm font-medium text-gray-900">WhatsApp Test</span>
                  </div>
                </li>
              </ol>
            </nav>
            <h1 className="mt-2 text-2xl font-bold text-gray-900">WhatsApp Message Testing</h1>
            <p className="mt-1 text-sm text-gray-500">Test WhatsApp Business API integration with sample messages</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Card */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-green-800 mb-2">📱 WhatsApp Integration Status</h3>
          <p className="text-green-700 mb-4">
            Currently running in <strong>mock mode</strong>. Messages will be logged to console instead of sent via WhatsApp API.
          </p>
          <div className="text-sm text-green-600">
            <div><strong>✅ Service Configured:</strong> WhatsApp service library ready</div>
            <div><strong>🔗 Webhook Endpoint:</strong> /api/whatsapp/webhook</div>
            <div><strong>🧪 Test Endpoint:</strong> /api/whatsapp/test</div>
          </div>
        </div>

        {/* Test Form */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Send Test Message</h3>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Phone Number Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Teléfono (con código de país)
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+52 55 1234 5678"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Formato: +52 55 XXXX XXXX para México
              </p>
            </div>

            {/* Message Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tipo de Mensaje
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {messageTypes.map((type) => (
                  <label
                    key={type.value}
                    className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedType === type.value
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="messageType"
                      value={type.value}
                      checked={selectedType === type.value}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="sr-only"
                    />
                    <div>
                      <div className="font-medium text-sm text-gray-900">{type.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{type.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Send Button */}
            <div className="pt-4">
              <button
                onClick={sendTestMessage}
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Enviando mensaje...
                  </div>
                ) : (
                  '📤 Enviar Mensaje de Prueba'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Result Display */}
        {result && (
          <div className={`mt-6 rounded-lg p-6 ${
            result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-start">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                result.success ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {result.success ? (
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${
                  result.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {result.success ? '✅ Mensaje enviado exitosamente' : '❌ Error al enviar mensaje'}
                </h3>
                <div className={`mt-1 text-sm ${
                  result.success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {result.success ? (
                    <div>
                      <p>Tipo: <code>{result.type}</code></p>
                      {result.messageId && <p>ID: <code>{result.messageId}</code></p>}
                      <p className="mt-2 text-xs">
                        En modo mock, el mensaje se registra en la consola del servidor. 
                        En producción, se enviaría vía WhatsApp Business API.
                      </p>
                    </div>
                  ) : (
                    <p>Error: {result.error}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Documentation */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">🔧 Para Producción</h3>
          <div className="text-sm text-blue-700 space-y-2">
            <p><strong>1. Configurar Variables de Entorno:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1 text-xs">
              <li><code>WHATSAPP_ACCESS_TOKEN</code> - Token de acceso de Meta Business</li>
              <li><code>WHATSAPP_PHONE_NUMBER_ID</code> - ID del número de WhatsApp</li>
              <li><code>WHATSAPP_BUSINESS_ACCOUNT_ID</code> - ID de cuenta de negocio</li>
            </ul>
            <p className="mt-3"><strong>2. Configurar Webhook:</strong></p>
            <p className="ml-4 text-xs">URL: <code>https://tu-dominio.com/api/whatsapp/webhook</code></p>
            <p className="ml-4 text-xs">Token de verificación: <code>lux_webhook_2024</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}