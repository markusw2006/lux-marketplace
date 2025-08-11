'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/contexts/LocaleContext';
import { useAuth } from '@/contexts/AuthContext';
import LocaleSelector from './LocaleSelector';

export default function Header() {
  const { t } = useLocale();
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img src="/lux_logo.svg" alt="Lux" className="h-12 w-auto" />
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            <LocaleSelector />
            
            {user ? (
              // Authenticated user navigation
              <>
                <Link href="/customer/bookings" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                  {t('nav.bookings')}
                </Link>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{t('nav.welcome')}, {user.email}</span>
                  <button
                    onClick={handleSignOut}
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                  >
                    {t('nav.sign-out')}
                  </button>
                </div>
              </>
            ) : (
              // Unauthenticated user navigation
              <>
                <Link href="/become-a-pro" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                  {t('nav.become-pro')}
                </Link>
                <Link href="/login" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                  {t('nav.login')}
                </Link>
                <Link href="/signup" className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                  {t('nav.signup')}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}