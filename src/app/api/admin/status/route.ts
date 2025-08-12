import { NextResponse } from 'next/server';

// Simple status check to debug dashboard loading issues
export async function GET() {
  console.log('Status check endpoint called...');
  
  return NextResponse.json({
    message: 'Admin API endpoints are working',
    timestamp: new Date().toISOString(),
    availableEndpoints: [
      '/api/admin/bookings',
      '/api/admin/pros', 
      '/api/admin/customers',
      '/api/admin/disputes',
      '/api/admin/reviews'
    ]
  });
}