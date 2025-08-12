import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase client with service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// GET - Check what tables exist in the database
export async function GET() {
  try {
    console.log('Checking database schema...');
    
    if (!supabase) {
      console.error('Supabase client not initialized - check environment variables');
      return NextResponse.json({ 
        error: 'Database connection not configured' 
      }, { status: 500 });
    }

    // Check which core tables exist by trying to query them
    const tableChecks = [
      'bookings',
      'services', 
      'profiles',
      'users',
      'pros',
      'transactions',
      'disputes',
      'reviews',
      'categories'
    ];

    const existingTables: string[] = [];
    const tableStructures: Record<string, string[]> = {};

    for (const tableName of tableChecks) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
        
        if (!error) {
          existingTables.push(tableName);
          if (data && data.length > 0) {
            tableStructures[tableName] = Object.keys(data[0]);
          }
        }
      } catch (e) {
        // Table doesn't exist
      }
    }

    console.log('Existing tables:', existingTables);
    
    return NextResponse.json({ 
      existingTables,
      tableStructures,
      message: `Found ${existingTables.length} tables out of ${tableChecks.length} expected`
    });

  } catch (error) {
    console.error('Error in GET /api/admin/schema:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}