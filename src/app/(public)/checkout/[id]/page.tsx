'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Elements } from '@stripe/react-stripe-js';
import { getStripeClient } from '@/lib/stripe-client';
import CheckoutForm from '@/components/CheckoutForm';
import { getServiceById } from '@/lib/pricing';
import { useLocale } from '@/contexts/LocaleContext';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CheckoutPage({ params }: PageProps) {
  const { formatCurrency, locale, t, lockExchangeRate, rateLocked, exchangeRate } = useLocale();
  const [serviceId, setServiceId] = useState('');
  const [addons, setAddons] = useState<Record<string, number>>({});
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getParams = async () => {
      const { id } = await params;
      const urlParams = new URLSearchParams(window.location.search);
      
      setServiceId(id);
      
      // Parse addons from URL
      const addonData: Record<string, number> = {};
      for (const [key, value] of urlParams.entries()) {
        if (key !== 'date' && key !== 'time') {
          const qty = parseInt(value, 10);
          if (!isNaN(qty) && qty > 0) {
            addonData[key] = qty;
          }
        }
      }
      
      setAddons(addonData);
      setSelectedDate(urlParams.get('date') || '');
      setSelectedTime(urlParams.get('time') || '');
      setLoading(false);
      
      // Lock exchange rate when user enters checkout
      if (!rateLocked) {
        lockExchangeRate();
      }
    };
    getParams();
  }, [params, rateLocked, lockExchangeRate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  const service = getServiceById(serviceId);
  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // Calculate total price in MXN pesos
  let totalCents = service.fixed_base_price;
  const selectedAddons: Array<{ name: string; price: number; quantity: number }> = [];

  Object.entries(addons).forEach(([addonId, qty]) => {
    const addon = service.addons.find(a => a.id === addonId);
    if (addon && qty > 0) {
      totalCents += addon.price_delta * qty;
      selectedAddons.push({
        name: locale === 'en' ? addon.name_en : addon.name_es,
        price: Math.round(addon.price_delta / 100),
        quantity: qty
      });
    }
  });

  const platformFeeCents = Math.round(totalCents * 0.15); // 15% platform fee
  const totalWithFeeCents = totalCents + platformFeeCents;
  const totalAmount = Math.round(totalWithFeeCents / 100); // Convert to pesos

  const stripePromise = getStripeClient();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-gray-700">Home</Link>
            <span>/</span>
            <Link href={`/service/${serviceId}`} className="hover:text-gray-700">Service</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Checkout</span>
          </nav>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Booking</h1>
          <p className="text-gray-600 text-lg">
            Secure payment and instant confirmation
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{locale === 'en' ? service.title_en : service.title_es}</span>
                  <span className="font-medium text-gray-900">{formatCurrency(Math.round(service.fixed_base_price / 100))}</span>
                </div>
                
                {selectedAddons.map((addon, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-600">
                      {addon.name} {addon.quantity > 1 && `(x${addon.quantity})`}
                    </span>
                    <span className="font-medium text-gray-900">+{formatCurrency(addon.price * addon.quantity)}</span>
                  </div>
                ))}
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Platform Fee (15%)</span>
                  <span className="font-medium text-gray-900">+{formatCurrency(Math.round(platformFeeCents / 100))}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4 flex justify-between items-center font-semibold text-lg">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">{formatCurrency(totalAmount)}</span>
                </div>
              </div>
              
              {selectedDate && selectedTime && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-medium text-green-800 mb-2">Scheduled Service</h3>
                  <p className="text-sm text-green-700">
                    📅 {selectedDate} at {selectedTime}
                  </p>
                </div>
              )}
              
              {rateLocked && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center text-green-800">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-medium">Exchange Rate Locked: 1 USD = {exchangeRate.toFixed(4)} MXN</span>
                  </div>
                </div>
              )}
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center text-blue-800">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">What happens next?</span>
                </div>
                <ul className="mt-2 text-sm text-blue-700 space-y-1">
                  <li>• Instant confirmation sent to your email</li>
                  <li>• Pro automatically assigned within 5 minutes</li>
                  <li>• Pro will contact you to confirm details</li>
                  <li>• Service completed on your scheduled date</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Information</h2>
              
              <Elements stripe={stripePromise}>
                <CheckoutForm
                  serviceId={serviceId}
                  addons={addons}
                  totalAmount={totalAmount}
                  windowStart={selectedDate && selectedTime ? `${selectedDate} ${selectedTime.split(' - ')[0]}` : undefined}
                  windowEnd={selectedDate && selectedTime ? `${selectedDate} ${selectedTime.split(' - ')[1]}` : undefined}
                />
              </Elements>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}