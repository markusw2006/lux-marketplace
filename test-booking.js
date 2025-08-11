const { chromium } = require('playwright');

async function testBooking() {
  console.log('🚀 Starting booking test...');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Listen for console logs from the page
  page.on('console', msg => {
    console.log('📱 Browser console:', msg.text());
  });

  // Listen for network requests
  page.on('request', request => {
    if (request.url().includes('/api/bookings')) {
      console.log('🌐 API Request:', request.url(), request.method());
    }
  });

  page.on('response', response => {
    if (response.url().includes('/api/bookings')) {
      console.log('📡 API Response:', response.url(), response.status());
      response.text().then(text => {
        console.log('📄 Response body:', text);
      });
    }
  });

  try {
    // Navigate to checkout page
    console.log('🏃 Navigating to checkout page...');
    await page.goto('https://lux-marketplace.vercel.app/checkout/basic-cleaning?oven=1&date=2025-08-15&time=11%3A00+AM+-+1%3A00+PM&pro=clean-team-polanco');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    console.log('✅ Page loaded');

    // Fill out the form
    console.log('📝 Filling out form...');
    await page.fill('input[placeholder="Enter your full name"]', 'Test Customer');
    await page.fill('input[placeholder="Enter your email"]', 'test@example.com');
    await page.fill('input[placeholder="Enter your phone number"]', '+52 55 1234 5678');
    await page.fill('textarea[placeholder="Enter your complete address"]', 'Test Address 123, Roma Norte, CDMX');
    
    console.log('✅ Form filled out');

    // Find and click the Complete Booking button
    console.log('🔍 Looking for Complete Booking button...');
    const submitButton = await page.locator('button[type="submit"]').first();
    await submitButton.waitFor({ state: 'visible' });
    
    console.log('🖱️ Clicking Complete Booking button...');
    await submitButton.click();

    // Wait for the booking process
    console.log('⏳ Waiting for booking to process...');
    
    // Wait for either redirect or error
    await Promise.race([
      page.waitForURL('**/booking-confirmed**', { timeout: 10000 }),
      page.waitForSelector('.bg-red-50', { timeout: 10000 }) // Error message
    ]);

    // Check current URL
    const currentUrl = page.url();
    console.log('📍 Current URL:', currentUrl);

    if (currentUrl.includes('booking-confirmed')) {
      console.log('🎉 SUCCESS: Redirected to booking confirmation page!');
    } else {
      console.log('❌ Did not redirect to confirmation page');
      
      // Check for errors
      const errorMessage = await page.locator('.bg-red-50').textContent().catch(() => null);
      if (errorMessage) {
        console.log('🚨 Error message:', errorMessage);
      }
    }

    // Wait a bit to see final logs
    await page.waitForTimeout(2000);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    console.log('🏁 Closing browser...');
    await browser.close();
  }
}

// Run the test
testBooking().catch(console.error);