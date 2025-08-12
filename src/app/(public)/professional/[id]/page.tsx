'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { professionals } from '@/data/seed/pros';
import { useLocale } from '@/contexts/LocaleContext';

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

// This will be replaced with dynamic translations

export default function ProfessionalProfilePage() {
  const params = useParams();
  const { t, locale } = useLocale();
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'about' | 'reviews' | 'certifications'>('about');

  useEffect(() => {
    // Find the professional by ID from our seed data
    const foundProfessional = professionals.find(p => p.id === params.id as string);
    
    if (!foundProfessional) {
      setLoading(false);
      return;
    }

    // Convert professional data to match the local interface
    const mappedProfessional: Professional = {
      id: foundProfessional.id,
      businessName: foundProfessional.businessName,
      tagline: foundProfessional.tagline,
      bio: foundProfessional.bio,
      profilePhotoUrl: foundProfessional.profilePhotoUrl,
      experienceYears: foundProfessional.experienceYears,
      licenseNumber: foundProfessional.licenseNumber,
      serviceAreas: foundProfessional.serviceAreas,
      serviceRadius: foundProfessional.serviceRadius,
      baseLocation: {
        address: foundProfessional.baseLocation.address,
        alcaldia: foundProfessional.baseLocation.alcaldia
      },
      rating: foundProfessional.rating,
      reviewCount: foundProfessional.reviewCount,
      totalJobs: foundProfessional.totalJobs,
      completionRate: foundProfessional.completionRate,
      responseTime: foundProfessional.responseTime,
      verified: foundProfessional.verified,
      insuranceVerified: foundProfessional.insuranceVerified,
      backgroundCheckVerified: foundProfessional.backgroundCheckVerified
    };


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

    setProfessional(mappedProfessional);
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!professional) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">{t('profile.not-found')}</h2>
          <p className="mt-2 text-gray-600">{t('profile.not-available')}</p>
          <Link href="/" className="mt-4 inline-block text-gray-600 hover:text-gray-900 hover:underline">
            {t('profile.back-home')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Hero Section with Large Profile */}
      <div className="bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Large Profile Section */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              {professional.profilePhotoUrl ? (
                <img
                  src={professional.profilePhotoUrl}
                  alt={professional.businessName}
                  className="w-40 h-40 rounded-full object-cover border-8 border-white shadow-xl ring-4 ring-gray-100"
                />
              ) : (
                <div className="w-40 h-40 rounded-full bg-gray-300 flex items-center justify-center border-8 border-white shadow-xl ring-4 ring-gray-100">
                  <svg className="w-20 h-20 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <h1 className="text-4xl font-bold text-gray-900">{professional.businessName}</h1>
                {professional.verified && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {t('profile.verified')}
                  </span>
                )}
              </div>
              
              <p className="text-xl text-gray-600 mb-6">{professional.tagline}</p>
              
              {/* Key Stats Row */}
              <div className="flex items-center justify-center space-x-8 mb-6">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    {renderStars(professional.rating)}
                  </div>
                  <div className="text-lg font-semibold text-gray-900">{professional.rating}</div>
                  <div className="text-sm text-gray-500">({professional.reviewCount} {t('profile.reviews')})</div>
                </div>
                
                <div className="w-px h-16 bg-gray-300"></div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{professional.totalJobs}</div>
                  <div className="text-sm text-gray-500">{t('profile.jobs-completed')}</div>
                </div>
                
                <div className="w-px h-16 bg-gray-300"></div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{professional.experienceYears}</div>
                  <div className="text-sm text-gray-500">{t('profile.years-experience')}</div>
                </div>
              </div>

              {/* Location and Response Time */}
              <div className="flex items-center justify-center space-x-6 text-gray-600 mb-8">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {professional.baseLocation.alcaldia} • {professional.serviceRadius} {t('profile.coverage')}
                </div>
                
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t('profile.responds-in', { time: professional.responseTime })}
                </div>
              </div>

              {/* Call to Action */}
              <div className="flex items-center justify-center space-x-4">
                <Link
                  href={`/service/booking?professional=${professional.id}`}
                  className="bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors text-lg shadow-lg"
                >
                  {t('profile.contact-professional')}
                </Link>
                <button className="bg-white text-gray-700 px-6 py-4 rounded-xl font-medium border border-gray-300 hover:bg-gray-50 transition-colors">
                  {t('profile.send-message')}
                </button>
              </div>
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
                  { key: 'about', label: t('profile.about') },
                  { key: 'reviews', label: t('profile.reviews-tab') },
                  { key: 'certifications', label: t('profile.certifications') }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.key
                        ? 'border-gray-900 text-gray-900'
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
                  <h3 className="text-lg font-medium text-gray-900 mb-3">{t('profile.biography')}</h3>
                  <p className="text-gray-600 leading-relaxed">{professional.bio}</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">{t('profile.services-offered')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {professional.serviceAreas.map(area => (
                      <span
                        key={area}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                      >
                        {t(`categories.${area}`)}
                      </span>
                    ))}
                  </div>
                </div>

                {professional.licenseNumber && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">{t('profile.professional-info')}</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-gray-600">
                          {t('profile.license')}: {professional.licenseNumber}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
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
                          {new Date(review.createdAt).toLocaleDateString(locale === 'es' ? 'es-MX' : 'en-US', {
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
                        <div className="font-medium text-gray-900">{t('profile.quality')}</div>
                        <div className="flex justify-center mt-1">
                          {renderStars(review.qualityRating)}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-gray-900">{t('profile.punctuality')}</div>
                        <div className="flex justify-center mt-1">
                          {renderStars(review.punctualityRating)}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-gray-900">{t('profile.communication')}</div>
                        <div className="flex justify-center mt-1">
                          {renderStars(review.communicationRating)}
                        </div>
                      </div>
                    </div>
                    
                    {review.professionalResponse && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center">
                              <span className="text-xs font-medium text-white">
                                {professional.businessName.charAt(0)}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {t('profile.professional-response')}
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
                            <p>{t('profile.issued')}: {new Date(cert.issueDate).toLocaleDateString(locale === 'es' ? 'es-MX' : 'en-US')}</p>
                            {cert.expiryDate && (
                              <p>{t('profile.expires')}: {new Date(cert.expiryDate).toLocaleDateString(locale === 'es' ? 'es-MX' : 'en-US')}</p>
                            )}
                          </div>
                        </div>
                        {cert.verified && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {t('profile.verified')}
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
            {/* Quick Contact Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('profile.need-service')}</h3>
              <p className="text-gray-600 mb-6">
                {t('profile.contact-for-quote', { name: professional.businessName.split(' ')[0] })}
              </p>
              
              <div className="space-y-3 mb-6">
                <Link
                  href={`/service/booking?professional=${professional.id}`}
                  className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors inline-block text-center"
                >
                  {t('profile.request-service')}
                </Link>
                <button className="w-full bg-white text-gray-700 px-4 py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors">
                  {t('profile.send-message')}
                </button>
              </div>
              
              <div className="border-t pt-4 text-sm text-gray-500">
                <div className="flex justify-between mb-2">
                  <span>{t('profile.typical-response')}</span>
                  <span className="font-medium text-gray-900">~{professional.responseTime} min</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('profile.completion-rate')}</span>
                  <span className="font-medium text-gray-900">{professional.completionRate}%</span>
                </div>
              </div>
            </div>

            {/* Verification Badges */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{t('profile.verifications')}</h3>
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
                  <span className="text-sm text-gray-700">{t('profile.verified-profile')}</span>
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
                  <span className="text-sm text-gray-700">{t('profile.background-verified')}</span>
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
                  <span className="text-sm text-gray-700">{t('profile.insurance-verified')}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}