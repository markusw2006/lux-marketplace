import { createClient } from '@supabase/supabase-js';

// These would normally come from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Create clients only if URL and key are provided
let supabase: any = null;
let supabaseAdmin: any = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

if (supabaseUrl && supabaseServiceKey) {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
}

// Export clients (they will be null if not configured)
export { supabase, supabaseAdmin };

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: 'customer' | 'pro' | 'admin';
          first_name: string | null;
          last_name: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: 'customer' | 'pro' | 'admin';
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: 'customer' | 'pro' | 'admin';
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          category_slug: string;
          title_en: string;
          title_es: string;
          description_en: string | null;
          description_es: string | null;
          fixed_base_price: number;
          fixed_duration_minutes: number;
          instant_book_enabled: boolean;
          created_at: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          service_id: string;
          customer_id: string;
          pro_id: string | null;
          status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
          total_price: number;
          scheduled_at: string;
          address: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
};