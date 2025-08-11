// Check what services exist and their ID format
async function checkServices() {
  console.log('🔍 Checking services in the system...');
  
  try {
    // Test the pricing library to see service IDs
    const { getServiceById } = require('./src/lib/pricing.js');
    
    const testService = getServiceById('basic-cleaning');
    console.log('Service by ID "basic-cleaning":', testService);
    
    const testService2 = getServiceById('1');
    console.log('Service by ID "1":', testService2);
    
  } catch (e) {
    console.log('Error checking services:', e.message);
  }
}

checkServices();