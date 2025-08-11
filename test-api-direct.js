// Test the booking API directly
async function testBookingAPI() {
  console.log('🚀 Testing booking API directly...');
  
  const bookingData = {
    serviceId: 'basic-cleaning',
    addons: { oven: 1 },
    windowStart: '2025-08-15T15:00:00.000Z',
    windowEnd: '2025-08-15T17:00:00.000Z',
    customerInfo: {
      name: 'Test Customer',
      email: 'test@example.com',
      phone: '+52 55 1234 5678',
      address: 'Test Address 123, Roma Norte, CDMX'
    }
  };
  
  try {
    console.log('📤 Sending request to booking API...');
    console.log('📋 Data:', JSON.stringify(bookingData, null, 2));
    
    const response = await fetch('https://lux-marketplace.vercel.app/api/bookings/instant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData)
    });
    
    console.log('📡 Response status:', response.status);
    
    const result = await response.text();
    console.log('📄 Response body:', result);
    
    if (response.ok) {
      console.log('✅ API call successful!');
    } else {
      console.log('❌ API call failed');
    }
    
  } catch (error) {
    console.error('💥 Error calling API:', error.message);
  }
}

testBookingAPI();