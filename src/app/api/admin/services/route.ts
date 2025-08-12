import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Supabase client with service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseServiceKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
}

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// GET - Fetch all services
export async function GET() {
  try {
    console.log('Fetching services from Supabase...');
    
    if (!supabase) {
      console.error('Supabase client not initialized - check environment variables');
      return NextResponse.json({ 
        error: 'Database connection not configured' 
      }, { status: 500 });
    }
    
    // Fetch services without joins first to avoid foreign key issues
    const { data: services, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching services:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(`Found ${services?.length || 0} services`);
    return NextResponse.json({ services: services || [] });
  } catch (error) {
    console.error('Error in GET /api/admin/services:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new service
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'title_en', 'title_es', 'description_en', 'description_es',
      'fixed_base_price', 'fixed_duration_minutes', 'category_id',
      'included_scope_en', 'included_scope_es'
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Prepare service data
    const serviceData = {
      title_en: body.title_en.trim(),
      title_es: body.title_es.trim(),
      description_en: body.description_en.trim(),
      description_es: body.description_es.trim(),
      fixed_base_price: parseInt(body.fixed_base_price), // Should be in cents
      fixed_duration_minutes: parseInt(body.fixed_duration_minutes),
      instant_book_enabled: Boolean(body.instant_book_enabled),
      category_id: body.category_id,
      included_scope_en: body.included_scope_en.trim(),
      included_scope_es: body.included_scope_es.trim(),
      max_area_sq_m: body.max_area_sq_m ? parseInt(body.max_area_sq_m) : null,
      auto_assign_strategy: body.auto_assign_strategy || 'nearest',
      photos: body.photos || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Validate category exists
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('id', serviceData.category_id)
      .single();

    if (categoryError || !category) {
      return NextResponse.json(
        { error: 'Invalid category ID' },
        { status: 400 }
      );
    }

    // Insert the service
    const { data: service, error: insertError } = await supabase
      .from('services')
      .insert([serviceData])
      .select()
      .single();

    if (insertError) {
      console.error('Error creating service:', insertError);
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Service created successfully',
      service 
    }, { status: 201 });

  } catch (error) {
    console.error('Error in POST /api/admin/services:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


