'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/contexts/LocaleContext';
import Link from 'next/link';
import PasswordInput from '@/components/PasswordInput';

export default function CustomerSettingsPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { t, locale, setLocale } = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  
  // Delete account state
  const [deleteData, setDeleteData] = useState({
    password: '',
    confirmationText: ''
  });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    street: '',
    colonia: '',
    alcaldia: '',
    city: 'Ciudad de México',
    state: 'CDMX',
    postalCode: ''
  });

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      // Check for saved profile data in localStorage first
      const savedProfile = localStorage.getItem(`profile_${user.id}`);
      let profileData;
      
      if (savedProfile) {
        profileData = JSON.parse(savedProfile);
        setFormData(profileData);
      } else {
        // Fallback to user metadata
        const fullName = user.user_metadata?.name || user.user_metadata?.full_name || '';
        const nameParts = fullName.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        // Parse address if it exists
        const savedAddress = user.user_metadata?.address || '';
        const addressParts = savedAddress.split(',').map(part => part.trim());
        
        const defaultData = {
          firstName,
          lastName,
          phone: user.user_metadata?.phone || '',
          street: addressParts[0] || '',
          colonia: addressParts[1] || '',
          alcaldia: addressParts[2] || '',
          city: 'Ciudad de México',
          state: 'CDMX',
          postalCode: addressParts[3] || ''
        };
        
        setFormData(defaultData);
      }
    }
  }, [user]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/customer/settings');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update profile');
      }
      
      // Save profile data to localStorage for persistence
      if (user) {
        localStorage.setItem(`profile_${user.id}`, JSON.stringify(formData));
      }
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Password change handlers
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError(t('settings.modal.passwords-dont-match'));
      setPasswordLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError(t('settings.modal.password-requirements'));
      setPasswordLoading(false);
      return;
    }

    try {
      console.log('Making password change request...');
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      console.log('Response received:', response.status, response.statusText);
      
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      let result;
      try {
        result = JSON.parse(responseText);
        console.log('Parsed result:', result);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Response text was:', responseText);
        throw new Error(`Invalid response format: ${responseText}`);
      }

      if (!response.ok) {
        console.error('Request failed with status:', response.status);
        throw new Error(result.error || 'Failed to change password');
      }

      setPasswordSuccess(true);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => {
        setPasswordSuccess(false);
        setShowPasswordModal(false);
      }, 2000);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Delete account handlers
  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeleteLoading(true);
    setDeleteError(null);

    try {
      const response = await fetch('/api/auth/delete-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: deleteData.password,
          confirmationText: deleteData.confirmationText,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete account');
      }

      // Clear localStorage
      if (user) {
        localStorage.removeItem(`profile_${user.id}`);
      }
      localStorage.clear();

      // Sign out and redirect
      await signOut();
      alert(t('settings.modal.account-deleted'));
      router.push('/');
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete account');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {t('settings.welcome')}, {formData.firstName || user?.user_metadata?.name?.split(' ')[0] || user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Customer'}
            </h1>
            <p className="text-sm text-gray-600">{t('nav.customer')}</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">{t('settings.profile-info')}</h2>

            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {t('settings.profile-updated')}
              </div>
            )}

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email (read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  {t('settings.email')}
                </label>
                <input
                  type="email"
                  value={user.email || ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {t('settings.email.note')}
                </p>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    {t('settings.first-name')} *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    placeholder={t('settings.first-name')}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    {t('settings.last-name')} *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    placeholder={t('settings.last-name')}
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  {t('settings.phone')}
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  placeholder={t('settings.phone')}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {t('settings.phone.note')}
                </p>
              </div>

              {/* Address Section */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  {t('address.default-service')}
                </label>
                
                <div className="space-y-4">
                  {/* Street Address */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      {t('address.street')} *
                    </label>
                    <input
                      type="text"
                      value={formData.street}
                      onChange={(e) => handleInputChange('street', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                      placeholder={t('address.street.placeholder')}
                      required
                    />
                  </div>

                  {/* Colonia and Alcaldía */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {t('address.neighborhood')} *
                      </label>
                      <input
                        type="text"
                        value={formData.colonia}
                        onChange={(e) => handleInputChange('colonia', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                        placeholder={t('address.neighborhood.placeholder')}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {t('address.borough')} *
                      </label>
                      <select
                        value={formData.alcaldia}
                        onChange={(e) => handleInputChange('alcaldia', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                        required
                      >
                        <option value="">{t('address.borough.placeholder')}</option>
                        <option value="Álvaro Obregón">Álvaro Obregón</option>
                        <option value="Azcapotzalco">Azcapotzalco</option>
                        <option value="Benito Juárez">Benito Juárez (Roma, Condesa)</option>
                        <option value="Coyoacán">Coyoacán</option>
                        <option value="Cuajimalpa de Morelos">Cuajimalpa de Morelos</option>
                        <option value="Cuauhtémoc">Cuauhtémoc (Centro, Zona Rosa)</option>
                        <option value="Gustavo A. Madero">Gustavo A. Madero</option>
                        <option value="Iztacalco">Iztacalco</option>
                        <option value="Iztapalapa">Iztapalapa</option>
                        <option value="La Magdalena Contreras">La Magdalena Contreras</option>
                        <option value="Miguel Hidalgo">Miguel Hidalgo (Polanco, Santa Fe)</option>
                        <option value="Milpa Alta">Milpa Alta</option>
                        <option value="Tláhuac">Tláhuac</option>
                        <option value="Tlalpan">Tlalpan</option>
                        <option value="Venustiano Carranza">Venustiano Carranza</option>
                        <option value="Xochimilco">Xochimilco</option>
                      </select>
                    </div>
                  </div>

                  {/* City, State and Postal Code */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {t('address.city')}
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-gray-50"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {t('address.state')}
                      </label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-gray-50"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {t('address.postal-code')} *
                      </label>
                      <input
                        type="text"
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                        placeholder={t('address.postal-code.placeholder')}
                        maxLength={5}
                        pattern="[0-9]{5}"
                        required
                      />
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  {t('address.default-service.note')}
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <Link
                    href="/customer/bookings"
                    className="text-sm text-gray-600 hover:text-gray-900 underline"
                  >
                    {t('settings.cancel')}
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      loading
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    {loading ? t('settings.saving') : t('settings.save-changes')}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Language Settings */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">{t('settings.language-preference')}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  {t('settings.change-language')}
                </label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setLocale('en')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      locale === 'en'
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {t('settings.english')}
                  </button>
                  <button
                    onClick={() => setLocale('es')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      locale === 'es'
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {t('settings.spanish')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Settings */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">{t('settings.account-actions')}</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{t('settings.change-password')}</h3>
                  <p className="text-xs text-gray-500">{t('settings.change-password.desc')}</p>
                </div>
                <button 
                  onClick={() => setShowPasswordModal(true)}
                  className="text-sm text-gray-600 hover:text-gray-900 underline"
                >
                  {t('settings.change')}
                </button>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{t('settings.email-notifications')}</h3>
                  <p className="text-xs text-gray-500">{t('settings.email-notifications.desc')}</p>
                </div>
                <button className="text-sm text-gray-600 hover:text-gray-900 underline">
                  {t('settings.manage')}
                </button>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="text-sm font-medium text-red-600">{t('settings.delete-account')}</h3>
                  <p className="text-xs text-gray-500">{t('settings.delete-account.desc')}</p>
                </div>
                <button 
                  onClick={() => setShowDeleteModal(true)}
                  className="text-sm text-red-600 hover:text-red-700 underline"
                >
                  {t('settings.delete')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowPasswordModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{t('settings.modal.change-password')}</h3>
                </div>
                
                {passwordSuccess && (
                  <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                    {t('settings.modal.password-changed')}
                  </div>
                )}

                {passwordError && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {passwordError}
                  </div>
                )}
                
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <PasswordInput
                      value={passwordData.currentPassword}
                      onChange={(value) => setPasswordData(prev => ({ ...prev, currentPassword: value }))}
                      label={t('settings.modal.current-password')}
                      required
                    />
                  </div>
                  
                  <div>
                    <PasswordInput
                      value={passwordData.newPassword}
                      onChange={(value) => setPasswordData(prev => ({ ...prev, newPassword: value }))}
                      label={t('settings.modal.new-password')}
                      required
                      minLength={6}
                    />
                    <p className="text-xs text-gray-500 mt-1">{t('settings.modal.password-requirements')}</p>
                  </div>
                  
                  <div>
                    <PasswordInput
                      value={passwordData.confirmPassword}
                      onChange={(value) => setPasswordData(prev => ({ ...prev, confirmPassword: value }))}
                      label={t('settings.modal.confirm-new-password')}
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowPasswordModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      {t('settings.cancel')}
                    </button>
                    <button
                      type="submit"
                      disabled={passwordLoading}
                      className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
                        passwordLoading 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-gray-900 hover:bg-gray-800'
                      }`}
                    >
                      {passwordLoading ? t('settings.saving') : t('settings.modal.confirm')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowDeleteModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-red-600">{t('settings.modal.delete-account')}</h3>
                </div>
                
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-800">{t('settings.modal.delete-warning')}</p>
                    </div>
                  </div>
                </div>

                {deleteError && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {deleteError}
                  </div>
                )}
                
                <form onSubmit={handleDeleteAccount} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('settings.modal.delete-confirmation')}
                    </label>
                    <input
                      type="text"
                      value={deleteData.confirmationText}
                      onChange={(e) => setDeleteData(prev => ({ ...prev, confirmationText: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="DELETE MY ACCOUNT"
                      required
                    />
                  </div>
                  
                  <div>
                    <PasswordInput
                      value={deleteData.password}
                      onChange={(value) => setDeleteData(prev => ({ ...prev, password: value }))}
                      label={t('settings.modal.delete-password')}
                      required
                      className="focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowDeleteModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      {t('settings.cancel')}
                    </button>
                    <button
                      type="submit"
                      disabled={deleteLoading || deleteData.confirmationText !== 'DELETE MY ACCOUNT'}
                      className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
                        deleteLoading || deleteData.confirmationText !== 'DELETE MY ACCOUNT'
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      {deleteLoading ? t('settings.saving') : t('settings.delete')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}