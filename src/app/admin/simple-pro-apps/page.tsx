'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ProApplication {
  id: number;
  application_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  services: string[];
  experience: string;
  location: string;
  has_license: boolean;
  has_insurance: boolean;
  has_vehicle: boolean;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export default function SimpleProApplicationsPage() {
  const [applications, setApplications] = useState<ProApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'under_review' | 'approved' | 'rejected'>('all');
  const [selectedApplication, setSelectedApplication] = useState<ProApplication | null>(null);

  useEffect(() => {
    // Load mock applications immediately
    const mockApplications: ProApplication[] = [
      {
        id: 1,
        application_id: 'APP-ABC123',
        first_name: 'Carlos',
        last_name: 'Mendoza',
        email: 'carlos.mendoza@example.com',
        phone: '+52 55 1234 5678',
        services: ['Plumbing', 'Handyman'],
        experience: '5-10',
        location: 'Mexico City',
        has_license: true,
        has_insurance: true,
        has_vehicle: true,
        status: 'pending',
        created_at: '2025-01-10T10:00:00Z',
        updated_at: '2025-01-10T10:00:00Z'
      },
      {
        id: 2,
        application_id: 'APP-DEF456',
        first_name: 'Ana',
        last_name: 'López',
        email: 'ana.lopez@example.com',
        phone: '+52 55 9876 5432',
        services: ['Cleaning'],
        experience: '3-5',
        location: 'Mexico City',
        has_license: false,
        has_insurance: true,
        has_vehicle: false,
        status: 'under_review',
        admin_notes: 'Good references, checking background',
        created_at: '2025-01-09T14:30:00Z',
        updated_at: '2025-01-10T09:15:00Z'
      },
      {
        id: 3,
        application_id: 'APP-GHI789',
        first_name: 'Miguel',
        last_name: 'Rodríguez',
        email: 'miguel.rodriguez@example.com',
        phone: '+52 55 5555 1234',
        services: ['Electrical', 'Plumbing'],
        experience: 'more-than-10',
        location: 'Mexico City',
        has_license: true,
        has_insurance: true,
        has_vehicle: true,
        status: 'approved',
        admin_notes: 'Excellent qualifications, approved for immediate start',
        created_at: '2025-01-08T16:20:00Z',
        updated_at: '2025-01-09T11:45:00Z'
      }
    ];
    
    setApplications(mockApplications);
  }, []);

  const handleStatusUpdate = (applicationId: string, newStatus: ProApplication['status'], notes?: string) => {
    setApplications(apps => apps.map(app => 
      app.application_id === applicationId 
        ? { ...app, status: newStatus, admin_notes: notes, updated_at: new Date().toISOString() }
        : app
    ));
    
    setSelectedApplication(null);
    alert(`Application ${applicationId} status updated to: ${newStatus}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'under_review': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredApplications = applications.filter(app => 
    filter === 'all' || app.status === filter
  );

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    under_review: applications.filter(app => app.status === 'under_review').length,
    approved: applications.filter(app => app.status === 'approved').length,
    rejected: applications.filter(app => app.status === 'rejected').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center space-x-4">
              <Link href="/admin/simple" className="flex items-center space-x-2 text-lg font-semibold hover:text-blue-200">
                <img src="/lux_logo.svg" alt="Lux" className="h-12 w-auto" />
                <span>Admin</span>
              </Link>
              <span className="text-blue-200">|</span>
              <span className="text-blue-200 text-sm">Pro Applications</span>
            </div>
            <div className="text-sm text-blue-200">
              Test Mode
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-4">
                  <li>
                    <Link href="/admin/simple" className="text-gray-500 hover:text-gray-700">
                      Admin Dashboard
                    </Link>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-4 text-sm font-medium text-gray-900">Pro Applications</span>
                    </div>
                  </li>
                </ol>
              </nav>
              <h1 className="mt-2 text-2xl font-bold text-gray-900">Professional Applications</h1>
              <p className="mt-1 text-sm text-gray-500">Review and manage professional service provider applications</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-500">Total Applications</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-gray-500">Pending Review</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.under_review}</div>
              <div className="text-sm text-gray-500">Under Review</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
              <div className="text-sm text-gray-500">Approved</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
              <div className="text-sm text-gray-500">Rejected</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4">
            <div className="flex flex-wrap gap-2">
              {(['all', 'pending', 'under_review', 'approved', 'rejected'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === status
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? 'All Applications' : status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  {status !== 'all' && (
                    <span className="ml-2 bg-white bg-opacity-50 text-xs px-2 py-1 rounded-full">
                      {stats[status]}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredApplications.map((application) => (
              <div key={application.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {application.first_name} {application.last_name}
                        </h3>
                        <p className="text-sm text-gray-500">{application.email}</p>
                        <p className="text-sm text-gray-500">{application.phone}</p>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-600">
                          <strong>Services:</strong> {application.services.join(', ')}
                        </div>
                        <div className="text-sm text-gray-600">
                          <strong>Experience:</strong> {application.experience} years
                        </div>
                        <div className="text-sm text-gray-600 flex space-x-4">
                          <span className={application.has_license ? 'text-green-600' : 'text-gray-400'}>
                            {application.has_license ? '✓' : '✗'} License
                          </span>
                          <span className={application.has_insurance ? 'text-green-600' : 'text-gray-400'}>
                            {application.has_insurance ? '✓' : '✗'} Insurance
                          </span>
                          <span className={application.has_vehicle ? 'text-green-600' : 'text-gray-400'}>
                            {application.has_vehicle ? '✓' : '✗'} Vehicle
                          </span>
                        </div>
                      </div>
                    </div>
                    {application.admin_notes && (
                      <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        <strong>Notes:</strong> {application.admin_notes}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(application.status)}`}>
                        {application.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        Applied: {new Date(application.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {application.application_id}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedApplication(application)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Review
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredApplications.length === 0 && (
            <div className="px-6 py-12 text-center">
              <div className="text-gray-500">No applications found for the selected filter.</div>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Review Application: {selectedApplication.first_name} {selectedApplication.last_name}
                  </h3>
                  <p className="text-sm text-gray-500">Application ID: {selectedApplication.application_id}</p>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <div className="text-sm text-gray-900">{selectedApplication.email}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <div className="text-sm text-gray-900">{selectedApplication.phone}</div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Services Offered</label>
                    <div className="text-sm text-gray-900">{selectedApplication.services.join(', ')}</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Experience</label>
                      <div className="text-sm text-gray-900">{selectedApplication.experience} years</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Location</label>
                      <div className="text-sm text-gray-900">{selectedApplication.location}</div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Qualifications</label>
                    <div className="text-sm text-gray-900 space-y-1">
                      <div className={selectedApplication.has_license ? 'text-green-600' : 'text-gray-400'}>
                        {selectedApplication.has_license ? '✓' : '✗'} Has relevant licenses/certifications
                      </div>
                      <div className={selectedApplication.has_insurance ? 'text-green-600' : 'text-gray-400'}>
                        {selectedApplication.has_insurance ? '✓' : '✗'} Has liability insurance
                      </div>
                      <div className={selectedApplication.has_vehicle ? 'text-green-600' : 'text-gray-400'}>
                        {selectedApplication.has_vehicle ? '✓' : '✗'} Has reliable transportation
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <div className="space-x-2 flex">
                  {selectedApplication.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(selectedApplication.application_id, 'under_review')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                      >
                        Start Review
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(selectedApplication.application_id, 'approved', 'Fast-tracked approval')}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
                      >
                        Approve
                      </button>
                    </>
                  )}
                  
                  {selectedApplication.status === 'under_review' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(selectedApplication.application_id, 'approved', 'Application reviewed and approved')}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(selectedApplication.application_id, 'rejected', 'Application rejected after review')}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-400"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}