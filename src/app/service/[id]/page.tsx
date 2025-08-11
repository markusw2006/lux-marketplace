'use client';

import Link from 'next/link';
import Configurator from './Configurator';
import { getServiceById } from '@/lib/pricing';
import { notFound } from 'next/navigation';
import { useLocale } from '@/contexts/LocaleContext';
import SearchParamsWrapper from '@/components/SearchParamsWrapper';
import { use } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

function ServicePageContent({ params }: PageProps) {
  const { id } = use(params);
  const { formatCurrency, locale, t } = useLocale();
  
  // Get service from seed data
  const serviceData = getServiceById(id);
  if (!serviceData) {
    notFound();
  }

  // Convert to display format with MXN cents to pesos
  const service = {
    id: serviceData.id,
    title: locale === 'en' ? serviceData.title_en : serviceData.title_es,
    description: (locale === 'en' ? serviceData.description_en : serviceData.description_es) || (locale === 'en' ? 'Professional service with upfront pricing' : 'Servicio profesional con precios transparentes'),
    price: Math.round(serviceData.fixed_base_price / 100), // Convert cents to pesos
    duration: `${Math.round(serviceData.fixed_duration_minutes / 60)} hours`,
    rating: 4.8,
    reviewCount: 127,
    image: getCategoryIcon(serviceData.category_slug),
    features: getServiceFeatures(serviceData.category_slug, t),
    whatIncluded: t('service.included') as string[],
    addons: serviceData.addons.map(addon => ({
      id: addon.id,
      name: locale === 'en' ? addon.name_en : addon.name_es,
      price: Math.round(addon.price_delta / 100), // Convert cents to pesos
      description: (locale === 'en' ? addon.description_en : addon.description_es) || ''
    }))
  };

  function getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'cleaning': '🧹',
      'plumbing': '🔧',
      'electrical': '⚡',
      'handyman': '🔨',
      'painting': '🎨',
      'courier': '🚚',
      'pest-control': '🐜'
    };
    return icons[category] || '🔧';
  }

  function getServiceFeatures(category: string, t: (key: string) => any): string[] {
    const key = `service.features.${category}`;
    const features = t(key);
    if (Array.isArray(features)) {
      return features;
    }
    return t('service.features.default') as string[];
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-gray-700">{t('nav.home')}</Link>
            <span>/</span>
            <Link href="/category/cleaning" className="hover:text-gray-700">{t('nav.cleaning')}</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{service.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Service Header */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{service.title}</h1>
                  <p className="text-gray-600 text-lg">{service.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-gray-900">{formatCurrency(service.price)}</div>
                  <div className="text-gray-500">{service.duration}</div>
                </div>
              </div>
              
              {/* Rating */}
              <div className="flex items-center mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(service.rating) 
                          ? 'text-yellow-400' 
                          : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-3 text-gray-600">
                  {service.rating} ({service.reviewCount} {t('service.reviews')})
                </span>
              </div>
              
              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* What's Included */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('service.whats-included')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.whatIncluded.map((item, index) => (
                  <div key={index} className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Add-ons */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('service.available-addons')}</h2>
              <div className="space-y-4">
                {service.addons.map((addon) => (
                  <div key={addon.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{addon.name}</h3>
                      <p className="text-sm text-gray-600">{addon.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">+{formatCurrency(addon.price)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Configurator */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Configurator service={service} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServicePage({ params }: PageProps) {
  return (
    <SearchParamsWrapper>
      <ServicePageContent params={params} />
    </SearchParamsWrapper>
  );
}