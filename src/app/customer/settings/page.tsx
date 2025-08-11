'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CustomerSettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    street: '',
    colonia: '',
    alcaldia: '',
    city: 'Mexico City',
    state: 'Mexico City',
    postalCode: ''
  });

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      const fullName = user.user_metadata?.name || user.user_metadata?.full_name || '';
      const nameParts = fullName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      // Parse address if it exists
      const savedAddress = user.user_metadata?.address || '';
      const addressParts = savedAddress.split(',').map(part => part.trim());
      
      setFormData({
        firstName,
        lastName,
        phone: user.user_metadata?.phone || '',
        street: addressParts[0] || '',
        colonia: addressParts[1] || '',
        alcaldia: addressParts[2] || '',
        city: 'Ciudad de México',
        state: 'CDMX',
        postalCode: addressParts[3] || ''
      });
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
      // In a real app, this would update the user's profile via API
      // For now, we'll simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
              Welcome, {formData.firstName || user?.user_metadata?.name?.split(' ')[0] || user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Customer'}
            </h1>
            <p className="text-sm text-gray-600">Manage your profile information</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Profile Information</h2>

            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                Profile updated successfully!
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
                  Email Address
                </label>
                <input
                  type="email"
                  value={user.email || ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed. Contact support if you need to update your email.
                </p>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    placeholder="First name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    placeholder="Last name"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  placeholder="Enter your phone number"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Used for booking confirmations and communication with professionals
                </p>
              </div>

              {/* Address Section */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Default Service Address
                </label>
                
                <div className="space-y-4">
                  {/* Street Address */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      value={formData.street}
                      onChange={(e) => handleInputChange('street', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                      placeholder="e.g. Av. Insurgentes Sur 123, Int. 4B"
                      required
                    />
                  </div>

                  {/* Colonia and Alcaldía */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Neighborhood *
                      </label>
                      <input
                        type="text"
                        value={formData.colonia}
                        onChange={(e) => handleInputChange('colonia', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                        placeholder="e.g. Roma Norte"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Borough *
                      </label>
                      <select
                        value={formData.alcaldia}
                        onChange={(e) => handleInputChange('alcaldia', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                        required
                      >
                        <option value="">Select Borough</option>
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
                        City
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
                        State
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
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                        placeholder="06700"
                        maxLength={5}
                        pattern="[0-9]{5}"
                        required
                      />
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  This will be your default address for service bookings. You can change it for individual bookings.
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <Link
                    href="/customer/bookings"
                    className="text-sm text-gray-600 hover:text-gray-900 underline"
                  >
                    Cancel
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
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Additional Settings */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Account Actions</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Change Password</h3>
                  <p className="text-xs text-gray-500">Update your account password</p>
                </div>
                <button className="text-sm text-gray-600 hover:text-gray-900 underline">
                  Change
                </button>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                  <p className="text-xs text-gray-500">Manage your notification preferences</p>
                </div>
                <button className="text-sm text-gray-600 hover:text-gray-900 underline">
                  Manage
                </button>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="text-sm font-medium text-red-600">Delete Account</h3>
                  <p className="text-xs text-gray-500">Permanently delete your account and data</p>
                </div>
                <button className="text-sm text-red-600 hover:text-red-700 underline">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}