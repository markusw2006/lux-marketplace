'use client';

import Link from 'next/link';
import { useLocale } from '@/contexts/LocaleContext';

export default function Footer() {
  const { t } = useLocale();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
              <img src="/lux_logo.svg" alt="Lux" className="h-12 w-auto" />
            </div>
            <p className="text-gray-600 text-sm leading-6 max-w-md">
              {t('footer.tagline')}
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">{t('nav.services')}</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/category/cleaning" className="hover:text-gray-900 transition-colors">{t('categories.cleaning')}</Link></li>
              <li><Link href="/category/plumbing" className="hover:text-gray-900 transition-colors">{t('categories.plumbing')}</Link></li>
              <li><Link href="/category/electrical" className="hover:text-gray-900 transition-colors">{t('categories.electrical')}</Link></li>
              <li><Link href="/category/assembly" className="hover:text-gray-900 transition-colors">{t('categories.handyman')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">{t('footer.company')}</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/about" className="hover:text-gray-900 transition-colors">{t('footer.about')}</Link></li>
              <li><Link href="/contact" className="hover:text-gray-900 transition-colors">{t('footer.contact')}</Link></li>
              <li><Link href="/careers" className="hover:text-gray-900 transition-colors">{t('footer.careers')}</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            © {new Date().getFullYear()} Lux. {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}