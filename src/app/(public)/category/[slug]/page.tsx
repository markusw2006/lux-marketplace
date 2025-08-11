import Link from 'next/link';
import { services } from '@/data/seed/services';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  
  // Get services for this category
  const categoryServices = services.filter(service => service.category_slug === slug);
  
  // Sort by popularity (price as proxy) - featured service first
  const sortedServices = [...categoryServices].sort((a, b) => b.fixed_base_price - a.fixed_base_price);
  const featuredService = sortedServices[0];
  const otherServices = sortedServices.slice(1);

  const categoryNames: { [key: string]: string } = {
    cleaning: 'Cleaning Services',
    plumbing: 'Plumbing Services', 
    electrical: 'Electrical Services',
    assembly: 'Assembly Services'
  };

  const categoryName = categoryNames[slug] || 'Services';

  if (categoryServices.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-medium text-gray-900 mb-2">
            {categoryName}
          </h1>
          <p className="text-gray-600">
            Professional {categoryName.toLowerCase()} with upfront pricing and instant booking
          </p>
        </div>

        <div className="space-y-8">
          {/* Featured Service Section */}
          {featuredService && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                ⭐ Most Popular
              </h2>
              <Link
                href={`/service/${featuredService.id}`}
                className="block bg-white rounded-xl border-2 border-blue-200 p-8 hover:shadow-lg hover:border-blue-300 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {featuredService.title_en}
                    </h3>
                    {featuredService.description_en && (
                      <p className="text-gray-600 text-base">
                        {featuredService.description_en}
                      </p>
                    )}
                  </div>
                  <div className="ml-6 text-right">
                    <div className="text-3xl font-bold text-gray-900">
                      ${Math.round(featuredService.fixed_base_price / 100)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {featuredService.fixed_duration_minutes} minutes
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 capitalize">
                    {featuredService.category_slug.replace('-', ' ')}
                  </span>
                  <span className="text-blue-600 font-medium">
                    Book Now →
                  </span>
                </div>
              </Link>
            </div>
          )}

          {/* Other Services */}
          {otherServices.length > 0 && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                All {categoryName}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {otherServices.map((service) => (
                  <Link
                    key={service.id}
                    href={`/service/${service.id}`}
                    className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-gray-300 transition-all duration-200"
                  >
                    <div className="mb-3">
                      <h4 className="text-base font-medium text-gray-900 mb-1">
                        {service.title_en}
                      </h4>
                      {service.description_en && (
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {service.description_en}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-gray-900">
                        ${Math.round(service.fixed_base_price / 100)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {service.fixed_duration_minutes}min
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}