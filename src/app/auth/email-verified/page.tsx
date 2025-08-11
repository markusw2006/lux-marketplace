'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import { useAuth } from '@/contexts/AuthContext';

export default function EmailVerified() {
  const { t } = useLocale();
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Get user role from user metadata or make API call
    if (user) {
      // In a real app, you'd fetch the user's role from your database
      // For now, we'll assume 'customer' as default
      setUserRole('customer');
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Email Verified! 🎉
          </h2>
          
          <p className="text-gray-600 mb-8">
            Your email has been successfully verified. Your account is now active and ready to use.
          </p>

          {/* Welcome Message */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 text-left">
            <h3 className="font-medium text-green-800 mb-2">Welcome to Lux Marketplace!</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Browse and book instant services</li>
              <li>• Connect with verified professionals</li>
              <li>• Manage your bookings and history</li>
              <li>• Apply to become a service provider</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            {user ? (
              <>
                <Link 
                  href={userRole === 'pro' ? '/pro/dashboard' : '/'}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  {userRole === 'pro' ? 'Go to Pro Dashboard' : 'Start Browsing Services'}
                </Link>
                
                <Link 
                  href="/customer/bookings"
                  className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  My Bookings
                </Link>
              </>
            ) : (
              <>
                <Link 
                  href="/login"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  Login to Your Account
                </Link>
                
                <Link 
                  href="/"
                  className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  Browse Services
                </Link>
              </>
            )}
          </div>

          {/* Additional Options */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-center">
              <Link 
                href="/become-a-pro" 
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                Become a Pro
              </Link>
              <Link 
                href="/help" 
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                Help Center
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}