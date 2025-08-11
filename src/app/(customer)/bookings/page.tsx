'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function BookingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  
  // Mock data for demonstration - moved up to avoid conditional hook call
  const [bookings] = useState([
    {
      id: '1',
      service_title: 'Deep Cleaning Service',
      status: 'completed',
      scheduled_date: '2025-01-08T10:00:00Z',
      total_amount: 850,
      pro_name: 'María González',
      pro_phone: '+52 55 1111-2222',
      created_at: '2025-01-05T08:00:00Z'
    },
    {
      id: '2',
      service_title: 'Plumbing Repair',
      status: 'accepted',
      scheduled_date: '2025-01-15T14:00:00Z',
      total_amount: 650,
      pro_name: 'Carlos Ruiz',
      pro_phone: '+52 55 3333-4444',
      created_at: '2025-01-10T15:30:00Z'
    },
    {
      id: '3',
      service_title: 'Electrical Installation',
      status: 'pending',
      scheduled_date: '2025-01-18T09:00:00Z',
      total_amount: 1200,
      pro_name: null,
      pro_phone: null,
      created_at: '2025-01-11T11:00:00Z'
    }
  ]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      setSuccess(true);
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl p-8 text-center shadow-lg">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Booking Confirmed! 🎉
          </h1>
          
          <p className="text-gray-600 mb-6">
            Your payment was successful and your service has been booked. 
            You&apos;ll receive a confirmation email shortly with all the details.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-800 mb-2">What happens next?</h3>
            <ul className="text-sm text-blue-700 text-left space-y-1">
              <li>• We&apos;ll assign a professional within 5 minutes</li>
              <li>• The pro will contact you to confirm details</li>
              <li>• Service will be completed on your scheduled date</li>
              <li>• You&apos;ll receive an invoice after completion</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <Link 
              href="/" 
              className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors block text-center"
            >
              Book Another Service
            </Link>
            <Link 
              href="/contact" 
              className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors block text-center"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">Track your service bookings and history</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No bookings yet
            </h2>
            
            <p className="text-gray-600 mb-6">
              When you book services, they&apos;ll appear here so you can track their progress.
            </p>
            
            <Link 
              href="/" 
              className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors inline-block"
            >
              Browse Services
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Filter Tabs */}
            <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-200 inline-flex">
              <button className="px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-md">
                All Bookings
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900">
                Upcoming
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900">
                Completed
              </button>
            </div>

            {/* Bookings List */}
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{booking.service_title}</h3>
                          <div className="flex items-center mt-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                            <span className="ml-3 text-sm text-gray-500">
                              Booked on {new Date(booking.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-900">${booking.total_amount} MXN</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Scheduled Date & Time</div>
                          <div className="text-sm font-medium text-gray-900">
                            📅 {formatDate(booking.scheduled_date)}
                          </div>
                        </div>
                        
                        {booking.pro_name ? (
                          <div>
                            <div className="text-sm text-gray-500 mb-1">Professional</div>
                            <div className="text-sm font-medium text-gray-900">
                              {booking.pro_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              📞 {booking.pro_phone}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="text-sm text-gray-500 mb-1">Professional</div>
                            <div className="text-sm text-gray-400">
                              Being assigned...
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {booking.status === 'pending' && (
                          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                            Cancel Booking
                          </button>
                        )}
                        {booking.status === 'completed' && (
                          <>
                            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                              Leave Review
                            </button>
                            <span className="text-gray-300">•</span>
                            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                              Book Again
                            </button>
                          </>
                        )}
                        {booking.status === 'accepted' && (
                          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                            Contact Pro
                          </button>
                        )}
                        <span className="text-gray-300">•</span>
                        <button className="text-sm text-gray-500 hover:text-gray-700 font-medium">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link 
                  href="/" 
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Book New Service</div>
                    <div className="text-xs text-gray-500">Browse all services</div>
                  </div>
                </Link>
                
                <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Contact Support</div>
                    <div className="text-xs text-gray-500">Get help with bookings</div>
                  </div>
                </button>
                
                <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Download Receipt</div>
                    <div className="text-xs text-gray-500">Get booking receipts</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


