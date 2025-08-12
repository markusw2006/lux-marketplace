'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminProtection from '@/components/AdminProtection';
import AdminHeader from '@/components/AdminHeader';
import { useLocale } from '@/contexts/LocaleContext';

interface Service {
  id: string;
  title_en: string;
  title_es: string;
  description_en: string;
  description_es: string;
  fixed_base_price: number; // in cents
  fixed_duration_minutes: number;
  instant_book_enabled: boolean;
  category_id: string;
  photos: string[];
  included_scope_en: string;
  included_scope_es: string;
  max_area_sq_m?: number;
  auto_assign_strategy: 'nearest' | 'top_rated' | 'round_robin';
  created_at: string;
  updated_at: string;
}

interface Category {
  id: string;
  name_en: string;
  name_es: string;
  slug: string;
  parent_id?: string;
}

export default function AdminServicesPage() {
  const { formatCurrency } = useLocale();
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title_en: '',
    title_es: '',
    description_en: '',
    description_es: '',
    fixed_base_price: 0,
    fixed_duration_minutes: 60,
    instant_book_enabled: true,
    category_id: '',
    included_scope_en: '',
    included_scope_es: '',
    max_area_sq_m: '',
    auto_assign_strategy: 'nearest' as const,
    photos: [] as string[]
  });

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  const fetchServices = async () => {
    try {
      console.log('Fetching services from API...');
      const response = await fetch('/api/admin/services');
      
      if (response.ok) {
        const data = await response.json();
        console.log('Services data received:', data);
        setServices(data.services || []);
        console.log(`Loaded ${data.services?.length || 0} services`);
      } else {
        console.error('Failed to fetch services:', response.status, response.statusText);
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        alert(`Failed to load services: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      alert('Failed to load services. Please check the console for details.');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      } else {
        // Fallback with mock categories if API doesn't exist yet
        setCategories([
          { id: '1', name_en: 'Cleaning', name_es: 'Limpieza', slug: 'cleaning' },
          { id: '2', name_en: 'Plumbing', name_es: 'Plomería', slug: 'plumbing' },
          { id: '3', name_en: 'Electrical', name_es: 'Eléctrico', slug: 'electrical' },
          { id: '4', name_en: 'Handyman', name_es: 'Reparaciones', slug: 'handyman' },
        ]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback categories
      setCategories([
        { id: '1', name_en: 'Cleaning', name_es: 'Limpieza', slug: 'cleaning' },
        { id: '2', name_en: 'Plumbing', name_es: 'Plomería', slug: 'plumbing' },
        { id: '3', name_en: 'Electrical', name_es: 'Eléctrico', slug: 'electrical' },
        { id: '4', name_en: 'Handyman', name_es: 'Reparaciones', slug: 'handyman' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const serviceData = {
        ...formData,
        fixed_base_price: formData.fixed_base_price * 100, // Convert to cents
        max_area_sq_m: formData.max_area_sq_m ? parseInt(formData.max_area_sq_m) : null,
      };

      const url = editingService ? `/api/admin/services/${editingService.id}` : '/api/admin/services';
      const method = editingService ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData),
      });

      if (response.ok) {
        await fetchServices();
        resetForm();
        setShowCreateModal(false);
        setEditingService(null);
      } else {
        const error = await response.json();
        alert('Error saving service: ' + (error.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Error saving service');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title_en: service.title_en,
      title_es: service.title_es,
      description_en: service.description_en,
      description_es: service.description_es,
      fixed_base_price: service.fixed_base_price / 100, // Convert from cents
      fixed_duration_minutes: service.fixed_duration_minutes,
      instant_book_enabled: service.instant_book_enabled,
      category_id: service.category_id,
      included_scope_en: service.included_scope_en,
      included_scope_es: service.included_scope_es,
      max_area_sq_m: service.max_area_sq_m?.toString() || '',
      auto_assign_strategy: service.auto_assign_strategy,
      photos: service.photos || []
    });
    setShowCreateModal(true);
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const response = await fetch(`/api/admin/services/${serviceId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchServices();
      } else {
        alert('Error deleting service');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Error deleting service');
    }
  };

  const resetForm = () => {
    setFormData({
      title_en: '',
      title_es: '',
      description_en: '',
      description_es: '',
      fixed_base_price: 0,
      fixed_duration_minutes: 60,
      instant_book_enabled: true,
      category_id: '',
      included_scope_en: '',
      included_scope_es: '',
      max_area_sq_m: '',
      auto_assign_strategy: 'nearest',
      photos: []
    });
  };

  const getCategoryName = (categoryId: string) => {
    if (!categoryId) return 'No Category';
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name_en : `Category ID: ${categoryId}`;
  };

  if (loading && services.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AdminProtection>
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Service Catalog Management</h1>
              <p className="text-gray-600 mt-1">Create and manage services available on the platform</p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setEditingService(null);
                setShowCreateModal(true);
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Create New Service
            </button>
          </div>

          {/* Services List */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">All Services ({services.length})</h3>
            </div>
            
            {services.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
                <p className="text-gray-500 mb-4">Get started by creating your first service</p>
                <button
                  onClick={() => {
                    resetForm();
                    setEditingService(null);
                    setShowCreateModal(true);
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Create Service
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {services.map((service) => (
                  <div key={service.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">{service.title_en}</h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            service.instant_book_enabled 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {service.instant_book_enabled ? 'Instant Book' : 'Quote Required'}
                          </span>
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            {getCategoryName(service.category_id)}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3 line-clamp-2">{service.description_en}</p>
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            {formatCurrency(service.fixed_base_price / 100)}
                          </div>
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {service.fixed_duration_minutes} min
                          </div>
                          {service.max_area_sq_m && (
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                              </svg>
                              Max {service.max_area_sq_m} m²
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleEdit(service)}
                          className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Create/Edit Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingService ? 'Edit Service' : 'Create New Service'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingService(null);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Title (English) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title_en}
                      onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Basic Cleaning Service"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Title (Spanish) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title_es}
                      onChange={(e) => setFormData({ ...formData, title_es: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Servicio de Limpieza Básica"
                    />
                  </div>
                </div>

                {/* Descriptions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (English) *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.description_en}
                      onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Detailed description of the service..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (Spanish) *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.description_es}
                      onChange={(e) => setFormData({ ...formData, description_es: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Descripción detallada del servicio..."
                    />
                  </div>
                </div>

                {/* Pricing & Duration */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Base Price (USD) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.fixed_base_price}
                      onChange={(e) => setFormData({ ...formData, fixed_base_price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="45.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (minutes) *
                    </label>
                    <input
                      type="number"
                      required
                      min="15"
                      step="15"
                      value={formData.fixed_duration_minutes}
                      onChange={(e) => setFormData({ ...formData, fixed_duration_minutes: parseInt(e.target.value) || 60 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="60"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Area (m²)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.max_area_sq_m}
                      onChange={(e) => setFormData({ ...formData, max_area_sq_m: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Optional"
                    />
                  </div>
                </div>

                {/* Category & Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name_en}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Auto-assign Strategy *
                    </label>
                    <select
                      required
                      value={formData.auto_assign_strategy}
                      onChange={(e) => setFormData({ ...formData, auto_assign_strategy: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="nearest">Nearest Professional</option>
                      <option value="top_rated">Top Rated</option>
                      <option value="round_robin">Round Robin</option>
                    </select>
                  </div>
                </div>

                {/* Service Scope */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What's Included (English) *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formData.included_scope_en}
                      onChange={(e) => setFormData({ ...formData, included_scope_en: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="• General cleaning of all rooms&#10;• Bathroom and kitchen cleaning&#10;• Trash removal"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What's Included (Spanish) *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formData.included_scope_es}
                      onChange={(e) => setFormData({ ...formData, included_scope_es: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="• Limpieza general de todas las habitaciones&#10;• Limpieza de baño y cocina&#10;• Recogida de basura"
                    />
                  </div>
                </div>

                {/* Settings */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="instant_book"
                    checked={formData.instant_book_enabled}
                    onChange={(e) => setFormData({ ...formData, instant_book_enabled: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="instant_book" className="ml-2 block text-sm text-gray-900">
                    Enable instant booking (customers can book immediately without quote)
                  </label>
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingService(null);
                      resetForm();
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Saving...' : editingService ? 'Update Service' : 'Create Service'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminProtection>
  );
}