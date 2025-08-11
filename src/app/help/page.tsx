export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Help Center</h1>
          
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Getting Started</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">1. Browse Services</h3>
                  <p className="text-sm text-gray-600">Explore our catalog of instant-book services with transparent pricing.</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">2. Choose Your Professional</h3>
                  <p className="text-sm text-gray-600">Select from verified professionals in your area.</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">3. Book & Pay</h3>
                  <p className="text-sm text-gray-600">Schedule your service and pay securely online.</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">4. Service Completed</h3>
                  <p className="text-sm text-gray-600">Professional completes the job to your satisfaction.</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Service Categories</h2>
              <div className="space-y-3">
                <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                  <div className="text-2xl mr-3">🧹</div>
                  <div>
                    <h3 className="font-medium text-gray-900">Cleaning Services</h3>
                    <p className="text-sm text-gray-600">Home cleaning, deep cleaning, post-construction cleanup</p>
                  </div>
                </div>
                <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                  <div className="text-2xl mr-3">🔧</div>
                  <div>
                    <h3 className="font-medium text-gray-900">Handyman Services</h3>
                    <p className="text-sm text-gray-600">Repairs, installations, furniture assembly</p>
                  </div>
                </div>
                <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                  <div className="text-2xl mr-3">⚡</div>
                  <div>
                    <h3 className="font-medium text-gray-900">Electrical Work</h3>
                    <p className="text-sm text-gray-600">Light fixtures, outlets, basic electrical repairs</p>
                  </div>
                </div>
                <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                  <div className="text-2xl mr-3">🎨</div>
                  <div>
                    <h3 className="font-medium text-gray-900">Painting</h3>
                    <p className="text-sm text-gray-600">Interior painting, touch-ups, color consultation</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Pricing & Payment</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-medium text-blue-900 mb-3">Transparent Pricing</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Fixed prices shown upfront - no surprises</li>
                  <li>• Optional add-ons clearly priced</li>
                  <li>• Secure payment processing through Stripe</li>
                  <li>• Payment held until service completion</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}