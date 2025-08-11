'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { services } from '@/data/seed/services';
import { professionals, getProfessionalsByService, filterProfessionals } from '@/data/seed/pros';
import { useLocale } from '@/contexts/LocaleContext';
import FilterSidebar from '@/components/FilterSidebar';
import ProCard from '@/components/ProCard';
import SearchParamsWrapper from '@/components/SearchParamsWrapper';

function ProsListingContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { t, locale } = useLocale();
  const serviceId = params.serviceId as string;
  
  // Get the service details
  const service = services.find(s => s.id === serviceId);
  const servicePros = getProfessionalsByService(service?.category_slug || '');
  
  const [filters, setFilters] = useState<any>({});
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'distance' | 'response-time'>('rating');

  // Get initial filters from URL
  useEffect(() => {
    const urlFilters: any = {};
    
    // Parse URL parameters into filters
    const zip = searchParams.get('zip');
    const date = searchParams.get('date');
    const bedrooms = searchParams.get('bedrooms');
    const bathrooms = searchParams.get('bathrooms');
    const cleaningType = searchParams.get('cleaning_type');
    const propertyType = searchParams.get('property_type');
    const urgency = searchParams.get('urgency');
    
    if (date) urlFilters.date = date;
    if (bedrooms) urlFilters.bedrooms = parseInt(bedrooms);
    if (bathrooms) urlFilters.bathrooms = parseInt(bathrooms);
    if (cleaningType) urlFilters.cleaningType = cleaningType;
    if (propertyType) urlFilters.propertyType = propertyType;
    if (urgency) urlFilters.urgency = urgency;
    
    setFilters(urlFilters);
  }, [searchParams]);

  // Filter and sort professionals
  const filteredPros = useMemo(() => {
    let filtered = filterProfessionals(servicePros, {
      sameDay: filters.availability === 'same-day',
      nextDay: filters.availability === 'next-day', 
      weekend: filters.availability === 'weekend',
      maxPrice: filters.maxPrice,
      minRating: filters.minRating,
      verified: filters.verified
    });

    // Apply service-specific filters
    if (filters.urgency === 'emergency') {
      filtered = filtered.filter(pro => pro.availability.sameDay);
    }

    // Sort professionals
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.startingPrice - b.startingPrice;
        case 'distance':
          // Mock distance sorting - in real app would calculate actual distance
          return Math.random() - 0.5;
        case 'response-time':
          return a.responseTime - b.responseTime;
        default: // rating
          const aScore = a.rating * Math.log(a.reviewCount + 1);
          const bScore = b.rating * Math.log(b.reviewCount + 1);
          return bScore - aScore;
      }
    });

    return filtered;
  }, [servicePros, filters, sortBy]);

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Service not found</h2>
          <p className="mt-2 text-gray-600">The service you're looking for doesn't exist.</p>
          <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link href="/" className="text-gray-500 hover:text-gray-700">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <Link href={`/category/${service.category_slug}`} className="ml-4 text-gray-500 hover:text-gray-700 capitalize">
                    {service.category_slug.replace('-', ' ')}
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-4 text-sm font-medium text-gray-900">
                    {locale === 'en' ? service.title_en : service.title_es}
                  </span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Page title */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {locale === 'en' ? service.title_en : service.title_es} Professionals
            </h1>
            <p className="text-gray-600">
              {filteredPros.length} verified professionals available in your area
            </p>
          </div>

          {/* Sort controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="rating">Top rated</option>
                <option value="price">Lowest price</option>
                <option value="distance">Distance</option>
                <option value="response-time">Fastest response</option>
              </select>
            </div>
            
            {/* View toggle (could add grid/list view) */}
            <div className="text-sm text-gray-500">
              Showing {filteredPros.length} of {servicePros.length} professionals
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <div className="lg:col-span-1">
            <FilterSidebar
              serviceId={serviceId}
              onFiltersChange={setFilters}
              totalPros={filteredPros.length}
            />
          </div>

          {/* Professionals List */}
          <div className="lg:col-span-3">
            {filteredPros.length > 0 ? (
              <div className="space-y-4">
                {filteredPros.map((pro) => (
                  <ProCard
                    key={pro.id}
                    professional={pro}
                    serviceId={serviceId}
                    filters={filters}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 119.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No professionals match your filters
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search criteria to see more results.
                </p>
                <button
                  onClick={() => setFilters({})}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Load more (if needed for pagination) */}
            {filteredPros.length > 10 && (
              <div className="mt-12 text-center">
                <button className="px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  Load more professionals
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProsListingPage() {
  return (
    <SearchParamsWrapper>
      <ProsListingContent />
    </SearchParamsWrapper>
  );
}