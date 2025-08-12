import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Supabase client with service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// GET - Fetch all reviews
export async function GET() {
  try {
    console.log('Fetching reviews data for admin dashboard...');
    
    if (!supabase) {
      console.error('Supabase client not initialized - check environment variables');
      return NextResponse.json({ 
        error: 'Database connection not configured' 
      }, { status: 500 });
    }

    // Try to fetch reviews - table may not exist yet
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select(`
        *,
        bookings!inner(
          id,
          service_id,
          services(
            title_en
          )
        ),
        rater:profiles!rater_id(
          display_name
        ),
        ratee:profiles!ratee_id(
          display_name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      // If reviews table doesn't exist or has errors, return empty array
      console.log('Reviews table not available or no reviews found:', error.message);
      return NextResponse.json({ reviews: [] });
    }

    // Transform reviews data
    const transformedReviews = reviews?.map(review => ({
      id: review.id,
      booking_id: review.booking_id,
      service_title: review.bookings?.services?.title_en || 'Unknown Service',
      rater_name: review.rater?.display_name || 'Anonymous',
      ratee_name: review.ratee?.display_name || 'Unknown Professional',
      stars: review.stars,
      comment: review.comment,
      created_at: review.created_at,
      hidden: false // TODO: Add moderation functionality
    })) || [];

    console.log(`Found ${transformedReviews.length} reviews`);
    return NextResponse.json({ reviews: transformedReviews });

  } catch (error) {
    console.error('Error in GET /api/admin/reviews:', error);
    // Return empty array if there's any error (table likely doesn't exist yet)
    return NextResponse.json({ reviews: [] });
  }
}

// POST - Moderate review (for future implementation)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!supabase) {
      return NextResponse.json({ 
        error: 'Database connection not configured' 
      }, { status: 500 });
    }

    // TODO: Implement review moderation when reviews table is ready
    const moderationData = {
      review_id: body.review_id,
      action: body.action, // 'hide', 'show', 'flag'
      moderator_notes: body.notes,
      moderated_at: new Date().toISOString()
    };

    return NextResponse.json({ 
      message: 'Review moderation not yet implemented',
      moderation: moderationData 
    });

  } catch (error) {
    console.error('Error in POST /api/admin/reviews:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}