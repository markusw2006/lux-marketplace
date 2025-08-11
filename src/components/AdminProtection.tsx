'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface AdminProtectionProps {
  children: React.ReactNode;
}

export default function AdminProtection({ children }: AdminProtectionProps) {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      // Not logged in - redirect to login
      router.push('/login?redirect=/admin/dashboard');
      return;
    }

    // Check if user is admin
    const isAdmin = userProfile?.role === 'admin';
    
    if (!isAdmin) {
      // Not admin - redirect to appropriate dashboard
      if (userProfile?.role === 'pro') {
        router.push('/pro/dashboard');
      } else {
        router.push('/customer/bookings');
      }
      return;
    }

    setIsAuthorized(true);
  }, [user, userProfile, loading, router]);

  // Show loading while checking auth
  if (loading || !isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking admin access...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}