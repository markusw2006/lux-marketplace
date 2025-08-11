'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { mockAuth } from '@/lib/mock-auth';

export default function AdminTestPage() {
  const router = useRouter();

  useEffect(() => {
    // Set up mock admin user in localStorage for testing
    const mockAdminUser = {
      id: 'admin-test-123',
      email: 'admin@test.com',
      role: 'admin',
      first_name: 'Admin',
      last_name: 'User'
    };
    
    localStorage.setItem('mockUser', JSON.stringify(mockAdminUser));
    
    // Redirect to admin dashboard
    setTimeout(() => {
      router.push('/admin/dashboard');
    }, 1000);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Setting up Admin Test Session</h2>
        <p className="text-gray-600">Logging you in as admin and redirecting to dashboard...</p>
      </div>
    </div>
  );
}