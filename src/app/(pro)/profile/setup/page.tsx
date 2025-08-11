'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ProfileSetupData {
  // Basic Info
  businessName: string;
  bio: string;
  tagline: string;
  profilePhoto?: File;
  
  // Professional Details
  experienceYears: number;
  licenseNumber: string;
  
  // Service Areas
  serviceAreas: string[];
  serviceRadius: number;
  baseLocation: {
    address: string;
    alcaldia: string;
    lat?: number;
    lng?: number;
  };
  
  // Pricing
  hourlyRate: number;
  minimumJobFee: number;
  
  // Availability
  availabilitySchedule: {
    [key: string]: {
      available: boolean;
      start: string;
      end: string;
    };
  };
  
  // Business Info
  taxId: string;
}

const ALCALDIAS = [
  'Álvaro Obregón', 'Azcapotzalco', 'Benito Juárez', 'Coyoacán',
  'Cuajimalpa', 'Cuauhtémoc', 'Gustavo A. Madero', 'Iztacalco',
  'Iztapalapa', 'Magdalena Contreras', 'Miguel Hidalgo', 'Milpa Alta',
  'Tláhuac', 'Tlalpan', 'Venustiano Carranza', 'Xochimilco'
];

const SERVICE_CATEGORIES = [
  { slug: 'cleaning', name: 'Limpieza' },
  { slug: 'plumbing', name: 'Plomería' },
  { slug: 'electrical', name: 'Eléctrico' },
  { slug: 'handyman', name: 'Reparaciones Generales' },
  { slug: 'painting', name: 'Pintura' },
  { slug: 'gardening', name: 'Jardinería' },
  { slug: 'appliance', name: 'Electrodomésticos' },
  { slug: 'security', name: 'Seguridad' }
];

