'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLocale } from '@/contexts/LocaleContext';
import SearchParamsWrapper from '@/components/SearchParamsWrapper';

function ConfirmationContent() {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const applicantName = searchParams.get('name') || 'Professional';
  const applicationId = searchParams.get('id') || `APP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Submitted Successfully!</h1>
          <p className="text-lg text-gray-600">Thank you for your interest in joining Lux, {applicantName}!</p>
        </div>

        {/* Application Summary Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Application Details</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Application ID:</span>
              <span className="font-medium text-gray-900">#{applicationId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Applicant:</span>
              <span className="font-medium text-gray-900">{applicantName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Submitted:</span>
              <span className="font-medium text-gray-900">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-medium text-orange-600">Under Review</span>
            </div>
          </div>
        </div>

        {/* What Happens Next */}
        <div className="bg-blue-50 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">What happens next?</h3>
          <div className="space-y-2 text-blue-800">
            <div className="flex items-start">
              <span className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">1</span>
              <p><strong>Application Review:</strong> Our team will review your application within 24-48 hours.</p>
            </div>
            <div className="flex items-start">
              <span className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">2</span>
              <p><strong>Background Check:</strong> We'll conduct a background check to ensure customer safety.</p>
            </div>
            <div className="flex items-start">
              <span className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">3</span>
              <p><strong>Payment Setup:</strong> Complete your Stripe Connect setup to receive earnings instantly.</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/pro/dashboard" 
            className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-lg font-medium text-center hover:bg-gray-800 transition-colors"
          >
            Go to Pro Dashboard
          </Link>
          <Link 
            href="/" 
            className="flex-1 bg-white text-gray-900 border border-gray-300 py-3 px-6 rounded-lg font-medium text-center hover:bg-gray-50 transition-colors"
          >
            Return to Homepage
          </Link>
        </div>

        {/* Support */}
        <div className="text-center mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-2">Questions about your application?</p>
          <div className="flex justify-center space-x-4 text-sm">
            <Link href="/support" className="text-blue-600 hover:text-blue-700">Contact Support</Link>
            <span className="text-gray-300">|</span>
            <Link href="/help" className="text-blue-600 hover:text-blue-700">Help Center</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProApplicationConfirmation() {
  return (
    <SearchParamsWrapper>
      <ConfirmationContent />
    </SearchParamsWrapper>
  );
}