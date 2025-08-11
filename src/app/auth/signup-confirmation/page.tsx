'use client';

import Link from 'next/link';
import { useLocale } from '@/contexts/LocaleContext';

export default function SignupConfirmation() {
  const { t } = useLocale();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Check Your Email!
          </h2>
          
          <p className="text-gray-600 mb-8">
            We&apos;ve sent a confirmation link to your email address. 
            Please click the link in the email to verify your account and complete your registration.
          </p>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left">
            <h3 className="font-medium text-blue-800 mb-2">What&apos;s next?</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Check your inbox (including spam folder)</li>
              <li>• Click the confirmation link in the email</li>
              <li>• You&apos;ll be automatically logged in</li>
              <li>• Start booking services or apply to become a pro</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link 
              href="/login"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Go to Login
            </Link>
            
            <Link 
              href="/"
              className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Back to Homepage
            </Link>
          </div>

          {/* Help Text */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Didn&apos;t receive the email?{' '}
              <button className="font-medium text-blue-600 hover:text-blue-500">
                Resend confirmation
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}