const WEEKDAYS = [
  { key: 'monday', label: 'Lunes' },
  { key: 'tuesday', label: 'Martes' },
  { key: 'wednesday', label: 'Miércoles' },
  { key: 'thursday', label: 'Jueves' },
  { key: 'friday', label: 'Viernes' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' }
];

export default function ProfileSetupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileSetupData>({
    businessName: '',
    bio: '',
    tagline: '',
    experienceYears: 1,
    licenseNumber: '',
    serviceAreas: [],
    serviceRadius: 20,
    baseLocation: {
      address: '',
      alcaldia: ''
    },
    hourlyRate: 250,
    minimumJobFee: 150,
    availabilitySchedule: {
      monday: { available: true, start: '09:00', end: '18:00' },
      tuesday: { available: true, start: '09:00', end: '18:00' },
      wednesday: { available: true, start: '09:00', end: '18:00' },
      thursday: { available: true, start: '09:00', end: '18:00' },
      friday: { available: true, start: '09:00', end: '18:00' },
      saturday: { available: false, start: '09:00', end: '18:00' },
      sunday: { available: false, start: '09:00', end: '18:00' }
    },
    taxId: ''
  });

  const totalSteps = 5;

  const handleInputChange = (field: keyof ProfileSetupData, value: any) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedInputChange = (parent: keyof ProfileSetupData, field: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as any),
        [field]: value
      }
    }));
  };

  const handleServiceAreaToggle = (categorySlug: string) => {
    setProfileData(prev => ({
      ...prev,
      serviceAreas: prev.serviceAreas.includes(categorySlug)
        ? prev.serviceAreas.filter(slug => slug !== categorySlug)
        : [...prev.serviceAreas, categorySlug]
    }));
  };

  const handleAvailabilityChange = (day: string, field: 'available' | 'start' | 'end', value: boolean | string) => {
    setProfileData(prev => ({
      ...prev,
      availabilitySchedule: {
        ...prev.availabilitySchedule,
        [day]: {
          ...prev.availabilitySchedule[day],
          [field]: value
        }
      }
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Here we would submit to API
      console.log('Profile setup data:', profileData);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to dashboard
      router.push('/dashboard?setup=complete');
    } catch (error) {
      console.error('Failed to complete profile setup:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Información Básica</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Negocio
                  </label>
                  <input
                    type="text"
                    value={profileData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej. Plomería García"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción Corta (Tagline)
                  </label>
                  <input
                    type="text"
                    value={profileData.tagline}
                    onChange={(e) => handleInputChange('tagline', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej. Plomero experto - 15+ años de experiencia"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Biografía Profesional
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Cuéntanos sobre tu experiencia, especialidades y por qué los clientes deberían elegirte..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Años de Experiencia
                  </label>
                  <select
                    value={profileData.experienceYears}
                    onChange={(e) => handleInputChange('experienceYears', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {Array.from({ length: 30 }, (_, i) => i + 1).map(year => (
                      <option key={year} value={year}>{year} año{year > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Licencia (Opcional)
                  </label>
                  <input
                    type="text"
                    value={profileData.licenseNumber}
                    onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Número de licencia profesional"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Servicios que Ofreces</h3>
              <p className="text-sm text-gray-600 mb-4">
                Selecciona todas las categorías de servicios que ofreces
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {SERVICE_CATEGORIES.map(category => (
                  <label
                    key={category.slug}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      profileData.serviceAreas.includes(category.slug)
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={profileData.serviceAreas.includes(category.slug)}
                      onChange={() => handleServiceAreaToggle(category.slug)}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium text-gray-900">
                      {category.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Ubicación y Cobertura</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección Base
                  </label>
                  <input
                    type="text"
                    value={profileData.baseLocation.address}
                    onChange={(e) => handleNestedInputChange('baseLocation', 'address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Dirección desde donde operas"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alcaldía
                  </label>
                  <select
                    value={profileData.baseLocation.alcaldia}
                    onChange={(e) => handleNestedInputChange('baseLocation', 'alcaldia', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Selecciona alcaldía</option>
                    {ALCALDIAS.map(alcaldia => (
                      <option key={alcaldia} value={alcaldia}>{alcaldia}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Radio de Cobertura: {profileData.serviceRadius} km
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="5"
                    value={profileData.serviceRadius}
                    onChange={(e) => handleInputChange('serviceRadius', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>5 km</span>
                    <span>25 km</span>
                    <span>50 km</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Precios y Tarifas</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tarifa por Hora (MXN)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={profileData.hourlyRate}
                      onChange={(e) => handleInputChange('hourlyRate', parseInt(e.target.value))}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="250"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Tarifa base por hora de trabajo. Los clientes verán el precio final incluyendo la comisión de la plataforma.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio Mínimo por Trabajo (MXN)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={profileData.minimumJobFee}
                      onChange={(e) => handleInputChange('minimumJobFee', parseInt(e.target.value))}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="150"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Precio mínimo que cobras por cualquier trabajo, sin importar la duración.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Horarios de Disponibilidad</h3>
              
              <div className="space-y-3">
                {WEEKDAYS.map(day => (
                  <div key={day.key} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                    <div className="w-20">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={profileData.availabilitySchedule[day.key]?.available}
                          onChange={(e) => handleAvailabilityChange(day.key, 'available', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700">{day.label}</span>
                      </label>
                    </div>
                    
                    {profileData.availabilitySchedule[day.key]?.available && (
                      <div className="flex items-center space-x-2">
                        <input
                          type="time"
                          value={profileData.availabilitySchedule[day.key]?.start}
                          onChange={(e) => handleAvailabilityChange(day.key, 'start', e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <span className="text-sm text-gray-500">a</span>
                        <input
                          type="time"
                          value={profileData.availabilitySchedule[day.key]?.end}
                          onChange={(e) => handleAvailabilityChange(day.key, 'end', e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  RFC (Opcional)
                </label>
                <input
                  type="text"
                  value={profileData.taxId}
                  onChange={(e) => handleInputChange('taxId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="RFC para facturación"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Necesario si planeas emitir facturas fiscales
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-4">
                <li>
                  <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-4 text-sm font-medium text-gray-900">Configurar Perfil</span>
                  </div>
                </li>
              </ol>
            </nav>
            <h1 className="mt-2 text-2xl font-bold text-gray-900">Configuración del Perfil Profesional</h1>
            <p className="mt-1 text-sm text-gray-500">Completa tu perfil para comenzar a recibir trabajos</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Paso {currentStep} de {totalSteps}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((currentStep / totalSteps) * 100)}% completado
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow p-6">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>

          {currentStep < totalSteps ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Siguiente
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Completando...' : 'Completar Perfil'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}