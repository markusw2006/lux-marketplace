'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { services } from '@/data/seed/services';
import { useLocale } from '@/contexts/LocaleContext';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const zip = searchParams.get('zip') || '06700';
  const { formatCurrency, t, locale } = useLocale();

  // Smart search with ranking
  const searchResults = services
    .map(service => {
      const queryLower = query.toLowerCase();
      let score = 0;
      
      // Exact title match gets highest score
      if (service.title_en.toLowerCase().includes(queryLower)) score += 10;
      if (service.title_es.toLowerCase().includes(queryLower)) score += 10;
      
      // Category match gets high score
      if (service.category_slug.toLowerCase().includes(queryLower)) score += 8;
      
      // Description match gets lower score
      if (service.description_en?.toLowerCase().includes(queryLower)) score += 3;
      if (service.description_es?.toLowerCase().includes(queryLower)) score += 3;
      
      return { ...service, searchScore: score };
    })
    .filter(service => service.searchScore > 0)
    .sort((a, b) => b.searchScore - a.searchScore);

  // Get the best match and other results
  const bestMatch = searchResults[0];
  const otherResults = searchResults.slice(1);
  
  // Group other results by category
  const groupedResults = otherResults.reduce((acc, service) => {
    const category = service.category_slug;
    if (!acc[category]) acc[category] = [];
    acc[category].push(service);
    return acc;
  }, {} as Record<string, typeof otherResults>);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-medium text-gray-900 mb-2">
            {t('search.results-for')} "{query}"
          </h1>
          <p className="text-gray-600">
            {searchResults.length} {t('search.services-found')} {zip}
          </p>
        </div>

        {searchResults.length > 0 ? (
          <div className="space-y-8">
            {/* Best Match Section */}
            {bestMatch && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  🎯 Best Match for "{query}"
                </h2>
                <Link
                  href={`/service/${bestMatch.id}`}
                  className="block bg-white rounded-xl border-2 border-blue-200 p-8 hover:shadow-lg hover:border-blue-300 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {locale === 'en' ? bestMatch.title_en : bestMatch.title_es}
                      </h3>
                      {(locale === 'en' ? bestMatch.description_en : bestMatch.description_es) && (
                        <p className="text-gray-600 text-base">
                          {locale === 'en' ? bestMatch.description_en : bestMatch.description_es}
                        </p>
                      )}
                    </div>
                    <div className="ml-6 text-right">
                      <div className="text-3xl font-bold text-gray-900">
                        {formatCurrency(Math.round(bestMatch.fixed_base_price / 100))}
                      </div>
                      <div className="text-sm text-gray-500">
                        {bestMatch.fixed_duration_minutes} minutes
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 capitalize">
                      {bestMatch.category_slug.replace('-', ' ')}
                    </span>
                    <span className="text-blue-600 font-medium">
                      Book Now →
                    </span>
                  </div>
                </Link>
              </div>
            )}

            {/* Other Options */}
            {otherResults.length > 0 && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Other {query} Services
                </h2>
                
                {Object.entries(groupedResults).map(([category, categoryServices]) => (
                  <div key={category} className="mb-6">
                    <h3 className="text-base font-medium text-gray-700 mb-3 capitalize">
                      {category.replace('-', ' ')} Services
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categoryServices.map((service) => (
                        <Link
                          key={service.id}
                          href={`/service/${service.id}`}
                          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-gray-300 transition-all duration-200"
                        >
                          <div className="mb-3">
                            <h4 className="text-base font-medium text-gray-900 mb-1">
                              {locale === 'en' ? service.title_en : service.title_es}
                            </h4>
                            {(locale === 'en' ? service.description_en : service.description_es) && (
                              <p className="text-gray-600 text-sm line-clamp-2">
                                {locale === 'en' ? service.description_en : service.description_es}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-semibold text-gray-900">
                              {formatCurrency(Math.round(service.fixed_base_price / 100))}
                            </span>
                            <span className="text-xs text-gray-500">
                              {service.fixed_duration_minutes}min
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mb-4">
              <svg className="w-16 h-16 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('search.no-services')}
            </h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any services matching "{query}". Try a different search term.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Popular services:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['cleaning', 'plumbing', 'electrical', 'handyman'].map((category) => (
                  <Link
                    key={category}
                    href={`/category/${category}`}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-full text-sm text-gray-700 transition-colors"
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}