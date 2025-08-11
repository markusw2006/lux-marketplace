'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  categorySlug: string;
  imageUrls: string[];
  jobDate: string;
  clientLocationArea: string;
  projectDurationHours: number;
  approximateCost: number;
  featured: boolean;
  visible: boolean;
  createdAt: string;
}

const SERVICE_CATEGORIES: Record<string, string> = {
  cleaning: 'Limpieza',
  plumbing: 'Plomería',
  electrical: 'Eléctrico',
  handyman: 'Reparaciones Generales',
  painting: 'Pintura',
  gardening: 'Jardinería',
  appliance: 'Electrodomésticos',
  security: 'Seguridad'
};

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Form state for adding/editing portfolio items
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categorySlug: 'plumbing',
    jobDate: '',
    clientLocationArea: '',
    projectDurationHours: 2,
    approximateCost: 1000,
    featured: false,
    visible: true
  });

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockPortfolio: PortfolioItem[] = [
      {
        id: '1',
        title: 'Renovación completa de baño',
        description: 'Instalación completa de sistema sanitario, incluyendo regadera, lavabo y WC. Trabajo de alta calidad con acabados premium.',
        categorySlug: 'plumbing',
        imageUrls: ['/art/1110a8d6-e3d6-4b8a-a0f4-a914787e6914.png', '/art/1d265b78-c436-4b12-96e8-5de8ddacc8b4.png'],
        jobDate: '2024-12-15',
        clientLocationArea: 'Polanco',
        projectDurationHours: 8,
        approximateCost: 3500,
        featured: true,
        visible: true,
        createdAt: '2024-12-15T10:00:00Z'
      },
      {
        id: '2',
        title: 'Reparación de fuga en cocina',
        description: 'Reparación urgente de fuga bajo el fregadero, reemplazo de tuberías deterioradas y instalación de nuevas válvulas.',
        categorySlug: 'plumbing',
        imageUrls: ['/art/2e8e750e-cfeb-49a5-99f2-15a153efbb0f.png'],
        jobDate: '2024-12-10',
        clientLocationArea: 'Roma Norte',
        projectDurationHours: 3,
        approximateCost: 1200,
        featured: false,
        visible: true,
        createdAt: '2024-12-10T14:30:00Z'
      },
      {
        id: '3',
        title: 'Instalación de lavadora',
        description: 'Conexión e instalación de lavadora automática, incluyendo tomas de agua y desagüe.',
        categorySlug: 'handyman',
        imageUrls: ['/art/514ebc24-73d4-46d8-8a8e-20306ca6adc4.png'],
        jobDate: '2024-12-05',
        clientLocationArea: 'Condesa',
        projectDurationHours: 2,
        approximateCost: 800,
        featured: false,
        visible: true,
        createdAt: '2024-12-05T09:15:00Z'
      }
    ];

    setPortfolio(mockPortfolio);
    setLoading(false);
  }, []);

  const handleAddItem = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      categorySlug: 'plumbing',
      jobDate: '',
      clientLocationArea: '',
      projectDurationHours: 2,
      approximateCost: 1000,
      featured: false,
      visible: true
    });
    setShowAddModal(true);
  };

  const handleEditItem = (item: PortfolioItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      categorySlug: item.categorySlug,
      jobDate: item.jobDate,
      clientLocationArea: item.clientLocationArea,
      projectDurationHours: item.projectDurationHours,
      approximateCost: item.approximateCost,
      featured: item.featured,
      visible: item.visible
    });
    setShowAddModal(true);
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este proyecto del portafolio?')) {
      return;
    }

    try {
      // In real app, make API call
      setPortfolio(prev => prev.filter(item => item.id !== id));
      alert('Proyecto eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting portfolio item:', error);
      alert('Error al eliminar el proyecto');
    }
  };

  const handleSaveItem = async () => {
    try {
      if (editingItem) {
        // Update existing item
        const updatedItem = { ...editingItem, ...formData };
        setPortfolio(prev => prev.map(item => 
          item.id === editingItem.id ? updatedItem : item
        ));
      } else {
        // Add new item
        const newItem: PortfolioItem = {
          id: Date.now().toString(),
          ...formData,
          imageUrls: ['/art/dd5cc185-4a97-4d5e-9186-3a34b9866e4b.png'], // Mock image
          createdAt: new Date().toISOString()
        };
        setPortfolio(prev => [newItem, ...prev]);
      }

      setShowAddModal(false);
      alert('Proyecto guardado exitosamente');
    } catch (error) {
      console.error('Error saving portfolio item:', error);
      alert('Error al guardar el proyecto');
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      setPortfolio(prev => prev.map(item => 
        item.id === id ? { ...item, featured: !item.featured } : item
      ));
    } catch (error) {
      console.error('Error updating portfolio item:', error);
    }
  };

  const toggleVisibility = async (id: string) => {
    try {
      setPortfolio(prev => prev.map(item => 
        item.id === id ? { ...item, visible: !item.visible } : item
      ));
    } catch (error) {
      console.error('Error updating portfolio item:', error);
    }
  };

  const filteredPortfolio = filterCategory === 'all' 
    ? portfolio 
    : portfolio.filter(item => item.categorySlug === filterCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
                    <span className="ml-4 text-sm font-medium text-gray-900">Portafolio</span>
                  </div>
                </li>
              </ol>
            </nav>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mi Portafolio</h1>
                <p className="mt-1 text-sm text-gray-500">Muestra tus mejores trabajos para atraer más clientes</p>
              </div>
              
              <button
                onClick={handleAddItem}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                + Agregar Proyecto
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Bar */}
        <div className="flex items-center space-x-4 mb-8">
          <label className="text-sm font-medium text-gray-700">Filtrar por categoria:</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">Todas las categorías</option>
            {Object.entries(SERVICE_CATEGORIES).map(([slug, name]) => (
              <option key={slug} value={slug}>{name}</option>
            ))}
          </select>
        </div>

        {/* Portfolio Grid */}
        {filteredPortfolio.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay proyectos en tu portafolio</h3>
            <p className="text-gray-500 mb-4">Agrega algunos de tus mejores trabajos para mostrar tu experiencia</p>
            <button
              onClick={handleAddItem}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Agregar Primer Proyecto
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPortfolio.map(item => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Image */}
                <div className="aspect-w-16 aspect-h-12">
                  <img
                    src={item.imageUrls[0]}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    <div className="flex items-center space-x-1">
                      {item.featured && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          ⭐ Destacado
                        </span>
                      )}
                      {!item.visible && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          👁️ Oculto
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>{SERVICE_CATEGORIES[item.categorySlug]}</span>
                    <span>{item.clientLocationArea}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{item.projectDurationHours}h</span>
                    <span>${item.approximateCost.toLocaleString()} MXN</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleFeatured(item.id)}
                        className={`text-xs font-medium px-2 py-1 rounded ${
                          item.featured 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {item.featured ? '⭐ Destacado' : '☆ Destacar'}
                      </button>
                      
                      <button
                        onClick={() => toggleVisibility(item.id)}
                        className={`text-xs font-medium px-2 py-1 rounded ${
                          item.visible 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {item.visible ? '👁️ Visible' : '🙈 Oculto'}
                      </button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-full overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingItem ? 'Editar Proyecto' : 'Agregar Proyecto'}
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título del Proyecto
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej. Renovación completa de baño"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe el trabajo realizado, materiales utilizados, etc."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoría
                    </label>
                    <select
                      value={formData.categorySlug}
                      onChange={(e) => setFormData(prev => ({ ...prev, categorySlug: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {Object.entries(SERVICE_CATEGORIES).map(([slug, name]) => (
                        <option key={slug} value={slug}>{name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha del Trabajo
                    </label>
                    <input
                      type="date"
                      value={formData.jobDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, jobDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Área del Cliente
                    </label>
                    <input
                      type="text"
                      value={formData.clientLocationArea}
                      onChange={(e) => setFormData(prev => ({ ...prev, clientLocationArea: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej. Polanco, Roma Norte"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duración (horas)
                    </label>
                    <input
                      type="number"
                      value={formData.projectDurationHours}
                      onChange={(e) => setFormData(prev => ({ ...prev, projectDurationHours: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Costo Aproximado (MXN)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={formData.approximateCost}
                      onChange={(e) => setFormData(prev => ({ ...prev, approximateCost: parseInt(e.target.value) }))}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Proyecto destacado</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.visible}
                      onChange={(e) => setFormData(prev => ({ ...prev, visible: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Visible en perfil público</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                
                <button
                  onClick={handleSaveItem}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  {editingItem ? 'Actualizar' : 'Guardar'} Proyecto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}