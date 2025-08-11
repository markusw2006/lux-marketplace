'use client';

import { useState } from 'react';
import { useLocale } from '@/contexts/LocaleContext';

interface FilterSidebarProps {
  serviceId: string;
  onFiltersChange: (filters: Record<string, any>) => void;
  totalPros: number;
}

interface FilterState {
  // Common filters
  date: string;
  timePreference: 'morning' | 'afternoon' | 'evening' | '';
  availability: 'same-day' | 'next-day' | 'weekend' | '';
  maxPrice: number;
  minRating: number;
  verified: boolean;
  
  // Service-specific filters
  bedrooms?: number;
  bathrooms?: number;
  cleaningType?: 'basic' | 'deep' | 'move-in-out' | '';
  propertySize?: 'small' | 'medium' | 'large' | '';
  urgency?: 'emergency' | 'scheduled' | '';
  propertyType?: 'apartment' | 'house' | 'office' | '';
}

const initialFilters: FilterState = {
  date: '',
  timePreference: '',
  availability: '',
  maxPrice: 500,
  minRating: 4.0,
  verified: false
};

export default function FilterSidebar({ serviceId, onFiltersChange, totalPros }: FilterSidebarProps) {
  const { formatCurrency } = useLocale();
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [estimatedPrice, setEstimatedPrice] = useState({ min: 80, max: 250 });

  // Get tomorrow's date for min date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
    
    // Update price estimate based on filters
    updatePriceEstimate(newFilters);
  };

  const updatePriceEstimate = (currentFilters: FilterState): void => {
    let baseMin = 80;
    let baseMax = 250;

    // Service-specific pricing
    if (serviceId === 'basic-cleaning') {
      baseMin = 90;
      baseMax = 180;
      
      // Adjust for bedrooms
      if (currentFilters.bedrooms) {
        const multiplier = currentFilters.bedrooms > 2 ? 1.5 : 1;
        baseMin *= multiplier;
        baseMax *= multiplier;
      }
      
      // Adjust for cleaning type
      if (currentFilters.cleaningType === 'deep') {
        baseMin *= 1.8;
        baseMax *= 2.2;
      } else if (currentFilters.cleaningType === 'move-in-out') {
        baseMin *= 2.0;
        baseMax *= 2.5;
      }
      
      // Adjust for bathrooms
      if (currentFilters.bathrooms && currentFilters.bathrooms > 2) {
        baseMin += 50;
        baseMax += 80;
      }
    } else if (serviceId.includes('plumbing')) {
      baseMin = 100;
      baseMax = 300;
      
      // Emergency pricing
      if (currentFilters.urgency === 'emergency') {
        baseMin *= 1.5;
        baseMax *= 1.8;
      }
    } else if (serviceId.includes('electrical')) {
      baseMin = 110;
      baseMax = 280;
    }

    // Same day premium
    if (currentFilters.availability === 'same-day') {
      baseMin *= 1.2;
      baseMax *= 1.3;
    }

    // Weekend premium
    if (currentFilters.availability === 'weekend') {
      baseMin *= 1.1;
      baseMax *= 1.2;
    }

    setEstimatedPrice({ 
      min: Math.round(baseMin), 
      max: Math.round(baseMax) 
    });
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    onFiltersChange(initialFilters);
    updatePriceEstimate(initialFilters);
  };

  const getServiceSpecificFilters = () => {
    switch (serviceId) {
      case 'basic-cleaning':
      case 'fridge-cleaning':
        return (
          <>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map(num => (
                  <button
                    key={num}
                    onClick={() => updateFilter('bedrooms', filters.bedrooms === num ? undefined : num)}
                    className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                      filters.bedrooms === num
                        ? 'border-gray-900 bg-gray-100 text-gray-900'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Bathrooms</label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map(num => (
                  <button
                    key={num}
                    onClick={() => updateFilter('bathrooms', filters.bathrooms === num ? undefined : num)}
                    className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                      filters.bathrooms === num
                        ? 'border-gray-900 bg-gray-100 text-gray-900'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {num}+
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Cleaning Type</label>
              <select
                value={filters.cleaningType || ''}
                onChange={(e) => updateFilter('cleaningType', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              >
                <option value="">Any type</option>
                <option value="basic">Basic cleaning</option>
                <option value="deep">Deep cleaning</option>
                <option value="move-in-out">Move-in/out</option>
              </select>
            </div>
          </>
        );

      case 'faucet-replacement':
      case 'drain-unclog':
        return (
          <>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Property Type</label>
              <select
                value={filters.propertyType || ''}
                onChange={(e) => updateFilter('propertyType', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              >
                <option value="">Any property</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="office">Office</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Service Urgency</label>
              <div className="space-y-2">
                {[
                  { value: 'emergency', label: 'Emergency (Same day)' },
                  { value: 'scheduled', label: 'Scheduled' }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => updateFilter('urgency', filters.urgency === option.value ? '' : option.value)}
                    className={`w-full px-3 py-2 text-left text-sm rounded-lg border transition-colors ${
                      filters.urgency === option.value
                        ? 'border-gray-900 bg-gray-100 text-gray-900'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        );

      case 'light-fixture':
        return (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Property Size</label>
            <select
              value={filters.propertySize || ''}
              onChange={(e) => updateFilter('propertySize', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Any size</option>
              <option value="small">Small (1-2 rooms)</option>
              <option value="medium">Medium (3-4 rooms)</option>
              <option value="large">Large (5+ rooms)</option>
            </select>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 sticky top-4">
      {/* Price Estimate */}
      <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Estimated Price</h3>
        <div className="text-2xl font-bold text-gray-900">
          {formatCurrency(estimatedPrice.min)} - {formatCurrency(estimatedPrice.max)}
        </div>
        <p className="text-xs text-gray-600 mt-1">
          Based on your filters • Final price may vary
        </p>
      </div>

      <div className="p-4 space-y-6">
        {/* Date Filter */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Preferred Date</label>
          <input
            type="date"
            min={minDate}
            value={filters.date}
            onChange={(e) => updateFilter('date', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Time Preference */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Time Preference</label>
          <select
            value={filters.timePreference}
            onChange={(e) => updateFilter('timePreference', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Any time</option>
            <option value="morning">Morning (8AM-12PM)</option>
            <option value="afternoon">Afternoon (12PM-5PM)</option>
            <option value="evening">Evening (5PM-8PM)</option>
          </select>
        </div>

        {/* Availability Filter */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Availability</label>
          <div className="space-y-2">
            {[
              { value: 'same-day', label: 'Same day' },
              { value: 'next-day', label: 'Next day' },
              { value: 'weekend', label: 'Weekend' }
            ].map(option => (
              <button
                key={option.value}
                onClick={() => updateFilter('availability', filters.availability === option.value ? '' : option.value)}
                className={`w-full px-3 py-2 text-left text-sm rounded-lg border transition-colors ${
                  filters.availability === option.value
                    ? 'border-gray-900 bg-gray-100 text-gray-900'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Service-specific filters */}
        {getServiceSpecificFilters()}

        {/* Price Range */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Max Budget: {formatCurrency(filters.maxPrice)}
          </label>
          <input
            type="range"
            min="50"
            max="1000"
            step="25"
            value={filters.maxPrice}
            onChange={(e) => updateFilter('maxPrice', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>$50</span>
            <span>$1000+</span>
          </div>
        </div>

        {/* Rating Filter */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Minimum Rating: {filters.minRating}★
          </label>
          <input
            type="range"
            min="3.0"
            max="5.0"
            step="0.1"
            value={filters.minRating}
            onChange={(e) => updateFilter('minRating', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>3.0★</span>
            <span>5.0★</span>
          </div>
        </div>

        {/* Verified Only */}
        <div className="flex items-center">
          <input
            id="verified"
            type="checkbox"
            checked={filters.verified}
            onChange={(e) => updateFilter('verified', e.target.checked)}
            className="h-4 w-4 text-gray-900 focus:ring-gray-500 border-gray-300 rounded"
          />
          <label htmlFor="verified" className="ml-2 text-sm text-gray-700">
            Verified professionals only
          </label>
        </div>

        {/* Clear Filters */}
        <button
          onClick={clearFilters}
          className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Clear all filters
        </button>
      </div>

      {/* Results Count */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
        <p className="text-sm text-gray-600 text-center">
          {totalPros} professionals available
        </p>
      </div>
    </div>
  );
}