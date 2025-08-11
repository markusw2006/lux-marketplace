const { chromium } = require('playwright');

async function testBooking() {
  console.log('🚀 Starting booking test...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Listen for console logs
  page.on('console', msg => {
    console.log('📱 BROWSER:', msg.text());
  });

  // Listen for API calls
  page.on('request', request => {
    if (request.url().includes('/api/')) {
      console.log('🌐 API REQUEST:', request.method(), request.url());
    }
  });

  page.on('response', async response => {
    if (response.url().includes('/api/')) {
      const text = await response.text();
      console.log('📡 API RESPONSE:', response.status(), response.url());
      console.log('📄 RESPONSE BODY:', text);
    }
  });

  try {
    await page.goto('https://lux-marketplace.vercel.app/checkout/basic-cleaning?oven=1');
    await page.waitForLoadState('networkidle');
    
    // Quick form fill
    await page.fill('input[placeholder="Enter your full name"]', 'Test User');
    await page.fill('input[placeholder="Enter your email"]', 'test@test.com');
    await page.fill('input[placeholder="Enter your phone number"]', '555-1234');
    await page.fill('textarea[placeholder="Enter your complete address"]', 'Test Address');
    
    console.log('✅ Form filled, clicking submit...');
    
    // Click submit button
    await page.click('button[type="submit"]');
    
    // Wait a few seconds to see what happens
    await page.waitForTimeout(5000);
    
    console.log('📍 Final URL:', page.url());
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

testBooking();