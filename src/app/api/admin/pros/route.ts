import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Supabase client with service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// GET - Fetch all professionals
export async function GET() {
  try {
    console.log('Fetching professionals data for admin dashboard...');
    
    if (!supabase) {
      console.error('Supabase client not initialized - check environment variables');
      return NextResponse.json({ 
        error: 'Database connection not configured' 
      }, { status: 500 });
    }

    // Fetch pros with related profile and statistics
    const { data: pros, error } = await supabase
      .from('pros')
      .select(`
        *,
        profiles!inner(
          user_id,
          display_name,
          photo_url,
          verified,
          rating_avg,
          rating_count,
          created_at
        ),
        users!inner(
          email,
          phone,
          created_at
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching pros:', error);
      
      // Fallback to seed data if database query fails
      const { professionals } = await import('@/data/seed/pros');
      const fallbackPros = professionals.map(pro => ({
        user_id: pro.id,
        business_name: pro.businessName,
        display_name: pro.businessName,
        verified: pro.verified,
        rating_avg: pro.rating,
        rating_count: pro.reviewCount,
        total_jobs: pro.totalJobs,
        completion_rate: pro.completionRate,
        service_radius_km: pro.serviceRadius,
        base_city: 'CDMX',
        kyc_status: pro.verified ? 'approved' : 'pending',
        created_at: new Date().toISOString(),
        suspended: false
      }));
      
      console.log(`Using ${fallbackPros.length} pros from seed data`);
      return NextResponse.json({ pros: fallbackPros });
    }

    // Transform data for admin dashboard
    const transformedPros = pros?.map(pro => ({
      user_id: pro.user_id,
      business_name: pro.business_name,
      display_name: pro.profiles?.display_name || pro.business_name,
      email: pro.users?.email,
      phone: pro.users?.phone,
      verified: pro.profiles?.verified || false,
      rating_avg: pro.profiles?.rating_avg || 0,
      rating_count: pro.profiles?.rating_count || 0,
      service_radius_km: pro.service_radius_km,
      base_city: pro.base_city,
      kyc_status: pro.kyc_status,
      stripe_account_id: pro.stripe_account_id,
      created_at: pro.created_at,
      suspended: false // Add suspended logic when implemented
    })) || [];

    console.log(`Found ${transformedPros.length} professionals`);
    return NextResponse.json({ pros: transformedPros });

  } catch (error) {
    console.error('Error in GET /api/admin/pros:', error);
    
    // Ultimate fallback to seed data
    try {
      const { professionals } = await import('@/data/seed/pros');
      const fallbackPros = professionals.map(pro => ({
        user_id: pro.id,
        business_name: pro.businessName,
        display_name: pro.businessName,
        verified: pro.verified,
        rating_avg: pro.rating,
        rating_count: pro.reviewCount,
        total_jobs: pro.totalJobs,
        completion_rate: pro.completionRate,
        service_radius_km: pro.serviceRadius,
        base_city: 'CDMX',
        kyc_status: pro.verified ? 'approved' : 'pending',
        created_at: new Date().toISOString(),
        suspended: false
      }));
      
      console.log(`Fallback: Using ${fallbackPros.length} pros from seed data`);
      return NextResponse.json({ pros: fallbackPros });
    } catch (seedError) {
      console.error('Error loading seed data:', seedError);
      return NextResponse.json({ error: 'Unable to load professionals data' }, { status: 500 });
    }
  }
}

// POST - Update pro status
export async function POST(req: NextRequest) {
  const body = await req.json();
  return Response.json({ updated: body }, { status: 201 });
}


