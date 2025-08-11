export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Contact Support</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Get in Touch</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">Email</h3>
                  <p className="text-gray-600">support@lux-marketplace.com</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Phone</h3>
                  <p className="text-gray-600">+52 55 1234 5678</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">WhatsApp</h3>
                  <p className="text-gray-600">+52 55 1234 5678</p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Help</h2>
              <div className="space-y-3">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-1">Booking Issues</h3>
                  <p className="text-sm text-gray-600">Problems with scheduling or payments</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-1">Service Quality</h3>
                  <p className="text-sm text-gray-600">Feedback about completed services</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-1">Account Support</h3>
                  <p className="text-sm text-gray-600">Profile and billing questions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}