'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Locale = 'en' | 'es';
export type Currency = 'USD' | 'MXN';

interface LocaleContextType {
  locale: Locale;
  currency: Currency;
  exchangeRate: number;
  rateLocked: boolean;
  setLocale: (locale: Locale) => void;
  formatCurrency: (amount: number, fromCurrency?: Currency) => string;
  lockExchangeRate: () => void;
  unlockExchangeRate: () => void;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

// Simple translations - in production use next-intl
const translations = {
  en: {
    'nav.home': 'Home',
    'nav.services': 'Services', 
    'nav.bookings': 'My Bookings',
    'nav.login': 'Sign In',
    'nav.signup': 'Sign Up',
    'nav.become-pro': 'Become a Pro',
    'nav.dashboard': 'Dashboard',
    'hero.title': 'Instant-Book Professional Services in CDMX',
    'hero.subtitle': 'Choose from verified professionals, transparent pricing, and instant booking',
    'search.placeholder': 'What service do you need?',
    'search.zip.placeholder': 'Your postal code',
    'search.button': 'Find Services',
    'service.book': 'Book Now',
    'service.duration': 'Duration',
    'service.price': 'Price',
    'service.starting-at': 'Starting at',
    'booking.confirmed': 'Booking Confirmed!',
    'booking.success': 'Your payment was successful and your service has been booked.',
    'booking.total': 'Total',
    'booking.reference': 'Booking Reference',
    'booking.service': 'Service',
    'booking.date': 'Date',
    'booking.time': 'Time',
    'booking.what-next': 'What happens next?',
    'booking.finding-pro': "We're finding you a verified professional in your area",
    'booking.email-confirm': "You'll receive a confirmation email with your pro's details within 5 minutes",
    'booking.pro-contact': 'Your pro will contact you 30 minutes before your scheduled time',
    'booking.view-bookings': 'View My Bookings',
    'booking.book-another': 'Book Another Service',
    'checkout.complete': 'Complete Booking',
    'checkout.processing': 'Processing...',
    'checkout.name': 'Full Name',
    'checkout.email': 'Email Address',
    'checkout.phone': 'Phone Number',
    'checkout.address': 'Service Address',
    'checkout.card-info': 'Card Information',
    'checkout.demo-mode': 'Demo Mode - Test Card Numbers:',
    'checkout.no-charges': 'Payment will be simulated - no real charges',
    'checkout.apple-pay': 'Pay with Apple Pay',
    'checkout.google-pay': 'Pay with Google Pay',
    'checkout.or-card': 'Or pay with card',
    'categories.cleaning': 'Cleaning Services',
    'categories.plumbing': 'Plumbing',
    'categories.electrical': 'Electrical',
    'categories.handyman': 'Handyman',
    'categories.painting': 'Painting',
    'categories.courier': 'Courier',
    'categories.pest': 'Pest Control',
    'how-it-works.title': 'How It Works',
    'how-it-works.step1.title': 'Choose & Book',
    'how-it-works.step1.desc': 'Select your service and book instantly with transparent pricing',
    'how-it-works.step2.title': 'Get Matched',
    'how-it-works.step2.desc': 'We connect you with verified professionals in your area',
    'how-it-works.step3.title': 'Service Complete',
    'how-it-works.step3.desc': 'Professional service delivered on time with satisfaction guaranteed',
    'categories.view-services': 'View services',
    'trust.verified-pros': 'Verified Professionals',
    'trust.verified-pros-desc': 'All pros are background-checked and verified',
    'trust.upfront-pricing': 'Upfront Pricing',
    'trust.upfront-pricing-desc': 'Know the exact cost before you book',
    'trust.instant-booking': 'Instant Booking',
    'trust.instant-booking-desc': 'Book and get matched in under 2 minutes',
    'trust.satisfaction': 'Satisfaction Guaranteed',
    'trust.satisfaction-desc': 'We stand behind every service',
    'configurator.select-date-time': 'Select Date & Time',
    'configurator.trust-verified': 'Verified Pros',
    'configurator.trust-instant': 'Instant Booking',
    'configurator.book-this-service': 'Book This Service',
    'configurator.select-options': 'Select your options and preferred time',
    'configurator.addons': 'Add-ons',
    'configurator.preferred-date': 'Preferred Date',
    'configurator.preferred-time': 'Preferred Time',
    'configurator.price-breakdown': 'Price Breakdown',
    'configurator.base-service': 'Base Service',
    'value-props': [
      'Skip the endless calls and get instant quotes',
      'No more waiting weeks — book verified pros today', 
      'End price surprises with transparent, upfront costs',
      'Stop hiring randoms — work with background-checked professionals',
      'Quit wasting weekends — Lux handles home services so you don\'t have to'
    ],
    'currency.usd': 'USD',
    'currency.mxn': 'MXN',
    'footer.tagline': 'Instant booking for trusted professionals in Mexico City. Get upfront pricing, book instantly, and get matched with verified pros.',
    'footer.company': 'Company',
    'footer.about': 'About',
    'footer.contact': 'Contact',
    'footer.careers': 'Careers',
    'footer.copyright': 'All rights reserved.',
    'nav.welcome': 'Welcome',
    'nav.sign-out': 'Sign Out',
    'hero.main-title': 'Book Trusted Pros',
    'hero.main-subtitle': 'Instantly',
    'categories.popular-services': 'Popular Services',
    'categories.cleaning-desc': 'Professional cleaning for your home or office',
    'categories.plumbing-desc': 'Expert plumbing repairs and installations',
    'categories.electrical-desc': 'Safe electrical work by certified professionals',
    'categories.assembly-desc': 'Furniture and appliance assembly',
    'images.professional-service': 'Professional service',
    'search.results-for': 'Search Results for',
    'search.services-found': 'services found in',
    'search.no-services': 'No services found',
    'search.other-services': 'Other {query} Services',
    'search.category-services': '{category} Services',
    'nav.cleaning': 'Cleaning',
    'service.reviews': 'reviews',
    'service.whats-included': 'What\'s Included',
    'service.available-addons': 'Available Add-ons',
    'service.features.cleaning': [
      'Dusting and vacuuming all surfaces',
      'Bathroom cleaning and sanitization', 
      'Kitchen counter and appliance cleaning',
      'Trash removal and recycling',
      'Floor mopping and spot cleaning',
      'Mirror and glass cleaning'
    ],
    'service.features.plumbing': [
      'Professional plumbing tools included',
      'Quality parts and materials',
      'Testing and inspection',
      'Cleanup after work',
      'Warranty on workmanship'
    ],
    'service.features.electrical': [
      'Licensed electrician service',
      'Safety testing and inspection',
      'Code compliant installation',
      'Professional grade materials',
      'Work area cleanup'
    ],
    'service.features.handyman': [
      'Professional tools provided',
      'Quality assembly and installation',
      'Instructions and testing',
      'Cleanup and disposal',
      'Satisfaction guarantee'
    ],
    'service.features.default': [
      'Professional service execution',
      'Quality materials and tools',
      'Work area cleanup',
      'Service guarantee',
      'Verified professional'
    ],
    'service.included': [
      'Professional service supplies',
      'Verified and background-checked professionals',
      'Satisfaction guarantee',
      'Instant booking and confirmation',
      'Platform protection'
    ]
  },
  es: {
    'nav.home': 'Inicio',
    'nav.services': 'Servicios',
    'nav.bookings': 'Mis Reservas', 
    'nav.login': 'Iniciar Sesión',
    'nav.signup': 'Registrarse',
    'nav.become-pro': 'Ser Profesional',
    'nav.dashboard': 'Panel',
    'hero.title': 'Reserva Servicios Profesionales al Instante en CDMX',
    'hero.subtitle': 'Elige profesionales verificados, precios transparentes y reserva instantánea',
    'search.placeholder': '¿Qué servicio necesitas?',
    'search.zip.placeholder': 'Tu código postal',
    'search.button': 'Buscar Servicios',
    'service.book': 'Reservar Ahora',
    'service.duration': 'Duración',
    'service.price': 'Precio',
    'service.starting-at': 'Desde',
    'booking.confirmed': '¡Reserva Confirmada!',
    'booking.success': 'Tu pago fue exitoso y tu servicio ha sido reservado.',
    'booking.total': 'Total',
    'booking.reference': 'Referencia de Reserva',
    'booking.service': 'Servicio',
    'booking.date': 'Fecha',
    'booking.time': 'Hora',
    'booking.what-next': '¿Qué sigue?',
    'booking.finding-pro': 'Estamos buscando un profesional verificado en tu área',
    'booking.email-confirm': 'Recibirás un email de confirmación con los detalles de tu profesional en 5 minutos',
    'booking.pro-contact': 'Tu profesional te contactará 30 minutos antes de tu horario programado',
    'booking.view-bookings': 'Ver Mis Reservas',
    'booking.book-another': 'Reservar Otro Servicio',
    'checkout.complete': 'Completar Reserva',
    'checkout.processing': 'Procesando...',
    'checkout.name': 'Nombre Completo',
    'checkout.email': 'Correo Electrónico',
    'checkout.phone': 'Número de Teléfono',
    'checkout.address': 'Dirección del Servicio',
    'checkout.card-info': 'Información de Tarjeta',
    'checkout.demo-mode': 'Modo Demo - Números de Tarjeta de Prueba:',
    'checkout.no-charges': 'El pago será simulado - sin cargos reales',
    'checkout.apple-pay': 'Pagar con Apple Pay',
    'checkout.google-pay': 'Pagar con Google Pay',
    'checkout.or-card': 'O pagar con tarjeta',
    'categories.cleaning': 'Servicios de Limpieza',
    'categories.plumbing': 'Plomería',
    'categories.electrical': 'Electricidad',
    'categories.handyman': 'Mantenimiento',
    'categories.painting': 'Pintura',
    'categories.courier': 'Mensajería',
    'categories.pest': 'Control de Plagas',
    'how-it-works.title': 'Cómo Funciona',
    'how-it-works.step1.title': 'Elige y Reserva',
    'how-it-works.step1.desc': 'Selecciona tu servicio y reserva al instante con precios transparentes',
    'how-it-works.step2.title': 'Te Conectamos',
    'how-it-works.step2.desc': 'Te conectamos con profesionales verificados en tu área',
    'how-it-works.step3.title': 'Servicio Completado',
    'how-it-works.step3.desc': 'Servicio profesional entregado a tiempo con satisfacción garantizada',
    'categories.view-services': 'Ver servicios',
    'trust.verified-pros': 'Profesionales Verificados',
    'trust.verified-pros-desc': 'Todos los profesionales tienen verificación de antecedentes',
    'trust.upfront-pricing': 'Precios Transparentes',
    'trust.upfront-pricing-desc': 'Conoce el costo exacto antes de reservar',
    'trust.instant-booking': 'Reserva Instantánea',
    'trust.instant-booking-desc': 'Reserva y conecta en menos de 2 minutos',
    'trust.satisfaction': 'Satisfacción Garantizada',
    'trust.satisfaction-desc': 'Respaldamos cada servicio',
    'configurator.select-date-time': 'Selecciona Fecha y Hora',
    'configurator.trust-verified': 'Profesionales Verificados',
    'configurator.trust-instant': 'Reserva Instantánea',
    'configurator.book-this-service': 'Reservar Este Servicio',
    'configurator.select-options': 'Selecciona tus opciones y hora preferida',
    'configurator.addons': 'Complementos',
    'configurator.preferred-date': 'Fecha Preferida',
    'configurator.preferred-time': 'Hora Preferida',
    'configurator.price-breakdown': 'Desglose de Precio',
    'configurator.base-service': 'Servicio Base',
    'value-props': [
      'Salta las llamadas infinitas y obtén cotizaciones instantáneas',
      'No más esperar semanas — reserva profesionales verificados hoy',
      'Termina con las sorpresas de precio con costos transparentes y claros',
      'Deja de contratar desconocidos — trabaja con profesionales verificados',
      'Deja de desperdiciar fines de semana — Lux se encarga de los servicios del hogar'
    ],
    'currency.usd': 'USD',
    'currency.mxn': 'MXN',
    'footer.tagline': 'Reserva instantánea de profesionales de confianza en la Ciudad de México. Precios transparentes, reserva al instante y conéctate con profesionales verificados.',
    'footer.company': 'Empresa',
    'footer.about': 'Acerca de',
    'footer.contact': 'Contacto',
    'footer.careers': 'Carreras',
    'footer.copyright': 'Todos los derechos reservados.',
    'nav.welcome': 'Bienvenido',
    'nav.sign-out': 'Cerrar Sesión',
    'hero.main-title': 'Reserva Profesionales de Confianza',
    'hero.main-subtitle': 'Al Instante',
    'categories.popular-services': 'Servicios Populares',
    'categories.cleaning-desc': 'Limpieza profesional para tu hogar u oficina',
    'categories.plumbing-desc': 'Reparaciones e instalaciones de plomería expertas',
    'categories.electrical-desc': 'Trabajo eléctrico seguro por profesionales certificados',
    'categories.assembly-desc': 'Ensamblaje de muebles y electrodomésticos',
    'images.professional-service': 'Servicio profesional',
    'search.results-for': 'Resultados de Búsqueda para',
    'search.services-found': 'servicios encontrados en',
    'search.no-services': 'No se encontraron servicios',
    'search.other-services': 'Otros Servicios de {query}',
    'search.category-services': 'Servicios de {category}',
    'nav.cleaning': 'Limpieza',
    'service.reviews': 'reseñas',
    'service.whats-included': 'Qué Incluye',
    'service.available-addons': 'Complementos Disponibles',
    'service.features.cleaning': [
      'Sacudir y aspirar todas las superficies',
      'Limpieza y desinfección de baños',
      'Limpieza de cocina y electrodomésticos',
      'Recolección de basura y reciclaje',
      'Trapear pisos y limpieza de manchas',
      'Limpieza de espejos y cristales'
    ],
    'service.features.plumbing': [
      'Herramientas profesionales de plomería incluidas',
      'Partes y materiales de calidad',
      'Pruebas e inspección',
      'Limpieza después del trabajo',
      'Garantía en la mano de obra'
    ],
    'service.features.electrical': [
      'Servicio de electricista licenciado',
      'Pruebas de seguridad e inspección',
      'Instalación conforme a códigos',
      'Materiales de grado profesional',
      'Limpieza del área de trabajo'
    ],
    'service.features.handyman': [
      'Herramientas profesionales incluidas',
      'Ensamblaje e instalación de calidad',
      'Instrucciones y pruebas',
      'Limpieza y eliminación',
      'Garantía de satisfacción'
    ],
    'service.features.default': [
      'Ejecución de servicio profesional',
      'Materiales y herramientas de calidad',
      'Limpieza del área de trabajo',
      'Garantía de servicio',
      'Profesional verificado'
    ],
    'service.included': [
      'Suministros de servicio profesional',
      'Profesionales verificados y con antecedentes verificados',
      'Garantía de satisfacción',
      'Reserva y confirmación instantánea',
      'Protección de la plataforma'
    ]
  }
};

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [exchangeRate, setExchangeRate] = useState(17); // USD to MXN rate
  const [rateLocked, setRateLocked] = useState(false);
  const [lockedRate, setLockedRate] = useState(17);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('locale-preference');
    if (saved) {
      const { locale: savedLocale, currency: savedCurrency } = JSON.parse(saved);
      setLocaleState(savedLocale);
      setCurrency(savedCurrency);
    }
  }, []);

  // Fetch live exchange rate
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const response = await fetch('/api/exchange-rate');
        const data = await response.json();
        if (data.rate && !rateLocked) {
          setExchangeRate(data.rate);
        }
      } catch (error) {
        console.error('Failed to fetch exchange rate:', error);
      }
    };

    fetchRate();
    
    // Update every hour
    const interval = setInterval(fetchRate, 3600000);
    return () => clearInterval(interval);
  }, [rateLocked]);

  const setLocale = (newLocale: Locale) => {
    const newCurrency = newLocale === 'en' ? 'USD' : 'MXN';
    setLocaleState(newLocale);
    setCurrency(newCurrency);
    
    // Save to localStorage
    localStorage.setItem('locale-preference', JSON.stringify({
      locale: newLocale,
      currency: newCurrency
    }));
  };

  const formatCurrency = (amount: number, fromCurrency: Currency = 'MXN'): string => {
    // Convert amount if needed (default prices are in MXN)
    let convertedAmount = amount;
    const currentRate = rateLocked ? lockedRate : exchangeRate;
    
    if (fromCurrency === 'MXN' && currency === 'USD') {
      // Convert MXN to USD using live rate
      convertedAmount = amount / currentRate;
    } else if (fromCurrency === 'USD' && currency === 'MXN') {
      // Convert USD to MXN using live rate
      convertedAmount = amount * currentRate;
    }
    
    const formatted = new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'es-MX', {
      style: 'currency',
      currency: currency,
      currencyDisplay: 'symbol'
    }).format(convertedAmount);
    
    // Add currency code after the formatted amount
    return `${formatted} ${currency}`;
  };

  const lockExchangeRate = () => {
    setRateLocked(true);
    setLockedRate(exchangeRate);
    console.log(`Exchange rate locked at 1 USD = ${exchangeRate.toFixed(4)} MXN`);
  };

  const unlockExchangeRate = () => {
    setRateLocked(false);
    console.log('Exchange rate unlocked');
  };

  const t = (key: string): string => {
    return translations[locale][key as keyof typeof translations['en']] || key;
  };

  return (
    <LocaleContext.Provider value={{
      locale,
      currency,
      exchangeRate,
      rateLocked,
      setLocale,
      formatCurrency,
      lockExchangeRate,
      unlockExchangeRate,
      t
    }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}