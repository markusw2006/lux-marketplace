import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Supabase client with service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET - Fetch all categories
export async function GET() {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name_en', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      
      // Return fallback categories if database fails
      const fallbackCategories = [
        { id: '1', name_en: 'Cleaning', name_es: 'Limpieza', slug: 'cleaning', parent_id: null },
        { id: '2', name_en: 'Plumbing', name_es: 'Plomería', slug: 'plumbing', parent_id: null },
        { id: '3', name_en: 'Electrical', name_es: 'Eléctrico', slug: 'electrical', parent_id: null },
        { id: '4', name_en: 'Handyman', name_es: 'Reparaciones', slug: 'handyman', parent_id: null },
        { id: '5', name_en: 'Pest Control', name_es: 'Control de Plagas', slug: 'pest-control', parent_id: null }
      ];
      
      return NextResponse.json({ categories: fallbackCategories });
    }

    return NextResponse.json({ categories: categories || [] });
  } catch (error) {
    console.error('Error in GET /api/admin/categories:', error);
    
    // Return fallback categories on error
    const fallbackCategories = [
      { id: '1', name_en: 'Cleaning', name_es: 'Limpieza', slug: 'cleaning', parent_id: null },
      { id: '2', name_en: 'Plumbing', name_es: 'Plomería', slug: 'plumbing', parent_id: null },
      { id: '3', name_en: 'Electrical', name_es: 'Eléctrico', slug: 'electrical', parent_id: null },
      { id: '4', name_en: 'Handyman', name_es: 'Reparaciones', slug: 'handyman', parent_id: null },
      { id: '5', name_en: 'Pest Control', name_es: 'Control de Plagas', slug: 'pest-control', parent_id: null }
    ];
    
    return NextResponse.json({ categories: fallbackCategories });
  }
}

// POST - Create new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name_en', 'name_es', 'slug'];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Prepare category data
    const categoryData = {
      name_en: body.name_en.trim(),
      name_es: body.name_es.trim(),
      slug: body.slug.trim().toLowerCase(),
      parent_id: body.parent_id || null
    };

    // Check if slug already exists
    const { data: existingCategory, error: checkError } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categoryData.slug)
      .single();

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this slug already exists' },
        { status: 400 }
      );
    }

    // Insert the category
    const { data: category, error: insertError } = await supabase
      .from('categories')
      .insert([categoryData])
      .select()
      .single();

    if (insertError) {
      console.error('Error creating category:', insertError);
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Category created successfully',
      category 
    }, { status: 201 });

  } catch (error) {
    console.error('Error in POST /api/admin/categories:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}