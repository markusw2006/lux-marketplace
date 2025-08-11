// Test the direct insert endpoint
async function testDirectInsert() {
  console.log('🧪 Testing direct insert endpoint...');
  
  try {
    const response = await fetch('https://lux-marketplace.vercel.app/api/test-insert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    const result = await response.text();
    console.log('📡 Response status:', response.status);
    console.log('📄 Response body:', result);
    
  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}

testDirectInsert();