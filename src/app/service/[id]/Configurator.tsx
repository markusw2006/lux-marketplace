'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale } from '@/contexts/LocaleContext';
import { professionals } from '@/data/seed/pros';

interface Addon {
  id: string;
  name: string;
  price: number;
  description: string;
}

interface Service {
  id: string;
  title: string;
  price: number;
  duration: string;
  addons: Addon[];
}

interface ConfiguratorProps {
  service: Service;
  prefilledPro?: string; // Professional ID if coming from pros page
}

export default function Configurator({ service, prefilledPro }: ConfiguratorProps) {
  const { formatCurrency, t } = useLocale();
  const searchParams = useSearchParams();
  const [selectedAddons, setSelectedAddons] = useState<{ [key: string]: number }>({});
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedPro, setSelectedPro] = useState<string>(prefilledPro || '');
  
  // Get professional info
  const professional = selectedPro ? professionals.find(p => p.id === selectedPro) : null;
  
  // Service-specific filter states
  const [bedrooms, setBedrooms] = useState<number | undefined>();
  const [bathrooms, setBathrooms] = useState<number | undefined>();
  const [cleaningType, setCleaningType] = useState<string>('');
  const [propertyType, setPropertyType] = useState<string>('');
  const [urgency, setUrgency] = useState<string>('');
  const [propertySize, setPropertySize] = useState<string>('');
  
  // Load pre-filled values from URL parameters
  useEffect(() => {
    if (!searchParams) return;
    
    try {
      const pro = searchParams.get('pro');
      const date = searchParams.get('date');
      const time = searchParams.get('time');
      const bedroomsParam = searchParams.get('bedrooms');
      const bathroomsParam = searchParams.get('bathrooms');
      const cleaningTypeParam = searchParams.get('cleaning_type');
      const propertyTypeParam = searchParams.get('property_type');
      const urgencyParam = searchParams.get('urgency');
      const propertySizeParam = searchParams.get('property_size');
    
    if (pro) setSelectedPro(pro);
    if (date) setSelectedDate(date);
    if (time) {
      // Map time preference to time slot
      const timeMap: { [key: string]: string } = {
        'morning': '9:00 AM - 11:00 AM',
        'afternoon': '1:00 PM - 3:00 PM',
        'evening': '5:00 PM - 7:00 PM'
      };
      setSelectedTime(timeMap[time] || time);
    }
      if (bedroomsParam) setBedrooms(parseInt(bedroomsParam));
      if (bathroomsParam) setBathrooms(parseInt(bathroomsParam));
      if (cleaningTypeParam) setCleaningType(cleaningTypeParam);
      if (propertyTypeParam) setPropertyType(propertyTypeParam);
      if (urgencyParam) setUrgency(urgencyParam);
      if (propertySizeParam) setPropertySize(propertySizeParam);
    } catch (error) {
      console.error('Error loading URL parameters:', error);
    }
  }, [searchParams]);

  // Calculate total price
  const basePrice = service.price;
  const addonTotal = Object.entries(selectedAddons).reduce((total, [addonId, quantity]) => {
    const addon = service.addons.find(a => a.id === addonId);
    return total + (addon ? addon.price * quantity : 0);
  }, 0);
  const totalPrice = basePrice + addonTotal;

  // Available time slots
  const timeSlots = [
    '9:00 AM - 11:00 AM',
    '11:00 AM - 1:00 PM',
    '1:00 PM - 3:00 PM',
    '3:00 PM - 5:00 PM',
    '5:00 PM - 7:00 PM'
  ];

  // Get tomorrow's date for min date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const handleAddonChange = (addonId: string, quantity: number) => {
    if (quantity === 0) {
      const newSelected = { ...selectedAddons };
      delete newSelected[addonId];
      setSelectedAddons(newSelected);
    } else {
      setSelectedAddons(prev => ({ ...prev, [addonId]: quantity }));
    }
  };

  const handleBooking = () => {
    // In a real app, this would navigate to checkout with selected options
    const params = new URLSearchParams();
    
    // Add addons
    Object.entries(selectedAddons).forEach(([id, qty]) => {
      params.set(id, qty.toString());
    });
    
    // Add booking details
    if (selectedDate) params.set('date', selectedDate);
    if (selectedTime) params.set('time', selectedTime);
    if (selectedPro) params.set('pro', selectedPro);
    
    // Add service-specific parameters
    if (bedrooms) params.set('bedrooms', bedrooms.toString());
    if (bathrooms) params.set('bathrooms', bathrooms.toString());
    if (cleaningType) params.set('cleaning_type', cleaningType);
    if (propertyType) params.set('property_type', propertyType);
    if (urgency) params.set('urgency', urgency);
    if (propertySize) params.set('property_size', propertySize);
    
    const checkoutUrl = `/checkout/${service.id}?${params.toString()}`;
    window.location.href = checkoutUrl;
  };

  const isFormValid = selectedDate && selectedTime;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('configurator.book-this-service')}</h2>
        <p className="text-sm text-gray-600">{t('configurator.select-options')}</p>
      </div>

      {/* Base Service */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium text-gray-900">{service.title}</h3>
            <p className="text-sm text-gray-600">{service.duration}</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-900">{formatCurrency(service.price)}</div>
          </div>
        </div>
      </div>

      {/* Pre-filled Filters (if coming from pros page) */}
      {(bedrooms || bathrooms || cleaningType || propertyType || urgency || propertySize) && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-3">Your Selections</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {bedrooms && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-800">
                {bedrooms} bedroom{bedrooms > 1 ? 's' : ''}
              </span>
            )}
            {bathrooms && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-800">
                {bathrooms} bathroom{bathrooms > 1 ? 's' : ''}
              </span>
            )}
            {cleaningType && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-800">
                {cleaningType.replace('-', ' ')} cleaning
              </span>
            )}
            {propertyType && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-800">
                {propertyType}
              </span>
            )}
            {urgency && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-800">
                {urgency} service
              </span>
            )}
            {propertySize && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-800">
                {propertySize} property
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">These selections from your search are included in the service configuration.</p>
        </div>
      )}

      {/* Selected Professional (if coming from pros page) */}
      {professional && (
        <div className="mb-6 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-700">
              Booking with {professional.businessName}
            </span>
          </div>
        </div>
      )}

      {/* Add-ons */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-3">{t('configurator.addons')}</h3>
        <div className="space-y-3">
          {service.addons.map((addon) => (
            <div key={addon.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{addon.name}</h4>
                <p className="text-xs text-gray-600">{addon.description}</p>
                <div className="text-sm font-medium text-gray-900">+{formatCurrency(addon.price)}</div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleAddonChange(addon.id, Math.max(0, (selectedAddons[addon.id] || 0) - 1))}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  -
                </button>
                <span className="w-8 text-center text-gray-900 font-medium">
                  {selectedAddons[addon.id] || 0}
                </span>
                <button
                  onClick={() => handleAddonChange(addon.id, (selectedAddons[addon.id] || 0) + 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Date Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          {t('configurator.preferred-date')}
        </label>
        <input
          type="date"
          min={minDate}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
        />
      </div>

      {/* Time Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          {t('configurator.preferred-time')}
        </label>
        <div className="grid grid-cols-1 gap-2">
          {timeSlots.map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`p-3 text-left rounded-lg border transition-colors ${
                selectedTime === time
                  ? 'border-gray-900 bg-gray-100 text-gray-900'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{t('configurator.base-service')}:</span>
            <span className="text-gray-900">{formatCurrency(basePrice)}</span>
          </div>
          {Object.entries(selectedAddons).map(([addonId, quantity]) => {
            const addon = service.addons.find(a => a.id === addonId);
            if (!addon || quantity === 0) return null;
            return (
              <div key={addonId} className="flex justify-between text-sm">
                <span className="text-gray-600">{addon.name} (x{quantity}):</span>
                <span className="text-gray-900">+{formatCurrency(addon.price * quantity)}</span>
              </div>
            );
          })}
          <div className="border-t border-gray-300 pt-2 flex justify-between font-semibold">
            <span className="text-gray-600">{t('booking.total')}:</span>
            <span className="text-gray-900">{formatCurrency(totalPrice)}</span>
          </div>
        </div>
      </div>

      {/* Booking Button */}
      <button
        onClick={handleBooking}
        disabled={!isFormValid}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
          isFormValid
            ? 'bg-gray-900 text-white hover:bg-gray-800'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
{isFormValid ? `${t('service.book')} - ${formatCurrency(totalPrice)}` : t('configurator.select-date-time')}
      </button>

      {/* Trust Indicators */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center">
            <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
{t('configurator.trust-verified')}
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
{t('configurator.trust-instant')}
          </div>
        </div>
      </div>
    </div>
  );
}
