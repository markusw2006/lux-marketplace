'use client';

import Link from 'next/link';
import { Professional } from '@/data/seed/pros';
import { useLocale } from '@/contexts/LocaleContext';

interface ProCardProps {
  professional: Professional;
  serviceId: string;
  filters?: Record<string, any>;
}

export default function ProCard({ professional, serviceId, filters = {} }: ProCardProps) {
  const { formatCurrency } = useLocale();

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ));
  };

  // Build booking URL with pre-filled filters
  const buildBookingUrl = () => {
    const params = new URLSearchParams();
    params.set('pro', professional.id);
    
    // Add filter parameters
    if (filters.date) params.set('date', filters.date);
    if (filters.timePreference) params.set('time', filters.timePreference);
    if (filters.bedrooms) params.set('bedrooms', filters.bedrooms.toString());
    if (filters.bathrooms) params.set('bathrooms', filters.bathrooms.toString());
    if (filters.cleaningType) params.set('cleaning_type', filters.cleaningType);
    if (filters.propertyType) params.set('property_type', filters.propertyType);
    if (filters.urgency) params.set('urgency', filters.urgency);
    if (filters.propertySize) params.set('property_size', filters.propertySize);
    
    return `/service/${serviceId}?${params.toString()}`;
  };

  // Calculate distance (mock - in real app would use user location)
  const mockDistance = Math.round(Math.random() * 15 + 2);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Horizontal row layout */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          {/* Left section: Photo and basic info */}
          <div className="flex items-center space-x-4 flex-1">
            {/* Professional Photo */}
            <div className="flex-shrink-0">
              {professional.profilePhotoUrl ? (
                <img
                  src={professional.profilePhotoUrl}
                  alt={professional.businessName}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Business info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {professional.businessName}
                </h3>
                {professional.verified && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Verified
                  </span>
                )}
              </div>
              
              {/* Rating and reviews */}
              <div className="flex items-center space-x-3 mb-2">
                <div className="flex items-center space-x-1">
                  {renderStars(professional.rating)}
                  <span className="text-sm font-medium text-gray-900 ml-1">
                    {professional.rating}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  ({professional.reviewCount} reviews)
                </span>
              </div>

              {/* Tagline and key info */}
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>{professional.experienceYears} years exp</span>
                <span>{professional.totalJobs} jobs</span>
                <span>{mockDistance} km away</span>
                {professional.availability.sameDay && (
                  <span className="text-green-600">• Same day</span>
                )}
              </div>
            </div>
          </div>

          {/* Center section: Specialties */}
          <div className="flex-1 px-6">
            <div className="flex flex-wrap gap-2">
              {professional.specialties.slice(0, 3).map((specialty, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {specialty}
                </span>
              ))}
              {professional.specialties.length > 3 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  +{professional.specialties.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Right section: Price and actions */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(Math.round(professional.startingPrice / 100))}
              </div>
              <div className="text-sm text-gray-500">starting price</div>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Link
                href={buildBookingUrl()}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm text-center"
              >
                Book Now
              </Link>
              <Link
                href={`/professional/${professional.id}`}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium text-center"
              >
                View Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}