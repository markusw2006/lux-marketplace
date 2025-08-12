'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminProtection from '@/components/AdminProtection';
import AdminHeader from '@/components/AdminHeader';

interface ProAccount {
  user_id: string;
  email: string;
  name: string;
  phone?: string;
  created_at: string;
  application_id: string | null;
  services: string[];
  experience: number | null;
  conversion_date: string;
}

export default function ProAccountsPage() {
  const [accounts, setAccounts] = useState<ProAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await fetch('/api/admin/pro-accounts');
      const data = await response.json();
      
      if (data.accounts) {
        setAccounts(data.accounts);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

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
      
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-4">
                  <li>
                    <Link href="/admin/dashboard" className="text-gray-500 hover:text-gray-700">
                      Admin Dashboard
                    </Link>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-4 text-sm font-medium text-gray-900">Pro Accounts</span>
                    </div>
                  </li>
                </ol>
              </nav>
              <h1 className="mt-2 text-2xl font-bold text-gray-900">Pro Accounts</h1>
              <p className="mt-1 text-sm text-gray-500">View professionals created from approved applications</p>
            </div>
            <div className="flex space-x-3">
              <Link 
                href="/admin/pro-applications"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                View Applications
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{accounts.length}</div>
            <div className="text-sm text-gray-500">Total Pro Accounts Created</div>
          </div>
        </div>

        {/* Accounts List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Professional Accounts</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {accounts.map((account) => (
              <div key={account.user_id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{account.name}</h3>
                        <p className="text-sm text-gray-500">{account.email}</p>
                        {account.phone && (
                          <p className="text-sm text-gray-500">{account.phone}</p>
                        )}
                        
                        <div className="mt-2">
                          {account.services.length > 0 && (
                            <div className="text-sm text-gray-600">
                              <strong>Services:</strong> {account.services.join(', ')}
                            </div>
                          )}
                          {account.experience && (
                            <div className="text-sm text-gray-600">
                              <strong>Experience:</strong> {account.experience} years
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-gray-900">
                      <strong>User ID:</strong> {account.user_id}
                    </div>
                    {account.application_id && (
                      <div className="text-xs text-gray-500">
                        From Application: {account.application_id}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      Created: {new Date(account.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      Converted: {new Date(account.conversion_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {accounts.length === 0 && (
            <div className="px-6 py-12 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">No Pro Accounts</h3>
              <p className="text-sm text-gray-500">No professional accounts have been created yet.</p>
              <p className="text-sm text-gray-500 mt-1">
                <Link href="/admin/pro-applications" className="text-blue-600 hover:text-blue-700">
                  Review applications →
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
    </AdminProtection>
  );
}