'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { services } from '@/data/seed/services';
import { useLocale } from '@/contexts/LocaleContext';

interface SearchPopupProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  zipCode: string;
}

export default function SearchPopup({ isOpen, onClose, searchQuery, zipCode }: SearchPopupProps) {
  const router = useRouter();
  const { formatCurrency, t, locale } = useLocale();

  // Smart search with ranking (same logic as search page)
  const searchResults = services
    .map(service => {
      const queryLower = searchQuery.toLowerCase();
      let score = 0;
      
      if (service.title_en.toLowerCase().includes(queryLower)) score += 10;
      if (service.title_es.toLowerCase().includes(queryLower)) score += 10;
      if (service.category_slug.toLowerCase().includes(queryLower)) score += 8;
      if (service.description_en?.toLowerCase().includes(queryLower)) score += 3;
      if (service.description_es?.toLowerCase().includes(queryLower)) score += 3;
      
      return { ...service, searchScore: score };
    })
    .filter(service => service.searchScore > 0)
    .sort((a, b) => b.searchScore - a.searchScore)
    .slice(0, 6); // Limit to top 6 results

  const handleServiceSelect = (serviceId: string) => {
    onClose();
    // Navigate to pros page for this service
    router.push(`/pros/${serviceId}?zip=${zipCode}`);
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex items-start justify-center min-h-screen pt-16 px-4">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                {t('search.results-for')} &ldquo;{searchQuery}&rdquo;
              </h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {searchResults.length} {t('search.services-found')} {zipCode}
            </p>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {searchResults.length > 0 ? (
              <div className="p-2">
                {searchResults.map((service, index) => (
                  <button
                    key={service.id}
                    onClick={() => handleServiceSelect(service.id)}
                    className={`w-full text-left p-4 rounded-xl hover:bg-gray-50 transition-colors border-2 ${
                      index === 0 ? 'border-blue-200 bg-blue-50' : 'border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-gray-900">
                            {locale === 'en' ? service.title_en : service.title_es}
                          </h4>
                          {index === 0 && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                              Best Match
                            </span>
                          )}
                        </div>
                        {(locale === 'en' ? service.description_en : service.description_es) && (
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {locale === 'en' ? service.description_en : service.description_es}
                          </p>
                        )}
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="capitalize">
                            {service.category_slug.replace('-', ' ')}
                          </span>
                          <span>{service.fixed_duration_minutes} min</span>
                        </div>
                      </div>
                      <div className="ml-4 text-right">
                        <div className="text-lg font-semibold text-gray-900">
                          {formatCurrency(Math.round(service.fixed_base_price / 100))}
                        </div>
                        <div className="text-xs text-gray-500">
                          starting price
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  {t('search.no-services')}
                </h4>
                <p className="text-gray-600">
                  We couldn&apos;t find any services matching &ldquo;{searchQuery}&rdquo;. Try a different search term.
                </p>
              </div>
            )}
          </div>

          {/* Footer hint */}
          {searchResults.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Select a service to view available professionals in your area
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}