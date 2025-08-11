'use client';

import { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/contexts/LocaleContext';
import { User } from '@supabase/supabase-js';

interface CheckoutFormProps {
  serviceId: string;
  addons: Record<string, number>;
  totalAmount: number;
  windowStart?: string;
  windowEnd?: string;
  professionalId?: string;
  user?: User | null;
}

export default function CheckoutForm({ 
  serviceId, 
  addons, 
  totalAmount,
  windowStart,
  windowEnd,
  professionalId,
  user
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { t, formatCurrency } = useLocale();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [addressOption, setAddressOption] = useState<'saved' | 'different'>('saved');

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Update customer info when user changes
  useEffect(() => {
    if (user) {
      setCustomerInfo({
        name: user.user_metadata?.name || user.user_metadata?.full_name || '',
        email: user.email || '',
        phone: user.user_metadata?.phone || '',
        address: user.user_metadata?.address || ''
      });
    }
  }, [user]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Form submitted!', { stripe: !!stripe, elements: !!elements, customerInfo, addressOption });
    
    // Validation for logged-in users
    if (user && addressOption === 'different' && !customerInfo.address.trim()) {
      setError('Please enter a service address or select "Use my saved address"');
      return;
    }
    
    // If Stripe isn't configured, simulate successful payment for testing
    if (!stripe || !elements) {
      console.log('Using demo mode - no Stripe');
      setLoading(true);
      setError(null);
      
      // Simulate payment processing
      setTimeout(() => {
        console.log('Demo payment complete, redirecting...');
        // Redirect to success page
        window.location.href = '/customer/bookings?success=true';
      }, 2000);
      
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create payment intent
      const response = await fetch('/api/bookings/instant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId,
          addons,
          windowStart,
          windowEnd,
          customerInfo
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { client_secret, mock_mode } = await response.json();

      // Handle mock mode
      if (mock_mode) {
        // Simulate processing time for mock payment
        setTimeout(() => {
          const confirmationUrl = `/booking-confirmed?service=${encodeURIComponent(serviceId)}&date=${encodeURIComponent(customerInfo.address)}&total=${totalAmount}`;
          router.push(confirmationUrl);
        }, 1500);
        return;
      }

      // Confirm payment
      const { error: paymentError } = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: customerInfo.name,
            email: customerInfo.email,
            phone: customerInfo.phone,
            address: {
              line1: customerInfo.address,
            },
          },
        },
      });

      if (paymentError) {
        setError(paymentError.message || 'Payment failed');
      } else {
        // Payment succeeded
        const confirmationUrl = `/booking-confirmed?service=${encodeURIComponent(serviceId)}&total=${totalAmount}`;
        router.push(confirmationUrl);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
    },
    // Allow card input in development (localhost)
    ...(process.env.NODE_ENV === 'development' && {
      hidePostalCode: false,
    }),
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {user ? (
        /* Logged in user - Show saved info and minimal form */
        <>
          {/* Saved User Information */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Booking Information</h3>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="text-gray-900">{customerInfo.name || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="text-gray-900">{customerInfo.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="text-gray-900">{customerInfo.phone || 'Not provided'}</span>
              </div>
            </div>
            <button 
              type="button" 
              className="mt-3 text-xs text-gray-600 hover:text-gray-900 underline"
              onClick={() => router.push('/customer/settings')}
            >
              Edit information
            </button>
          </div>

          {/* Service Address - Compact design */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Service Location *
            </label>
            
            <div className="space-y-2">
              {/* Saved Address Option */}
              <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input 
                  type="radio" 
                  name="address-option"
                  value="saved"
                  checked={addressOption === 'saved'}
                  onChange={() => {
                    setAddressOption('saved');
                    setCustomerInfo(prev => ({...prev, address: user?.user_metadata?.address || ''}));
                  }}
                  className="h-4 w-4 text-gray-900 border-gray-300 focus:ring-gray-500"
                />
                <div className="ml-3 flex-1">
                  <div className="text-sm font-medium text-gray-900">My saved address</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {user?.user_metadata?.address || 'Roma Norte 123, Col. Roma Norte, Cuauhtémoc, 06700 CDMX'}
                  </div>
                </div>
              </label>
              
              {/* Different Address Option */}
              <label className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input 
                  type="radio" 
                  name="address-option"
                  value="different"
                  checked={addressOption === 'different'}
                  onChange={() => setAddressOption('different')}
                  className="h-4 w-4 text-gray-900 border-gray-300 focus:ring-gray-500 mt-0.5"
                />
                <div className="ml-3 flex-1">
                  <div className="text-sm font-medium text-gray-900 mb-2">Different location</div>
                  <textarea
                    placeholder="Enter the address where service should be performed"
                    className={`w-full px-2 py-1.5 border rounded text-sm resize-none ${
                      addressOption === 'different' 
                        ? 'border-gray-300 bg-white focus:ring-2 focus:ring-gray-500 focus:border-gray-500' 
                        : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                    }`}
                    rows={2}
                    disabled={addressOption !== 'different'}
                    onChange={(e) => {
                      if (addressOption === 'different') {
                        handleInputChange('address', e.target.value);
                      }
                    }}
                  />
                </div>
              </label>
            </div>
          </div>
        </>
      ) : (
        /* Guest user - Show full form */
        <>
          {/* Contact Information */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={customerInfo.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={customerInfo.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={customerInfo.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              placeholder="Enter your phone number"
              required
            />
          </div>
          
          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Service Address
            </label>
            <textarea
              value={customerInfo.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              rows={3}
              placeholder="Enter your complete address"
              required
            />
          </div>
        </>
      )}
      
      {/* Digital Wallets - Available for all users */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-900">
          Quick Pay
        </label>
        
        <button
          type="button"
          className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center"
          onClick={() => alert('Apple Pay integration requires production Stripe keys')}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7.078 23.55c-.473-.316-.893-.703-1.244-1.15-.383-.463-.738-.95-1.064-1.454-.766-1.12-1.365-2.345-1.78-3.636-.5-1.502-.743-2.94-.743-4.347 0-1.57.34-2.94 1.002-4.09.49-.9 1.22-1.653 2.1-2.182.85-.53 1.738-.795 2.656-.795.615 0 1.26.11 1.917.328.657.218 1.238.438 1.738.66.5.222.915.438 1.244.66.164.11.316.228.454.344.138-.116.29-.234.454-.344.329-.222.744-.438 1.244-.66.5-.222 1.081-.442 1.738-.66.657-.218 1.302-.328 1.917-.328.918 0 1.806.265 2.656.795.88.529 1.61 1.282 2.1 2.182.662 1.15 1.002 2.52 1.002 4.09 0 1.407-.243 2.845-.743 4.347-.415 1.291-1.014 2.516-1.78 3.636-.326.504-.681.991-1.064 1.454-.351.447-.771.834-1.244 1.15-.908.607-1.821.911-2.734.911-.329 0-.696-.062-1.099-.185-.403-.123-.817-.295-1.244-.516-.427-.221-.854-.442-1.281-.663-.427-.221-.854-.332-1.281-.332-.427 0-.854.111-1.281.332-.427.221-.854.442-1.281.663-.427.221-.841.393-1.244.516-.403.123-.77.185-1.099.185-.913 0-1.826-.304-2.734-.911zm8.24-21.11c-.329-.434-.99-.942-1.917-1.488-.927-.546-1.832-.82-2.717-.82-.164 0-.329.027-.494.082-.164.055-.329.137-.494.246-.329.218-.618.509-.866.873-.248.364-.372.728-.372 1.092 0 .218.027.436.082.654.055.218.137.409.246.573.218.327.509.618.873.866.364.248.728.372 1.092.372.218 0 .436-.027.654-.082.218-.055.409-.137.573-.246.327-.218.618-.509.866-.873.248-.364.372-.728.372-1.092 0-.436-.111-.845-.332-1.227z"/>
          </svg>
          Pay with Apple Pay
        </button>
        
        <button
          type="button"
          className="w-full bg-white text-gray-900 border border-gray-300 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
          onClick={() => alert('Google Pay integration requires production Stripe keys')}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Pay with Google Pay
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or pay with card</span>
        </div>
      </div>

      {/* Payment Methods */}
      {user ? (
        /* Logged in user - Show saved payment methods */
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900">Saved Payment Methods</h3>
          
          {/* Mock saved payment methods - in real app, fetch from Stripe */}
          <div className="space-y-3">
            <div className="border border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input type="radio" name="payment-method" defaultChecked className="h-4 w-4 text-gray-600" />
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                      •••• 4242
                    </div>
                    <span className="text-sm text-gray-900">Visa ending in 4242</span>
                  </div>
                </div>
                <span className="text-xs text-gray-500">Expires 12/27</span>
              </div>
            </div>
            
            <div className="border border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-50 text-center">
              <div className="text-sm text-gray-600">
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add new payment method
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Guest user - Show card input section */
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-4">Card Information</h3>
        </div>
      )}

      {/* Card Information - Only show for guests or when adding new payment method */}
      {!user && (
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Card Information
        </label>
        <div className="p-3 border border-gray-300 rounded-lg">
          <CardElement options={cardElementOptions} />
        </div>
        
        {/* Test Card Info */}
        <div className="mt-2 p-3 bg-gray-50 rounded text-xs text-gray-700">
          <div className="font-semibold mb-2">Demo Mode - Test Card Numbers:</div>
          <div className="space-y-1">
            <div><strong>Visa:</strong> 4242 4242 4242 4242</div>
            <div><strong>Mastercard:</strong> 5555 5555 5555 4444</div>
            <div><strong>Any future expiry (12/25)</strong> • <strong>Any CVC (123)</strong></div>
          </div>
          <div className="mt-2 text-gray-600 font-medium">Payment will be simulated - no real charges</div>
        </div>
        </div>
      )}
      
      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        onClick={() => console.log('Button clicked!')}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors text-lg ${
          loading
            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
            : 'bg-gray-900 text-white hover:bg-gray-800'
        }`}
      >
{loading ? t('checkout.processing') : `${t('checkout.complete')} - ${formatCurrency(totalAmount)}`}
      </button>
      
      {/* Security Notice */}
      <div className="pt-6 border-t border-gray-200">
        <div className="flex items-center justify-center text-xs text-gray-500">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          Secure payment powered by Stripe
        </div>
      </div>
    </form>
  );
}