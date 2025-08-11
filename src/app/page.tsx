'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { services } from '@/data/seed/services';
import { useLocale } from '@/contexts/LocaleContext';
import SearchPopup from '@/components/SearchPopup';

export default function HomePage() {
  const router = useRouter();
  const { t, formatCurrency, currency } = useLocale();
  const [searchQuery, setSearchQuery] = useState('');
  const [zipCode, setZipCode] = useState('06700');
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  
  const valueProps = t('value-props') as string[];

  const [currentProp, setCurrentProp] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProp((prev) => (prev + 1) % valueProps.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [valueProps.length]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    // Navigate directly to provider list - no popup on homepage
    // Find the best matching service and go to its providers page
    const bestMatch = services.find(service => 
      service.title_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category_slug.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (bestMatch) {
      router.push(`/pros/${bestMatch.id}?zip=${zipCode}&q=${encodeURIComponent(searchQuery)}`);
    } else {
      // If no match, show popup on homepage as fallback
      setShowSearchPopup(true);
    }
  };

  const categories = [
    {
      id: 'cleaning',
      name: t('categories.cleaning'),
      description: t('categories.cleaning-desc'),
      icon: '🧹',
      color: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-700',
      services: ['Basic Cleaning', 'Deep Cleaning', 'Move-in/out Cleaning']
    },
    {
      id: 'plumbing',
      name: t('categories.plumbing'),
      description: t('categories.plumbing-desc'),
      icon: '🔧',
      color: 'bg-green-50 border-green-200',
      textColor: 'text-green-700',
      services: ['Faucet Replacement', 'Drain Unclogging', 'Pipe Repairs']
    },
    {
      id: 'electrical',
      name: t('categories.electrical'),
      description: t('categories.electrical-desc'),
      icon: '⚡',
      color: 'bg-yellow-50 border-yellow-200',
      textColor: 'text-yellow-700',
      services: ['Light Installation', 'TV Mounting', 'Electrical Repairs']
    },
    {
      id: 'assembly',
      name: t('categories.handyman'),
      description: t('categories.assembly-desc'),
      icon: '🪑',
      color: 'bg-purple-50 border-purple-200',
      textColor: 'text-purple-700',
      services: ['Furniture Assembly', 'Appliance Setup', 'IKEA Assembly']
    }
  ];

  const cacheBuster = Date.now(); // Force cache refresh
  const trustFeatures = [
    {
      image: `/art/features/1.png?v=${cacheBuster}`,
      title: t('trust.verified-pros'),
      description: t('trust.verified-pros-desc')
    },
    {
      image: `/art/features/2.png?v=${cacheBuster}`,
      title: t('trust.upfront-pricing'),
      description: t('trust.upfront-pricing-desc')
    },
    {
      image: `/art/features/3.png?v=${cacheBuster}`,
      title: t('trust.instant-booking'),
      description: t('trust.instant-booking-desc')
    },
    {
      image: `/art/features/4.png?v=${cacheBuster}`,
      title: t('trust.satisfaction'),
      description: t('trust.satisfaction-desc')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-20 pb-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Text Content */}
              <div className="text-center lg:text-left">
                {/* Main Headline First */}
                <h1 className="text-5xl md:text-6xl font-medium text-gray-900 mb-12 tracking-tight leading-tight">
                  {t('hero.main-title')}
                  <br />
                  <span className="font-light text-gray-600">{t('hero.main-subtitle')}</span>
                </h1>

                {/* Search Bar */}
                <div className="max-w-3xl mx-auto lg:mx-0 mb-8">
                <div className="bg-white border border-gray-300 rounded-2xl p-2 shadow-md hover:shadow-lg transition-shadow">
                  <form onSubmit={handleSearch} className="flex items-center">
                    <div className="flex-1 flex items-center px-6 py-4">
                      <input
                        type="text"
                        placeholder={t('search.placeholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 border-0 focus:outline-none text-lg placeholder-gray-400"
                      />
                    </div>
                    
                    <div className="border-l border-gray-200 px-5 py-4">
                      <div className="flex items-center gap-2 text-gray-500">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <input
                          type="text"
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                          maxLength={5}
                          className="w-12 border-0 focus:outline-none text-center text-gray-700 font-medium text-sm"
                        />
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      className="bg-black hover:bg-gray-800 text-white px-8 py-4 m-1 rounded-xl font-medium transition-colors"
                    >
{t('search.button')}
                    </button>
                  </form>
                </div>
                </div>

                {/* Rotating Value Prop - Now Below Search */}
                <div className="text-base md:text-lg text-gray-500 font-normal tracking-wide h-8 flex items-center justify-center lg:justify-start">
                  <span 
                    key={currentProp}
                    className="inline-block animate-[fadeInUp_0.6s_ease-out_forwards] opacity-0"
                    style={{
                      animationDelay: '0.1s'
                    }}
                  >
                    {valueProps[currentProp]}
                  </span>
                </div>
              </div>

              {/* Right Column - Image */}
              <div className="hidden lg:block">
                <img 
                  src="/514ebc24-73d4-46d8-8a8e-20306ca6adc4.png" 
                  alt={t('images.professional-service')}
                  className="w-full max-w-md mx-auto rounded-2xl shadow-lg"
                  style={{ filter: 'saturate(0.9)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Features */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
            {trustFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full overflow-hidden bg-white">
                  <img 
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-base font-medium text-gray-900 mb-3 tracking-wide">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-14 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-xl font-medium text-gray-600 mb-3 tracking-tight">
              {t('categories.popular-services')}
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-2 gap-5">
            {categories.map((category, index) => {
              // Map categories to specific images
              const imageMap = {
                'cleaning': 'dd5cc185-4a97-4d5e-9186-3a34b9866e4b.png',
                'plumbing': '1d265b78-c436-4b12-96e8-5de8ddacc8b4.png',
                'electrical': '1110a8d6-e3d6-4b8a-a0f4-a914787e6914.png',
                'assembly': '2e8e750e-cfeb-49a5-99f2-15a153efbb0f.png'
              };

              // Map categories to their most popular service for direct provider flow
              const serviceMap = {
                'cleaning': 'basic-cleaning',
                'plumbing': 'faucet-replacement',
                'electrical': 'light-fixture', 
                'assembly': 'furniture-assembly'
              };

              return (
                <Link 
                  key={category.id}
                  href={`/pros/${serviceMap[category.id as keyof typeof serviceMap]}?zip=06700&q=${encodeURIComponent(category.name)}&direct=true`}
                  className="group block overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-300 bg-white hover:shadow-lg rounded-xl"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img 
                      src={`/${imageMap[category.id as keyof typeof imageMap]}`}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      style={{ filter: 'saturate(0.95)' }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-medium text-gray-800 mb-2 group-hover:text-black transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-500 text-xs mb-2 leading-relaxed">{category.description}</p>
                    <div className="flex items-center text-xs text-gray-400 group-hover:text-gray-600 transition-colors">
                      <span>{t('categories.view-services')}</span>
                      <svg className="w-3 h-3 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-medium text-gray-900 tracking-tight">
              {t('how-it-works.title')}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="text-center">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-sm font-medium text-white">1</span>
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-3">{t('how-it-works.step1.title')}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {t('how-it-works.step1.desc')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-sm font-medium text-white">2</span>
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-3">{t('how-it-works.step2.title')}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {t('how-it-works.step2.desc')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-sm font-medium text-white">3</span>
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-3">{t('how-it-works.step3.title')}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {t('how-it-works.step3.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Search Popup */}
      <SearchPopup 
        isOpen={showSearchPopup}
        onClose={() => setShowSearchPopup(false)}
        searchQuery={searchQuery}
        zipCode={zipCode}
      />
    </div>
  );
}
