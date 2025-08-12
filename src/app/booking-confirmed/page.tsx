'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import SearchParamsWrapper from '@/components/SearchParamsWrapper';

function BookingConfirmedContent() {
  const searchParams = useSearchParams();
  const { t, formatCurrency } = useLocale();
  const [bookingDetails, setBookingDetails] = useState({
    id: 'BK' + Math.random().toString(36).substr(2, 8).toUpperCase(),
    service: searchParams.get('service') || 'Service Booking',
    date: searchParams.get('date') || new Date().toLocaleDateString(),
    time: searchParams.get('time') || 'TBD',
    total: searchParams.get('total') || '0',
    address: searchParams.get('address') || 'Address provided'
  });

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('booking.confirmed')}</h1>
          <p className="text-lg text-gray-600">{t('booking.success')}</p>
        </div>

        {/* Booking Summary Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Details</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Booking Reference:</span>
              <span className="font-medium text-gray-900">{bookingDetails.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Service:</span>
              <span className="font-medium text-gray-900">{bookingDetails.service}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium text-gray-900">{bookingDetails.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time:</span>
              <span className="font-medium text-gray-900">{bookingDetails.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('booking.total')}:</span>
              <span className="font-semibold text-gray-900">{formatCurrency(parseInt(bookingDetails.total))}</span>
            </div>
          </div>
        </div>

        {/* What Happens Next */}
        <div className="bg-blue-50 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">{t('booking.what-next')}</h3>
          <div className="space-y-2 text-blue-800">
            <div className="flex items-start">
              <span className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">1</span>
              <p>{t('booking.finding-pro')}</p>
            </div>
            <div className="flex items-start">
              <span className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">2</span>
              <p>{t('booking.email-confirm')}</p>
            </div>
            <div className="flex items-start">
              <span className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">3</span>
              <p>{t('booking.pro-contact')}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/customer/bookings" 
            className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-lg font-medium text-center hover:bg-gray-800 transition-colors"
          >
{t('booking.view-bookings')}
          </Link>
          <Link 
            href="/#services" 
            className="flex-1 bg-white text-gray-900 border border-gray-300 py-3 px-6 rounded-lg font-medium text-center hover:bg-gray-50 transition-colors"
          >
            {t('booking.book-another')}
          </Link>
        </div>

        {/* Support */}
        <div className="text-center mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-2">Need help or have questions?</p>
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

export default function BookingConfirmedPage() {
  return (
    <SearchParamsWrapper>
      <BookingConfirmedContent />
    </SearchParamsWrapper>
  );
}