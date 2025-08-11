'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Professional {
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
  rating: number;
  reviewCount: number;
  totalJobs: number;
  completionRate: number;
  responseTime: number;
  verified: boolean;
  insuranceVerified: boolean;
  backgroundCheckVerified: boolean;
}

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
}

interface Review {
  id: string;
  customerName: string;
  overallRating: number;
  qualityRating: number;
  punctualityRating: number;
  communicationRating: number;
  title: string;
  comment: string;
  professionalResponse?: string;
  createdAt: string;
}

interface Certification {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate?: string;
  verified: boolean;
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

export default function ProfessionalProfilePage() {
  const params = useParams();
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'about' | 'portfolio' | 'reviews' | 'certifications'>('about');
  const [selectedPortfolioItem, setSelectedPortfolioItem] = useState<PortfolioItem | null>(null);

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockProfessional: Professional = {
      id: params.id as string,
      businessName: 'Plomería García',
      tagline: 'Plomero experto - 15+ años de experiencia en CDMX',
      bio: 'Soy un plomero profesional con más de 15 años de experiencia en la Ciudad de México. Me especializo en reparaciones residenciales, instalaciones sanitarias y mantenimiento preventivo. Cuento con todas las certificaciones necesarias y garantizo mi trabajo por 6 meses.',
      profilePhotoUrl: '/art/dd5cc185-4a97-4d5e-9186-3a34b9866e4b.png',
      experienceYears: 15,
      licenseNumber: 'PL-CDMX-2024-001',
      serviceAreas: ['plumbing', 'handyman'],
      serviceRadius: 25,
      baseLocation: {
        address: 'Roma Norte, CDMX',
        alcaldia: 'Cuauhtémoc'
      },
      rating: 4.9,
      reviewCount: 147,
      totalJobs: 312,
      completionRate: 98.7,
      responseTime: 15, // minutes
      verified: true,
      insuranceVerified: true,
      backgroundCheckVerified: true
    };

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
        approximateCost: 3500
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
        approximateCost: 1200
      }
    ];

    const mockReviews: Review[] = [
      {
        id: '1',
        customerName: 'María G.',
        overallRating: 5,
        qualityRating: 5,
        punctualityRating: 5,
        communicationRating: 5,
        title: 'Excelente servicio',
        comment: 'Carlos llegó puntual, trabajó de manera muy profesional y dejó todo limpio. El problema se solucionó completamente y a un precio justo.',
        professionalResponse: 'Muchas gracias María! Fue un placer trabajar en su hogar. Cualquier cosa, no dude en contactarme.',
        createdAt: '2024-12-20'
      },
      {
        id: '2',
        customerName: 'Roberto M.',
        overallRating: 5,
        qualityRating: 5,
        punctualityRating: 4,
        communicationRating: 5,
        title: 'Muy recomendable',
        comment: 'Trabajo impecable, me explicó todo lo que hizo y me dio consejos para evitar problemas futuros.',
        createdAt: '2024-12-18'
      }
    ];

    const mockCertifications: Certification[] = [
      {
        id: '1',
        name: 'Certificado de Plomería Residencial',
        issuingOrganization: 'Cámara Nacional de la Industria de la Construcción',
        issueDate: '2020-03-15',
        expiryDate: '2025-03-15',
        verified: true
      },
      {
        id: '2',
        name: 'Certificado en Seguridad Industrial',
        issuingOrganization: 'STPS',
        issueDate: '2023-06-10',
        expiryDate: '2026-06-10',
        verified: true
      }
    ];

    setProfessional(mockProfessional);
    setPortfolio(mockPortfolio);
    setReviews(mockReviews);
    setCertifications(mockCertifications);
    setLoading(false);
  }, [params.id]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!professional) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Profesional no encontrado</h2>
          <p className="mt-2 text-gray-600">El perfil que buscas no existe o no está disponible.</p>
          <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link href="/" className="text-gray-500 hover:text-gray-700">
                  Inicio
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-4 text-sm font-medium text-gray-900">Perfil Profesional</span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Professional Header */}
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              {professional.profilePhotoUrl ? (
                <img
                  src={professional.profilePhotoUrl}
                  alt={professional.businessName}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center border-4 border-white shadow-lg">
                  <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{professional.businessName}</h1>
                {professional.verified && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Verificado
                  </span>
                )}
              </div>
              
              <p className="text-gray-600 mb-3">{professional.tagline}</p>
              
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-1">
                  {renderStars(professional.rating)}
                  <span className="font-medium text-gray-900">{professional.rating}</span>
                  <span className="text-gray-500">({professional.reviewCount} reseñas)</span>
                </div>
                
                <div className="text-gray-600">
                  {professional.totalJobs} trabajos completados
                </div>
                
                <div className="text-gray-600">
                  {professional.experienceYears} años de experiencia
                </div>
              </div>

              <div className="mt-4 flex items-center space-x-4">
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {professional.baseLocation.alcaldia} • {professional.serviceRadius} km cobertura
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Responde en ~{professional.responseTime} min
                </div>
              </div>
            </div>

            <div className="flex-shrink-0">
              <Link
                href={`/service/booking?professional=${professional.id}`}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Contactar Profesional
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                {[
                  { key: 'about', label: 'Acerca de' },
                  { key: 'portfolio', label: 'Portafolio' },
                  { key: 'reviews', label: 'Reseñas' },
                  { key: 'certifications', label: 'Certificaciones' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.key
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'about' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Biografía</h3>
                  <p className="text-gray-600 leading-relaxed">{professional.bio}</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Servicios que Ofrece</h3>
                  <div className="flex flex-wrap gap-2">
                    {professional.serviceAreas.map(area => (
                      <span
                        key={area}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {SERVICE_CATEGORIES[area]}
                      </span>
                    ))}
                  </div>
                </div>

                {professional.licenseNumber && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Información Profesional</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-gray-600">
                          Licencia: {professional.licenseNumber}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'portfolio' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {portfolio.map(item => (
                    <div
                      key={item.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedPortfolioItem(item)}
                    >
                      <div className="aspect-w-16 aspect-h-12">
                        <img
                          src={item.imageUrls[0]}
                          alt={item.title}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{item.clientLocationArea}</span>
                          <span>${item.approximateCost.toLocaleString()} MXN</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {reviews.map(review => (
                  <div key={review.id} className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">{review.customerName}</h4>
                          <div className="flex items-center">
                            {renderStars(review.overallRating)}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString('es-MX', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    {review.title && (
                      <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
                    )}
                    
                    <p className="text-gray-600 mb-4">{review.comment}</p>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                      <div className="text-center">
                        <div className="font-medium text-gray-900">Calidad</div>
                        <div className="flex justify-center mt-1">
                          {renderStars(review.qualityRating)}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-gray-900">Puntualidad</div>
                        <div className="flex justify-center mt-1">
                          {renderStars(review.punctualityRating)}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-gray-900">Comunicación</div>
                        <div className="flex justify-center mt-1">
                          {renderStars(review.communicationRating)}
                        </div>
                      </div>
                    </div>
                    
                    {review.professionalResponse && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="bg-blue-50 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                              <span className="text-xs font-medium text-white">
                                {professional.businessName.charAt(0)}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              Respuesta del profesional
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{review.professionalResponse}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'certifications' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {certifications.map(cert => (
                    <div key={cert.id} className="bg-white rounded-lg border border-gray-200 p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{cert.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{cert.issuingOrganization}</p>
                          <div className="text-xs text-gray-500">
                            <p>Emitido: {new Date(cert.issueDate).toLocaleDateString('es-MX')}</p>
                            {cert.expiryDate && (
                              <p>Expira: {new Date(cert.expiryDate).toLocaleDateString('es-MX')}</p>
                            )}
                          </div>
                        </div>
                        {cert.verified && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Verificado
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Estadísticas</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tasa de finalización</span>
                  <span className="text-sm font-medium text-gray-900">{professional.completionRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tiempo de respuesta</span>
                  <span className="text-sm font-medium text-gray-900">~{professional.responseTime} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Trabajos completados</span>
                  <span className="text-sm font-medium text-gray-900">{professional.totalJobs}</span>
                </div>
              </div>
            </div>

            {/* Verification Badges */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Verificaciones</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    professional.verified ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <svg className={`w-3 h-3 ${
                      professional.verified ? 'text-green-600' : 'text-gray-400'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">Perfil verificado</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    professional.backgroundCheckVerified ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <svg className={`w-3 h-3 ${
                      professional.backgroundCheckVerified ? 'text-green-600' : 'text-gray-400'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">Antecedentes verificados</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    professional.insuranceVerified ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <svg className={`w-3 h-3 ${
                      professional.insuranceVerified ? 'text-green-600' : 'text-gray-400'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">Seguro verificado</span>
                </div>
              </div>
            </div>

            {/* Contact CTA */}
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">¿Necesitas este servicio?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Contacta a {professional.businessName.split(' ')[0]} para solicitar un presupuesto
              </p>
              <Link
                href={`/service/booking?professional=${professional.id}`}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block"
              >
                Solicitar Servicio
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Modal */}
      {selectedPortfolioItem && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-full overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">{selectedPortfolioItem.title}</h3>
                <button
                  onClick={() => setSelectedPortfolioItem(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {selectedPortfolioItem.imageUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`${selectedPortfolioItem.title} - imagen ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                ))}
              </div>
              
              <p className="text-gray-600 mb-4">{selectedPortfolioItem.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Área:</span>
                  <div className="font-medium">{selectedPortfolioItem.clientLocationArea}</div>
                </div>
                <div>
                  <span className="text-gray-500">Duración:</span>
                  <div className="font-medium">{selectedPortfolioItem.projectDurationHours}h</div>
                </div>
                <div>
                  <span className="text-gray-500">Costo aprox.:</span>
                  <div className="font-medium">${selectedPortfolioItem.approximateCost.toLocaleString()} MXN</div>
                </div>
                <div>
                  <span className="text-gray-500">Fecha:</span>
                  <div className="font-medium">
                    {new Date(selectedPortfolioItem.jobDate).toLocaleDateString('es-MX')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}