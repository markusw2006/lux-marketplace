'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function AdminHeader() {
  const { user, userProfile, signOut } = useAuth();

  return (
    <div className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-4">
            <Link href="/admin/dashboard" className="flex items-center space-x-2">
              <img src="/lux_logo.svg" alt="Lux" className="h-12 w-auto" />
              <span className="text-lg font-semibold">Admin</span>
            </Link>
            <span className="text-blue-200">|</span>
            <span className="text-blue-200 text-sm">
              Logged in as Admin
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-blue-200">
              {userProfile?.first_name || user?.email || 'Admin User'}
            </span>
            <button
              onClick={signOut}
              className="text-sm text-blue-200 hover:text-white transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}