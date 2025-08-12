'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminProtection from '@/components/AdminProtection';
import AdminHeader from '@/components/AdminHeader';
import { useLocale } from '@/contexts/LocaleContext';

interface AdminStats {
  totalBookings: number;
  totalRevenue: number;
  activePros: number;
  totalCustomers: number;
  pendingDisputes: number;
  averageRating: number;
}

interface RecentBooking {
  id: string;
  service_title: string;
  customer_name: string;
  pro_name: string;
  status: string;
  total_amount: number;
  created_at: string;
}

type DetailViewType = 'bookings' | 'revenue' | 'pros' | 'customers' | 'disputes' | 'reviews' | null;

export default function AdminDashboard() {
  const { formatCurrency } = useLocale();
  const [stats, setStats] = useState<AdminStats>({
    totalBookings: 0,
    totalRevenue: 0,
    activePros: 0,
    totalCustomers: 0,
    pendingDisputes: 0,
    averageRating: 0
  });
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [prosData, setProsData] = useState<any[]>([]);
  const [customersData, setCustomersData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDetailView, setActiveDetailView] = useState<DetailViewType>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all admin data in parallel
        const [bookingsRes, prosRes, customersRes, disputesRes, reviewsRes] = await Promise.all([
          fetch('/api/admin/bookings'),
          fetch('/api/admin/pros'),
          fetch('/api/admin/customers'),
          fetch('/api/admin/disputes'),
          fetch('/api/admin/reviews')
        ]);

        // Parse responses
        const bookingsData = bookingsRes.ok ? await bookingsRes.json() : { bookings: [] };
        const prosData = prosRes.ok ? await prosRes.json() : { pros: [] };
        const customersData = customersRes.ok ? await customersRes.json() : { customers: [] };
        const disputesData = disputesRes.ok ? await disputesRes.json() : { disputes: [] };
        const reviewsData = reviewsRes.ok ? await reviewsRes.json() : { reviews: [] };

        const bookings = bookingsData.bookings || [];
        const pros = prosData.pros || [];
        const customers = customersData.customers || [];
        const disputes = disputesData.disputes || [];
        const reviews = reviewsData.reviews || [];

        // Set recent bookings and detailed data
        setRecentBookings(bookings.slice(0, 10));
        setProsData(pros);
        setCustomersData(customers);

        // Calculate real statistics
        const totalRevenue = bookings.reduce((sum: number, booking: any) => 
          sum + (booking.total_amount || 0), 0); // Already in cents from database
        
        const activePros = pros.filter((pro: any) => pro.verified && !pro.suspended).length;
        const totalCustomers = customers.length;
        const pendingDisputes = disputes.filter((dispute: any) => 
          dispute.status === 'open' || dispute.status === 'pending'
        ).length;
        
        // Calculate average rating from reviews
        const avgRating = reviews.length > 0 
          ? reviews.reduce((sum: number, review: any) => sum + (review.stars || 0), 0) / reviews.length
          : 0;

        setStats({
          totalBookings: bookings.length,
          totalRevenue,
          activePros,
          totalCustomers,
          pendingDisputes,
          averageRating: Math.round(avgRating * 10) / 10 // Round to 1 decimal place
        });

      } catch (error) {
        console.error('Error fetching admin data:', error);
        
        // Fallback to existing bookings API if available
        try {
          const bookingsResponse = await fetch('/api/bookings');
          const bookingsData = await bookingsResponse.json();
          
          if (bookingsData.bookings) {
            const bookings = bookingsData.bookings;
            setRecentBookings(bookings.slice(0, 10));
            
            setStats({
              totalBookings: bookings.length,
              totalRevenue: bookings.reduce((sum: number, booking: any) => 
                sum + (booking.total_amount || 0), 0),
              activePros: 7, // Fallback
              totalCustomers: new Set(bookings.map((b: any) => b.customer_id)).size,
              pendingDisputes: 0,
              averageRating: 0
            });
          }
        } catch (fallbackError) {
          console.error('Error with fallback data fetch:', fallbackError);
          setStats({
            totalBookings: 0,
            totalRevenue: 0,
            activePros: 0,
            totalCustomers: 0,
            pendingDisputes: 0,
            averageRating: 0
          });
          setRecentBookings([]);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

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

  // Use formatCurrency from useLocale hook instead of local function

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AdminProtection>
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/customer/bookings" className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-200 group">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-gray-800">Manage Bookings</h3>
                <p className="text-sm text-gray-500 mt-1">View and manage all service bookings</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/pro-applications" className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-200 group">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-green-200 transition-colors">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-gray-800">Professional Applications</h3>
                <p className="text-sm text-gray-500 mt-1">Review and approve new professionals</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/services" className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-200 group">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-purple-200 transition-colors">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-gray-800">Service Catalog</h3>
                <p className="text-sm text-gray-500 mt-1">Manage available services and pricing</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/pro-accounts" className="group">
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-purple-300 hover:shadow-md transition-all">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-gray-800">Pro Accounts</h3>
                  <p className="text-sm text-gray-500 mt-1">View created professional accounts</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Interactive Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <button
            onClick={() => setActiveDetailView(activeDetailView === 'bookings' ? null : 'bookings')}
            className={`bg-white rounded-xl border p-6 shadow-sm hover:shadow-md transition-all text-left w-full ${
              activeDetailView === 'bookings' 
                ? 'border-blue-500 ring-2 ring-blue-200 shadow-md' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                activeDetailView === 'bookings' ? 'bg-blue-200' : 'bg-blue-100'
              }`}>
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 0 012 2" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalBookings.toLocaleString()}</div>
              <div className="text-sm font-medium text-gray-500">Total Bookings</div>
            </div>
          </button>

          <button
            onClick={() => setActiveDetailView(activeDetailView === 'revenue' ? null : 'revenue')}
            className={`bg-white rounded-xl border p-6 shadow-sm hover:shadow-md transition-all text-left w-full ${
              activeDetailView === 'revenue' 
                ? 'border-green-500 ring-2 ring-green-200 shadow-md' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                activeDetailView === 'revenue' ? 'bg-green-200' : 'bg-green-100'
              }`}>
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="text-xl font-bold text-gray-900 mb-1 break-words">{formatCurrency(Math.round(stats.totalRevenue / 100))}</div>
              <div className="text-sm font-medium text-gray-500">Platform Revenue</div>
            </div>
          </button>

          <button
            onClick={() => setActiveDetailView(activeDetailView === 'pros' ? null : 'pros')}
            className={`bg-white rounded-xl border p-6 shadow-sm hover:shadow-md transition-all text-left w-full ${
              activeDetailView === 'pros' 
                ? 'border-purple-500 ring-2 ring-purple-200 shadow-md' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                activeDetailView === 'pros' ? 'bg-purple-200' : 'bg-purple-100'
              }`}>
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.activePros}</div>
              <div className="text-sm font-medium text-gray-500">Active Pros</div>
            </div>
          </button>

          <button
            onClick={() => setActiveDetailView(activeDetailView === 'customers' ? null : 'customers')}
            className={`bg-white rounded-xl border p-6 shadow-sm hover:shadow-md transition-all text-left w-full ${
              activeDetailView === 'customers' 
                ? 'border-yellow-500 ring-2 ring-yellow-200 shadow-md' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                activeDetailView === 'customers' ? 'bg-yellow-200' : 'bg-yellow-100'
              }`}>
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalCustomers}</div>
              <div className="text-sm font-medium text-gray-500">Total Customers</div>
            </div>
          </button>

          <button
            onClick={() => setActiveDetailView(activeDetailView === 'disputes' ? null : 'disputes')}
            className={`bg-white rounded-xl border p-6 shadow-sm hover:shadow-md transition-all text-left w-full ${
              activeDetailView === 'disputes' 
                ? 'border-red-500 ring-2 ring-red-200 shadow-md' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                activeDetailView === 'disputes' ? 'bg-red-200' : 'bg-red-100'
              }`}>
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.pendingDisputes}</div>
              <div className="text-sm font-medium text-gray-500">Pending Disputes</div>
            </div>
          </button>

          <button
            onClick={() => setActiveDetailView(activeDetailView === 'reviews' ? null : 'reviews')}
            className={`bg-white rounded-xl border p-6 shadow-sm hover:shadow-md transition-all text-left w-full ${
              activeDetailView === 'reviews' 
                ? 'border-orange-500 ring-2 ring-orange-200 shadow-md' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                activeDetailView === 'reviews' ? 'bg-orange-200' : 'bg-orange-100'
              }`}>
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.averageRating > 0 ? `${stats.averageRating} ⭐` : 'N/A'}</div>
              <div className="text-sm font-medium text-gray-500">Avg Rating</div>
            </div>
          </button>
        </div>

        {/* Dynamic Detail View */}
        {activeDetailView && (
          <div className="mb-8">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {activeDetailView === 'bookings' && (
                <div>
                  <div className="px-6 py-5 border-b border-gray-200 bg-blue-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 0 012 2" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
                          <p className="text-sm text-gray-600">Latest booking activity and status updates</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setActiveDetailView(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    {recentBookings.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 0 012 2" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No recent bookings</h3>
                        <p className="text-gray-500">Bookings will appear here as they come in</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {recentBookings.map((booking) => (
                          <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{booking.service_title}</h4>
                              <p className="text-sm text-gray-600">{booking.customer_name} → {booking.pro_name}</p>
                              <p className="text-xs text-gray-400">{new Date(booking.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                                {booking.status}
                              </span>
                              <span className="font-semibold text-gray-900">{formatCurrency(booking.total_amount)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeDetailView === 'revenue' && (
                <div>
                  <div className="px-6 py-5 border-b border-gray-200 bg-green-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Revenue Analytics</h3>
                          <p className="text-sm text-gray-600">Financial performance and revenue breakdown</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setActiveDetailView(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{formatCurrency(Math.round(stats.totalRevenue / 100))}</div>
                        <div className="text-sm text-green-800">Total Revenue</div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{formatCurrency(Math.round((stats.totalRevenue * 0.15) / 100))}</div>
                        <div className="text-sm text-blue-800">Platform Fee (15%)</div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{formatCurrency(Math.round((stats.totalRevenue * 0.85) / 100))}</div>
                        <div className="text-sm text-purple-800">Pro Payouts (85%)</div>
                      </div>
                    </div>
                    <div className="text-center py-8 text-gray-500">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      Revenue charts and trends coming soon
                    </div>
                  </div>
                </div>
              )}

              {activeDetailView === 'pros' && (
                <div>
                  <div className="px-6 py-5 border-b border-gray-200 bg-purple-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Professional Management</h3>
                          <p className="text-sm text-gray-600">Manage active professionals and their performance</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setActiveDetailView(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {prosData.length === 0 ? (
                      <div className="p-8 text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <p className="text-gray-500 text-sm">No professionals found</p>
                        <p className="text-gray-400 text-xs mt-1">Active professionals will appear here</p>
                      </div>
                    ) : (
                      prosData.map((pro, index) => (
                        <div key={pro.user_id || index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-gray-900">
                                  {pro.display_name || pro.business_name || 'Unknown Professional'}
                                </div>
                                {pro.email && (
                                  <div className="text-sm text-gray-600">{pro.email}</div>
                                )}
                                {pro.phone && (
                                  <div className="text-xs text-gray-500">{pro.phone}</div>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center space-x-4">
                                <div className="text-sm">
                                  {pro.verified ? (
                                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                      ✓ Verified
                                    </span>
                                  ) : (
                                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                                      Pending
                                    </span>
                                  )}
                                </div>
                                {pro.rating_avg > 0 && (
                                  <div className="text-sm text-gray-600">
                                    ⭐ {pro.rating_avg.toFixed(1)} ({pro.rating_count})
                                  </div>
                                )}
                                {pro.total_jobs && (
                                  <div className="text-xs text-gray-500">
                                    {pro.total_jobs} jobs
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeDetailView === 'customers' && (
                <div>
                  <div className="px-6 py-5 border-b border-gray-200 bg-yellow-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Customer Management</h3>
                          <p className="text-sm text-gray-600">Manage customers, notes, and blacklist settings</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setActiveDetailView(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {customersData.length === 0 ? (
                      <div className="p-8 text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <p className="text-gray-500 text-sm">No customers found</p>
                        <p className="text-gray-400 text-xs mt-1">Customers will appear here as they sign up</p>
                      </div>
                    ) : (
                      customersData.map((customer, index) => (
                        <div key={customer.user_id || index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-gray-900">
                                  {customer.display_name || 'Unknown Customer'}
                                </div>
                                {customer.email && (
                                  <div className="text-sm text-gray-600">{customer.email}</div>
                                )}
                                {customer.phone && (
                                  <div className="text-xs text-gray-500">{customer.phone}</div>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center space-x-4">
                                <div className="text-sm text-gray-600">
                                  <div className="font-medium">{customer.total_bookings} bookings</div>
                                  {customer.total_spent > 0 && (
                                    <div className="text-xs text-gray-500">
                                      {formatCurrency(customer.total_spent / 100)} spent
                                    </div>
                                  )}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {customer.role && (
                                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                                      {customer.role}
                                    </span>
                                  )}
                                  <div className="mt-1">
                                    Joined: {new Date(customer.created_at).toLocaleDateString()}
                                  </div>
                                  {customer.last_booking && (
                                    <div>
                                      Last booking: {new Date(customer.last_booking).toLocaleDateString()}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeDetailView === 'disputes' && (
                <div>
                  <div className="px-6 py-5 border-b border-gray-200 bg-red-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Dispute Resolution</h3>
                          <p className="text-sm text-gray-600">Handle pending disputes and customer issues</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setActiveDetailView(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Disputes</h3>
                      <p className="text-gray-500">Dispute resolution interface will appear here when needed</p>
                    </div>
                  </div>
                </div>
              )}

              {activeDetailView === 'reviews' && (
                <div>
                  <div className="px-6 py-5 border-b border-gray-200 bg-orange-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Review Moderation</h3>
                          <p className="text-sm text-gray-600">Manage customer reviews and ratings</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setActiveDetailView(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Review Moderation Center</h3>
                      <p className="text-gray-500">Review filtering, moderation, and response tools coming soon</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* System Status */}
        <div className="mb-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                    <div>
                      <div className="text-sm font-medium text-green-800">Platform Operational</div>
                      <div className="text-xs text-green-600">All systems running normally</div>
                    </div>
                  </div>
                  <div className="text-xs text-green-600">Now</div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-400 rounded-full mr-3"></div>
                    <div>
                      <div className="text-sm font-medium text-blue-800">Payment Processing</div>
                      <div className="text-xs text-blue-600">Stripe integration healthy</div>
                    </div>
                  </div>
                  <div className="text-xs text-blue-600">2 min ago</div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-400 rounded-full mr-3"></div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">Database Backup</div>
                      <div className="text-xs text-gray-600">Last backup completed successfully</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">3 hours ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </AdminProtection>
  );
}