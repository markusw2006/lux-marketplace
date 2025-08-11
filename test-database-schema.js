// Check the actual database schema and test insertion
const { createClient } = require('@supabase/supabase-js');

async function testDatabase() {
  console.log('🔍 Testing database connection and schema...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.log('❌ Missing environment variables');
    return;
  }
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    // Test 1: Check what columns exist in bookings table
    console.log('\n1️⃣ Checking bookings table schema...');
    const { data: schemaData, error: schemaError } = await supabase
      .rpc('exec', {
        sql: `
          SELECT column_name, data_type, is_nullable 
          FROM information_schema.columns 
          WHERE table_name = 'bookings' 
          AND table_schema = 'public'
          ORDER BY column_name;
        `
      });
    
    if (schemaError) {
      console.log('Schema check failed:', schemaError);
    } else {
      console.log('Bookings table columns:', schemaData);
    }
    
    // Test 2: Try a minimal insert with only required fields
    console.log('\n2️⃣ Testing minimal insert...');
    const minimalBooking = {
      service_id: 'basic-cleaning',
      status: 'booked'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('bookings')
      .insert(minimalBooking)
      .select();
    
    if (insertError) {
      console.log('❌ Insert failed:', insertError);
      console.log('Error details:', {
        code: insertError.code,
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint
      });
    } else {
      console.log('✅ Insert successful:', insertData);
    }
    
    // Test 3: Check current data in table
    console.log('\n3️⃣ Checking current bookings...');
    const { data: bookings, error: selectError } = await supabase
      .from('bookings')
      .select('*')
      .limit(5);
    
    if (selectError) {
      console.log('❌ Select failed:', selectError);
    } else {
      console.log('Current bookings:', bookings);
    }
    
  } catch (error) {
    console.log('💥 Test failed:', error.message);
  }
}

testDatabase();