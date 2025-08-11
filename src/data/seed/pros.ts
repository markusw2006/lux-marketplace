export interface Professional {
  id: string;
  businessName: string;
  tagline: string;
  bio: string;
  profilePhotoUrl?: string;
  experienceYears: number;
  licenseNumber?: string;
  serviceAreas: string[]; // service categories they offer
  serviceRadius: number; // km
  baseLocation: {
    address: string;
    alcaldia: string;
    lat: number;
    lng: number;
  };
  rating: number;
  reviewCount: number;
  totalJobs: number;
  completionRate: number;
  responseTime: number; // minutes
  verified: boolean;
  insuranceVerified: boolean;
  backgroundCheckVerified: boolean;
  startingPrice: number; // MXN cents - base price for their most common service
  specialties: string[];
  availability: {
    sameDay: boolean;
    nextDay: boolean;
    weekend: boolean;
  };
}

export const professionals: Professional[] = [
  // Cleaning Professionals
  {
    id: 'maria-cleaning-cdmx',
    businessName: 'Limpieza María',
    tagline: 'Especialista en limpieza residencial - 8+ años',
    bio: 'Servicio de limpieza profesional con más de 8 años de experiencia en CDMX. Uso productos eco-friendly y garantizo 100% satisfacción.',
    profilePhotoUrl: '/art/features/1.png',
    experienceYears: 8,
    serviceAreas: ['cleaning'],
    serviceRadius: 15,
    baseLocation: {
      address: 'Roma Norte, CDMX',
      alcaldia: 'Cuauhtémoc',
      lat: 19.4145,
      lng: -99.1696
    },
    rating: 4.9,
    reviewCount: 156,
    totalJobs: 234,
    completionRate: 99.1,
    responseTime: 12,
    verified: true,
    insuranceVerified: true,
    backgroundCheckVerified: true,
    startingPrice: 9000, // $90 MXN
    specialties: ['Deep cleaning', 'Eco-friendly products', 'Same day service'],
    availability: {
      sameDay: true,
      nextDay: true,
      weekend: true
    }
  },
  {
    id: 'ana-limpieza-express',
    businessName: 'Ana Limpieza Express',
    tagline: 'Limpieza rápida y eficiente - Disponible 7 días',
    bio: 'Servicio de limpieza express para personas ocupadas. Especializada en apartamentos y oficinas pequeñas.',
    profilePhotoUrl: '/art/features/2.png',
    experienceYears: 5,
    serviceAreas: ['cleaning'],
    serviceRadius: 20,
    baseLocation: {
      address: 'Condesa, CDMX',
      alcaldia: 'Cuauhtémoc',
      lat: 19.4056,
      lng: -99.1719
    },
    rating: 4.7,
    reviewCount: 89,
    totalJobs: 145,
    completionRate: 97.8,
    responseTime: 25,
    verified: true,
    insuranceVerified: false,
    backgroundCheckVerified: true,
    startingPrice: 8500,
    specialties: ['Quick cleaning', 'Apartment specialists', 'Weekend available'],
    availability: {
      sameDay: true,
      nextDay: true,
      weekend: true
    }
  },
  {
    id: 'clean-team-polanco',
    businessName: 'Clean Team Polanco',
    tagline: 'Equipo profesional - Garantía 48h',
    bio: 'Equipo de 3 personas especializadas en limpieza profunda y mantenimiento residencial. Servicio premium con garantía.',
    profilePhotoUrl: '/art/features/3.png',
    experienceYears: 12,
    serviceAreas: ['cleaning'],
    serviceRadius: 10,
    baseLocation: {
      address: 'Polanco, CDMX',
      alcaldia: 'Miguel Hidalgo',
      lat: 19.4326,
      lng: -99.1909
    },
    rating: 4.8,
    reviewCount: 203,
    totalJobs: 456,
    completionRate: 98.5,
    responseTime: 18,
    verified: true,
    insuranceVerified: true,
    backgroundCheckVerified: true,
    startingPrice: 12000,
    specialties: ['Team service', 'Deep cleaning', '48h guarantee'],
    availability: {
      sameDay: false,
      nextDay: true,
      weekend: false
    }
  },

  // Plumbing Professionals
  {
    id: 'carlos-plomeria-garcia',
    businessName: 'Plomería García',
    tagline: 'Plomero experto - 15+ años CDMX',
    bio: 'Plomero profesional con más de 15 años de experiencia. Especializado en reparaciones residenciales y emergencias 24/7.',
    profilePhotoUrl: '/art/features/4.png',
    experienceYears: 15,
    licenseNumber: 'PL-CDMX-2024-001',
    serviceAreas: ['plumbing', 'handyman'],
    serviceRadius: 25,
    baseLocation: {
      address: 'Roma Norte, CDMX',
      alcaldia: 'Cuauhtémoc',
      lat: 19.4145,
      lng: -99.1696
    },
    rating: 4.9,
    reviewCount: 147,
    totalJobs: 312,
    completionRate: 98.7,
    responseTime: 15,
    verified: true,
    insuranceVerified: true,
    backgroundCheckVerified: true,
    startingPrice: 10000,
    specialties: ['Emergency repairs', 'Faucet replacement', '24/7 available'],
    availability: {
      sameDay: true,
      nextDay: true,
      weekend: true
    }
  },
  {
    id: 'roberto-plomeria-express',
    businessName: 'Roberto Plomería Express',
    tagline: 'Servicio rápido - Garantía 6 meses',
    bio: 'Plomero certificado con enfoque en soluciones rápidas y duraderas. Especialista en instalaciones sanitarias.',
    profilePhotoUrl: '/1d265b78-c436-4b12-96e8-5de8ddacc8b4.png',
    experienceYears: 10,
    licenseNumber: 'PL-CDMX-2023-045',
    serviceAreas: ['plumbing'],
    serviceRadius: 18,
    baseLocation: {
      address: 'Del Valle, CDMX',
      alcaldia: 'Benito Juárez',
      lat: 19.3844,
      lng: -99.1638
    },
    rating: 4.6,
    reviewCount: 98,
    totalJobs: 187,
    completionRate: 96.2,
    responseTime: 22,
    verified: true,
    insuranceVerified: true,
    backgroundCheckVerified: true,
    startingPrice: 11500,
    specialties: ['Fast service', 'Installations', '6 month warranty'],
    availability: {
      sameDay: true,
      nextDay: true,
      weekend: false
    }
  },

  // Electrical Professionals  
  {
    id: 'luis-electricista-pro',
    businessName: 'Luis Electricista Pro',
    tagline: 'Electricista certificado - Seguridad garantizada',
    bio: 'Electricista profesional certificado por CFE. Especializado en instalaciones residenciales y reparaciones eléctricas.',
    profilePhotoUrl: '/1110a8d6-e3d6-4b8a-a0f4-a914787e6914.png',
    experienceYears: 12,
    licenseNumber: 'EL-CFE-2024-123',
    serviceAreas: ['electrical', 'handyman'],
    serviceRadius: 22,
    baseLocation: {
      address: 'Doctores, CDMX',
      alcaldia: 'Cuauhtémoc',
      lat: 19.4204,
      lng: -99.1434
    },
    rating: 4.8,
    reviewCount: 134,
    totalJobs: 298,
    completionRate: 97.9,
    responseTime: 28,
    verified: true,
    insuranceVerified: true,
    backgroundCheckVerified: true,
    startingPrice: 11000,
    specialties: ['CFE certified', 'Light fixtures', 'Safety first'],
    availability: {
      sameDay: false,
      nextDay: true,
      weekend: true
    }
  },

  // Handyman Professionals
  {
    id: 'miguel-handyman-cdmx',
    businessName: 'Miguel Reparaciones',
    tagline: 'Reparador general - Todo en uno',
    bio: 'Especialista en reparaciones generales del hogar. TV mounting, furniture assembly, y pequeñas reparaciones.',
    profilePhotoUrl: '/2e8e750e-cfeb-49a5-99f2-15a153efbb0f.png',
    experienceYears: 7,
    serviceAreas: ['handyman', 'electrical', 'plumbing'],
    serviceRadius: 16,
    baseLocation: {
      address: 'Nápoles, CDMX',
      alcaldia: 'Benito Juárez',  
      lat: 19.3965,
      lng: -99.1699
    },
    rating: 4.5,
    reviewCount: 76,
    totalJobs: 143,
    completionRate: 95.8,
    responseTime: 35,
    verified: true,
    insuranceVerified: false,
    backgroundCheckVerified: true,
    startingPrice: 9500,
    specialties: ['TV mounting', 'IKEA assembly', 'Multi-skilled'],
    availability: {
      sameDay: true,
      nextDay: true,
      weekend: true
    }
  }
];

// Helper function to get professionals by service category
export function getProfessionalsByService(serviceCategory: string): Professional[] {
  return professionals.filter(pro => 
    pro.serviceAreas.includes(serviceCategory)
  ).sort((a, b) => {
    // Sort by rating and review count
    const aScore = a.rating * Math.log(a.reviewCount + 1);
    const bScore = b.rating * Math.log(b.reviewCount + 1);
    return bScore - aScore;
  });
}

// Helper function to filter professionals by criteria
export function filterProfessionals(
  pros: Professional[],
  filters: {
    sameDay?: boolean;
    nextDay?: boolean;
    weekend?: boolean;
    maxPrice?: number;
    minRating?: number;
    verified?: boolean;
  }
): Professional[] {
  return pros.filter(pro => {
    if (filters.sameDay && !pro.availability.sameDay) return false;
    if (filters.nextDay && !pro.availability.nextDay) return false;
    if (filters.weekend && !pro.availability.weekend) return false;
    if (filters.maxPrice && pro.startingPrice > filters.maxPrice * 100) return false;
    if (filters.minRating && pro.rating < filters.minRating) return false;
    if (filters.verified && !pro.verified) return false;
    return true;
  });
}