'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Elements } from '@stripe/react-stripe-js';
import { getStripeClient } from '@/lib/stripe-client';
import CheckoutForm from '@/components/CheckoutForm';
import { getServiceById } from '@/lib/pricing';
import { useLocale } from '@/contexts/LocaleContext';
import { professionals } from '@/data/seed/pros';
import { useAuth } from '@/contexts/AuthContext';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CheckoutPage({ params }: PageProps) {
  const { formatCurrency, locale, t, lockExchangeRate, rateLocked, exchangeRate } = useLocale();
  const { user, loading: authLoading } = useAuth();
  const [serviceId, setServiceId] = useState('');
  const [addons, setAddons] = useState<Record<string, number>>({});
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedPro, setSelectedPro] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState('');

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
      setSelectedPro(urlParams.get('pro') || '');
      setCurrentUrl(window.location.pathname + window.location.search);
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
          <Link href="/" className="text-gray-600 hover:text-gray-900 hover:underline">
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

  // Get professional info if pro is selected
  const professional = selectedPro ? professionals.find(p => p.id === selectedPro) : null;

  const stripePromise = getStripeClient();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Booking</h1>
            <p className="text-gray-600 text-lg">
              Secure payment and instant confirmation
            </p>
          </div>

          {/* Selected Professional Info */}
          {professional && (
            <div className="bg-green-50 rounded-xl p-6 border border-green-200 max-w-2xl mx-auto">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {professional.profilePhotoUrl ? (
                    <img
                      src={professional.profilePhotoUrl}
                      alt={professional.businessName}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white shadow-lg">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-xl font-semibold text-green-800">{professional.businessName}</h3>
                    {professional.verified && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-green-700">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(professional.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      ))}
                      <span className="ml-1 font-medium text-green-800">{professional.rating}</span>
                    </div>
                    <span>({professional.reviewCount} reviews)</span>
                    <span>{professional.experienceYears} years experience</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-green-600 font-medium">
                    ✓ Your Selected Professional
                  </div>
                </div>
              </div>
            </div>
          )}
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
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center text-gray-800">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">What happens next?</span>
                </div>
                <ul className="mt-2 text-sm text-gray-700 space-y-1">
                  <li>• Instant confirmation sent to your email</li>
                  {professional ? (
                    <li>• Your selected pro will contact you to confirm details</li>
                  ) : (
                    <>
                      <li>• Pro automatically assigned within 5 minutes</li>
                      <li>• Pro will contact you to confirm details</li>
                    </>
                  )}
                  <li>• Service completed on your scheduled date</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Information</h2>
              
              {!user && !authLoading ? (
                /* Authentication Required for Payment */
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Account Required</h3>
                  <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                    Please sign in or create an account to complete your booking and communicate with your professional.
                  </p>
                  
                  <div className="space-y-3 max-w-xs mx-auto">
                    <Link
                      href={`/signup?redirect=${encodeURIComponent(currentUrl)}`}
                      className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors inline-block text-sm"
                    >
                      Create Account
                    </Link>
                    
                    <Link
                      href={`/login?redirect=${encodeURIComponent(currentUrl)}`}
                      className="w-full bg-white text-gray-700 px-4 py-2 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors inline-block text-sm"
                    >
                      Sign In
                    </Link>
                  </div>
                </div>
              ) : authLoading ? (
                /* Loading State */
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto mb-3"></div>
                  <p className="text-gray-600 text-sm">Loading...</p>
                </div>
              ) : (
                /* Authenticated - Show Payment Form */
                <>
                  {/* Signed in user confirmation */}
                  <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-800">Booking as {user.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Elements stripe={stripePromise}>
                    <CheckoutForm
                      serviceId={serviceId}
                      addons={addons}
                      totalAmount={totalAmount}
                      windowStart={selectedDate && selectedTime ? `${selectedDate} ${selectedTime.split(' - ')[0]}` : undefined}
                      windowEnd={selectedDate && selectedTime ? `${selectedDate} ${selectedTime.split(' - ')[1]}` : undefined}
                      professionalId={selectedPro}
                      user={user}
                    />
                  </Elements>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}