// Test and show exactly what's happening
async function debugBooking() {
  console.log('🔍 Testing booking with detailed debug info...');
  
  // Test 1: Check if booking API endpoint exists
  console.log('\n1️⃣ Testing if API endpoint exists...');
  try {
    const response = await fetch('https://lux-marketplace.vercel.app/api/bookings/instant', {
      method: 'GET' // This should return 405 Method Not Allowed but show endpoint exists
    });
    console.log('GET response:', response.status, response.statusText);
  } catch (e) {
    console.log('GET failed:', e.message);
  }
  
  // Test 2: Check bookings list API
  console.log('\n2️⃣ Testing bookings list API...');
  try {
    const response = await fetch('https://lux-marketplace.vercel.app/api/bookings');
    const data = await response.text();
    console.log('Bookings list status:', response.status);
    console.log('Bookings list response:', data);
  } catch (e) {
    console.log('Bookings list failed:', e.message);
  }
  
  // Test 3: Create a booking with minimal data
  console.log('\n3️⃣ Testing booking creation...');
  const testBooking = {
    serviceId: 'basic-cleaning',
    addons: {},
    customerInfo: {
      name: 'Debug Test',
      email: 'debug@test.com',
      phone: '123-456-7890',
      address: 'Debug Address 123'
    }
  };
  
  try {
    console.log('Sending booking data:', JSON.stringify(testBooking, null, 2));
    
    const response = await fetch('https://lux-marketplace.vercel.app/api/bookings/instant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testBooking)
    });
    
    const responseText = await response.text();
    console.log('Booking creation status:', response.status);
    console.log('Booking creation response:', responseText);
    
    // Test 4: Check if booking was created by listing again
    console.log('\n4️⃣ Checking if booking appeared in database...');
    const listResponse = await fetch('https://lux-marketplace.vercel.app/api/bookings');
    const listData = await response.text();
    console.log('Updated bookings list:', listData);
    
  } catch (e) {
    console.log('Booking creation failed:', e.message);
  }
}

debugBooking();