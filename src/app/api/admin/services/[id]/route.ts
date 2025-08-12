import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Supabase client with service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET - Fetch single service
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: service, error } = await supabase
      .from('services')
      .select(`
        *,
        categories!inner(
          id,
          name_en,
          name_es,
          slug
        )
      `)
      .eq('id', params.id)
      .single();

    if (error) {
      console.error('Error fetching service:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json({ service });
  } catch (error) {
    console.error('Error in GET /api/admin/services/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update service
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if service exists
    const { data: existingService, error: fetchError } = await supabase
      .from('services')
      .select('id')
      .eq('id', params.id)
      .single();

    if (fetchError || !existingService) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
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

    // Update the service
    const { data: service, error: updateError } = await supabase
      .from('services')
      .update(serviceData)
      .eq('id', params.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating service:', updateError);
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Service updated successfully',
      service 
    });

  } catch (error) {
    console.error('Error in PUT /api/admin/services/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete service
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if service exists
    const { data: existingService, error: fetchError } = await supabase
      .from('services')
      .select('id, title_en')
      .eq('id', params.id)
      .single();

    if (fetchError || !existingService) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    // Check if there are any active bookings for this service
    const { data: activeBookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('id')
      .eq('service_id', params.id)
      .in('status', ['booked', 'in_progress']);

    if (bookingsError) {
      console.error('Error checking bookings:', bookingsError);
      return NextResponse.json(
        { error: 'Error checking active bookings' },
        { status: 500 }
      );
    }

    if (activeBookings && activeBookings.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete service with active bookings' },
        { status: 400 }
      );
    }

    // Delete the service
    const { error: deleteError } = await supabase
      .from('services')
      .delete()
      .eq('id', params.id);

    if (deleteError) {
      console.error('Error deleting service:', deleteError);
      return NextResponse.json(
        { error: deleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Service deleted successfully'
    });

  } catch (error) {
    console.error('Error in DELETE /api/admin/services/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}