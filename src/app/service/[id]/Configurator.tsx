'use client';

import { useState } from 'react';
import { useLocale } from '@/contexts/LocaleContext';

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
}

export default function Configurator({ service }: ConfiguratorProps) {
  const { formatCurrency, t } = useLocale();
  const [selectedAddons, setSelectedAddons] = useState<{ [key: string]: number }>({});
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

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
    const addonParams = Object.entries(selectedAddons)
      .map(([id, qty]) => `${id}=${qty}`)
      .join('&');
    
    const checkoutUrl = `/checkout/${service.id}?${addonParams}&date=${selectedDate}&time=${selectedTime}`;
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
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
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
