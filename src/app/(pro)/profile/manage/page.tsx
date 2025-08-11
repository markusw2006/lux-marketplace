'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ProfileData {
  id: string;
  businessName: string;
  tagline: string;
  bio: string;
  profilePhotoUrl?: string;
  experienceYears: number;
  licenseNumber?: string;
  serviceAreas: string[];
  serviceRadius: number;
  baseLocation: {
    address: string;
    alcaldia: string;
  };
  hourlyRate: number;
  minimumJobFee: number;
  availabilitySchedule: {
    [key: string]: {
      available: boolean;
      start: string;
      end: string;
    };
  };
  taxId: string;
  profileStatus: 'incomplete' | 'pending_review' | 'active' | 'suspended';
  verified: boolean;
  totalJobs: number;
  rating: number;
  reviewCount: number;
}

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

const ALCALDIAS = [
  'Álvaro Obregón', 'Azcapotzalco', 'Benito Juárez', 'Coyoacán',
  'Cuajimalpa', 'Cuauhtémoc', 'Gustavo A. Madero', 'Iztacalco',
  'Iztapalapa', 'Magdalena Contreras', 'Miguel Hidalgo', 'Milpa Alta',
  'Tláhuac', 'Tlalpan', 'Venustiano Carranza', 'Xochimilco'
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

export default function ManageProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<'basic' | 'services' | 'location' | 'pricing' | 'availability'>('basic');

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockProfile: ProfileData = {
      id: 'pro-1',
      businessName: 'Plomería García',
      tagline: 'Plomero experto - 15+ años de experiencia en CDMX',
      bio: 'Soy un plomero profesional con más de 15 años de experiencia en la Ciudad de México. Me especializo en reparaciones residenciales, instalaciones sanitarias y mantenimiento preventivo.',
      profilePhotoUrl: '/art/dd5cc185-4a97-4d5e-9186-3a34b9866e4b.png',
      experienceYears: 15,
      licenseNumber: 'PL-CDMX-2024-001',
      serviceAreas: ['plumbing', 'handyman'],
      serviceRadius: 25,
      baseLocation: {
        address: 'Roma Norte, CDMX',
        alcaldia: 'Cuauhtémoc'
      },
      hourlyRate: 350,
      minimumJobFee: 250,
      availabilitySchedule: {
        monday: { available: true, start: '08:00', end: '18:00' },
        tuesday: { available: true, start: '08:00', end: '18:00' },
        wednesday: { available: true, start: '08:00', end: '18:00' },
        thursday: { available: true, start: '08:00', end: '18:00' },
        friday: { available: true, start: '08:00', end: '18:00' },
        saturday: { available: true, start: '09:00', end: '15:00' },
        sunday: { available: false, start: '09:00', end: '15:00' }
      },
      taxId: 'GAHR850315ABC',
      profileStatus: 'active',
      verified: true,
      totalJobs: 147,
      rating: 4.8,
      reviewCount: 89
    };

    setProfile(mockProfile);
    setLoading(false);
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    
    setSaving(true);
    try {
      // In real app, save to API
      console.log('Saving profile:', profile);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      alert('Perfil actualizado exitosamente');
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Error al guardar el perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: any) => {
    setProfile(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleNestedInputChange = (parent: keyof ProfileData, field: string, value: any) => {
    setProfile(prev => prev ? {
      ...prev,
      [parent]: {
        ...(prev[parent] as any),
        [field]: value
      }
    } : null);
  };

  const handleServiceAreaToggle = (categorySlug: string) => {
    if (!profile) return;
    
    const newServiceAreas = profile.serviceAreas.includes(categorySlug)
      ? profile.serviceAreas.filter(slug => slug !== categorySlug)
      : [...profile.serviceAreas, categorySlug];
    
    handleInputChange('serviceAreas', newServiceAreas);
  };

  const handleAvailabilityChange = (day: string, field: 'available' | 'start' | 'end', value: boolean | string) => {
    if (!profile) return;
    
    setProfile(prev => prev ? {
      ...prev,
      availabilitySchedule: {
        ...prev.availabilitySchedule,
        [day]: {
          ...prev.availabilitySchedule[day],
          [field]: value
        }
      }
    } : null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Perfil no encontrado</h2>
          <Link href="/profile/setup" className="mt-4 inline-block text-blue-600 hover:underline">
            Configurar perfil
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending_review': return 'bg-yellow-100 text-yellow-800';
      case 'incomplete': return 'bg-red-100 text-red-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'pending_review': return 'Pendiente revisión';
      case 'incomplete': return 'Incompleto';
      case 'suspended': return 'Suspendido';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <nav className="flex mb-4" aria-label="Breadcrumb">
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
                    <span className="ml-4 text-sm font-medium text-gray-900">Gestionar Perfil</span>
                  </div>
                </li>
              </ol>
            </nav>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestionar Perfil Profesional</h1>
                <p className="mt-1 text-sm text-gray-500">Actualiza tu información y configuración</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(profile.profileStatus)}`}>
                  {getStatusText(profile.profileStatus)}
                </span>
                
                <Link
                  href={`/professional/${profile.id}`}
                  target="_blank"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="space-y-1">
              {[
                { key: 'basic', label: 'Información Básica', icon: '👤' },
                { key: 'services', label: 'Servicios', icon: '🔧' },
                { key: 'location', label: 'Ubicación', icon: '📍' },
                { key: 'pricing', label: 'Precios', icon: '💰' },
                { key: 'availability', label: 'Disponibilidad', icon: '📅' }
              ].map(section => (
                <button
                  key={section.key}
                  onClick={() => setActiveSection(section.key as any)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeSection === section.key
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-3">{section.icon}</span>
                  {section.label}
                </button>
              ))}
            </nav>

            {/* Profile Stats */}
            <div className="mt-8 bg-white rounded-lg shadow p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Estadísticas del Perfil</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Trabajos:</span>
                  <span className="font-medium">{profile.totalJobs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Calificación:</span>
                  <span className="font-medium">{profile.rating} ⭐</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Reseñas:</span>
                  <span className="font-medium">{profile.reviewCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                {activeSection === 'basic' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-medium text-gray-900">Información Básica</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre del Negocio
                        </label>
                        <input
                          type="text"
                          value={profile.businessName}
                          onChange={(e) => handleInputChange('businessName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Años de Experiencia
                        </label>
                        <select
                          value={profile.experienceYears}
                          onChange={(e) => handleInputChange('experienceYears', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          {Array.from({ length: 30 }, (_, i) => i + 1).map(year => (
                            <option key={year} value={year}>{year} año{year > 1 ? 's' : ''}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción Corta (Tagline)
                      </label>
                      <input
                        type="text"
                        value={profile.tagline}
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
                        value={profile.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Cuéntanos sobre tu experiencia, especialidades y por qué los clientes deberían elegirte..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número de Licencia (Opcional)
                      </label>
                      <input
                        type="text"
                        value={profile.licenseNumber || ''}
                        onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Número de licencia profesional"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        RFC
                      </label>
                      <input
                        type="text"
                        value={profile.taxId}
                        onChange={(e) => handleInputChange('taxId', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="RFC para facturación"
                      />
                    </div>
                  </div>
                )}

                {activeSection === 'services' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-medium text-gray-900">Servicios que Ofreces</h2>
                    <p className="text-sm text-gray-600">
                      Selecciona todas las categorías de servicios que ofreces
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {SERVICE_CATEGORIES.map(category => (
                        <label
                          key={category.slug}
                          className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                            profile.serviceAreas.includes(category.slug)
                              ? 'bg-blue-50 border-blue-200'
                              : 'bg-white border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={profile.serviceAreas.includes(category.slug)}
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
                )}

                {activeSection === 'location' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-medium text-gray-900">Ubicación y Cobertura</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dirección Base
                        </label>
                        <input
                          type="text"
                          value={profile.baseLocation.address}
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
                          value={profile.baseLocation.alcaldia}
                          onChange={(e) => handleNestedInputChange('baseLocation', 'alcaldia', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Selecciona alcaldía</option>
                          {ALCALDIAS.map(alcaldia => (
                            <option key={alcaldia} value={alcaldia}>{alcaldia}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Radio de Cobertura: {profile.serviceRadius} km
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="50"
                        step="5"
                        value={profile.serviceRadius}
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
                )}

                {activeSection === 'pricing' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-medium text-gray-900">Precios y Tarifas</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tarifa por Hora (MXN)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            value={profile.hourlyRate}
                            onChange={(e) => handleInputChange('hourlyRate', parseInt(e.target.value))}
                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="350"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Tarifa base por hora de trabajo
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
                            value={profile.minimumJobFee}
                            onChange={(e) => handleInputChange('minimumJobFee', parseInt(e.target.value))}
                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="250"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Precio mínimo que cobras por cualquier trabajo
                        </p>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">Información sobre Comisiones</h4>
                      <p className="text-sm text-blue-800">
                        Lux cobra una comisión del 15% sobre el precio final que recibes. 
                        Los precios que configures aquí son lo que tú recibes después de la comisión.
                      </p>
                    </div>
                  </div>
                )}

                {activeSection === 'availability' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-medium text-gray-900">Horarios de Disponibilidad</h2>
                    
                    <div className="space-y-3">
                      {WEEKDAYS.map(day => (
                        <div key={day.key} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                          <div className="w-24">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={profile.availabilitySchedule[day.key]?.available}
                                onChange={(e) => handleAvailabilityChange(day.key, 'available', e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="ml-2 text-sm font-medium text-gray-700">{day.label}</span>
                            </label>
                          </div>
                          
                          {profile.availabilitySchedule[day.key]?.available && (
                            <div className="flex items-center space-x-2">
                              <input
                                type="time"
                                value={profile.availabilitySchedule[day.key]?.start}
                                onChange={(e) => handleAvailabilityChange(day.key, 'start', e.target.value)}
                                className="px-2 py-1 border border-gray-300 rounded text-sm"
                              />
                              <span className="text-sm text-gray-500">a</span>
                              <input
                                type="time"
                                value={profile.availabilitySchedule[day.key]?.end}
                                onChange={(e) => handleAvailabilityChange(day.key, 'end', e.target.value)}
                                className="px-2 py-1 border border-gray-300 rounded text-sm"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="bg-yellow-50 rounded-lg p-4">
                      <h4 className="font-medium text-yellow-800 mb-2">Disponibilidad de Emergencia</h4>
                      <p className="text-sm text-yellow-700">
                        Puedes aceptar trabajos fuera de tu horario regular marcándolos como "emergencia". 
                        Esto te permite cobrar tarifas premium por servicios urgentes.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Última actualización: {new Date().toLocaleDateString('es-MX')}
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Link
                      href="/dashboard"
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancelar
                    </Link>
                    
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}