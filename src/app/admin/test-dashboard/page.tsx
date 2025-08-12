'use client';

import { useState, useEffect } from 'react';
import { useLocale } from '@/contexts/LocaleContext';

// Test version of dashboard without AdminProtection
export default function TestDashboard() {
  const { formatCurrency } = useLocale();
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activePros: 0,
    totalCustomers: 0,
    pendingDisputes: 0,
    averageRating: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching admin data...');
        
        // Fetch all admin data in parallel
        const [bookingsRes, prosRes, customersRes, disputesRes, reviewsRes] = await Promise.all([
          fetch('/api/admin/bookings'),
          fetch('/api/admin/pros'),
          fetch('/api/admin/customers'),
          fetch('/api/admin/disputes'),
          fetch('/api/admin/reviews')
        ]);

        console.log('Responses:', { bookingsRes: bookingsRes.ok, prosRes: prosRes.ok, customersRes: customersRes.ok });

        // Parse responses
        const bookingsData = bookingsRes.ok ? await bookingsRes.json() : { bookings: [] };
        const prosData = prosRes.ok ? await prosRes.json() : { pros: [] };
        const customersData = customersRes.ok ? await customersRes.json() : { customers: [] };
        const disputesData = disputesRes.ok ? await disputesRes.json() : { disputes: [] };
        const reviewsData = reviewsRes.ok ? await reviewsRes.json() : { reviews: [] };

        console.log('Data:', { 
          bookings: bookingsData.bookings?.length, 
          pros: prosData.pros?.length,
          customers: customersData.customers?.length
        });

        const bookings = bookingsData.bookings || [];
        const pros = prosData.pros || [];
        const customers = customersData.customers || [];
        const disputes = disputesData.disputes || [];
        const reviews = reviewsData.reviews || [];

        // Calculate real statistics
        const totalRevenue = bookings.reduce((sum: number, booking: any) => 
          sum + (booking.total_amount || 0), 0);
        
        const activePros = pros.filter((pro: any) => pro.verified && !pro.suspended).length;
        const totalCustomers = customers.length;
        const pendingDisputes = disputes.filter((dispute: any) => 
          dispute.status === 'open' || dispute.status === 'pending'
        ).length;
        
        // Calculate average rating from reviews
        const avgRating = reviews.length > 0 
          ? reviews.reduce((sum: number, review: any) => sum + (review.stars || 0), 0) / reviews.length
          : 0;

        console.log('Calculated stats:', { 
          totalBookings: bookings.length,
          totalRevenue,
          activePros,
          totalCustomers,
          pendingDisputes,
          averageRating: Math.round(avgRating * 10) / 10
        });

        setStats({
          totalBookings: bookings.length,
          totalRevenue,
          activePros,
          totalCustomers,
          pendingDisputes,
          averageRating: Math.round(avgRating * 10) / 10
        });

      } catch (error) {
        console.error('Error fetching admin data:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        console.log('Setting loading to false');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading test dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Test Admin Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">Testing dashboard connectivity without auth</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  📊
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Bookings</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalBookings}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  💰
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Platform Revenue</dt>
                  <dd className="text-lg font-medium text-gray-900">{formatCurrency(stats.totalRevenue)}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  👨‍🔧
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Pros</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.activePros}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  👥
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Customers</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalCustomers}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  ⚠️
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending Disputes</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.pendingDisputes}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  ⭐
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg Rating</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : 'N/A'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}