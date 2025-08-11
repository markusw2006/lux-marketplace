-- Enhanced Professional Profiles System
-- This migration enhances the existing professional_profiles table and adds related tables

-- Drop existing professional_profiles table to recreate with enhanced schema
DROP TABLE IF EXISTS public.professional_profiles CASCADE;

-- Create enhanced professional profiles table
CREATE TABLE public.professional_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
  
  -- Basic Profile Info
  business_name TEXT,
  bio TEXT,
  tagline TEXT, -- Short description like "Expert Plumber - 10+ Years Experience"
  profile_photo_url TEXT,
  
  -- Professional Details
  experience_years INTEGER DEFAULT 0,
  license_number TEXT,
  insurance_verified BOOLEAN DEFAULT false,
  background_check_verified BOOLEAN DEFAULT false,
  
  -- Service & Location Info
  service_areas TEXT[], -- array of service category slugs they offer
  service_radius_km INTEGER DEFAULT 20, -- how far they travel
  base_location JSONB, -- {address, lat, lng, alcaldia}
  
  -- Ratings & Performance
  verified BOOLEAN DEFAULT false,
  rating_avg DECIMAL(3,2) DEFAULT 0.00,
  rating_count INTEGER DEFAULT 0,
  total_jobs INTEGER DEFAULT 0,
  completion_rate DECIMAL(3,2) DEFAULT 0.00,
  response_time_minutes INTEGER DEFAULT 60, -- average response time
  
  -- Pricing & Availability
  hourly_rate_cents INTEGER, -- their standard hourly rate in centavos
  minimum_job_fee_cents INTEGER DEFAULT 0,
  availability_schedule JSONB, -- weekly schedule {monday: {start: "09:00", end: "17:00", available: true}}
  
  -- Business Info
  tax_id TEXT, -- RFC for Mexico
  stripe_account_id TEXT, -- for Stripe Connect
  bank_info_complete BOOLEAN DEFAULT false,
  
  -- Status
  profile_status TEXT CHECK (profile_status IN ('incomplete', 'pending_review', 'active', 'suspended')) DEFAULT 'incomplete',
  active BOOLEAN DEFAULT true,
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create professional portfolio table for work samples
CREATE TABLE public.professional_portfolio (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  professional_id UUID REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  description TEXT,
  category_slug TEXT, -- which service category this relates to
  
  -- Media
  image_urls TEXT[], -- array of image URLs
  before_after_images JSONB, -- {before: [urls], after: [urls]}
  
  -- Job Details
  job_date DATE,
  client_location_area TEXT, -- general area like "Roma Norte" for privacy
  project_duration_hours INTEGER,
  approximate_cost_cents INTEGER,
  
  -- Display Settings
  featured BOOLEAN DEFAULT false, -- show prominently on profile
  visible BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create professional certifications table
CREATE TABLE public.professional_certifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  professional_id UUID REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL, -- "Licensed Electrician", "Certified Plumber", etc.
  issuing_organization TEXT,
  certification_number TEXT,
  issue_date DATE,
  expiry_date DATE,
  
  -- Verification
  verified BOOLEAN DEFAULT false,
  verification_document_url TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create professional reviews table (separate from general reviews)
CREATE TABLE public.professional_reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  professional_id UUID REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Rating & Feedback
  overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5) NOT NULL,
  quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
  punctuality_rating INTEGER CHECK (punctuality_rating >= 1 AND punctuality_rating <= 5),
  communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
  
  -- Review Content
  title TEXT,
  comment TEXT,
  
  -- Professional Response
  professional_response TEXT,
  professional_response_date TIMESTAMP WITH TIME ZONE,
  
  -- Moderation
  visible BOOLEAN DEFAULT true,
  flagged BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create professional availability blocks table
CREATE TABLE public.professional_availability (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  professional_id UUID REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
  
  -- Time Block
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  
  -- Availability Type
  availability_type TEXT CHECK (availability_type IN ('available', 'booked', 'blocked', 'break')) DEFAULT 'available',
  
  -- Booking Reference
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  
  -- Notes
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create professional service offerings table (custom pricing per service)
CREATE TABLE public.professional_services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  professional_id UUID REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  
  -- Custom Pricing
  custom_base_price_cents INTEGER, -- if different from service default
  price_modifier_percent DECIMAL(5,2) DEFAULT 0.00, -- +/- percentage from base price
  
  -- Availability
  available BOOLEAN DEFAULT true,
  minimum_notice_hours INTEGER DEFAULT 24,
  
  -- Custom Service Details
  custom_description TEXT,
  estimated_duration_minutes INTEGER,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  UNIQUE(professional_id, service_id)
);

-- Add RLS policies
ALTER TABLE public.professional_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_services ENABLE ROW LEVEL SECURITY;

-- Professional profiles policies
CREATE POLICY "Anyone can view active professional profiles" ON public.professional_profiles 
  FOR SELECT USING (profile_status = 'active' AND active = true);

CREATE POLICY "Professionals can view and update own profile" ON public.professional_profiles 
  FOR ALL USING (auth.uid() = user_id);

-- Portfolio policies  
CREATE POLICY "Anyone can view visible portfolio items" ON public.professional_portfolio 
  FOR SELECT USING (visible = true);

CREATE POLICY "Professionals can manage own portfolio" ON public.professional_portfolio 
  FOR ALL USING (
    professional_id IN (
      SELECT id FROM public.professional_profiles WHERE user_id = auth.uid()
    )
  );

-- Certifications policies
CREATE POLICY "Anyone can view verified certifications" ON public.professional_certifications 
  FOR SELECT USING (verified = true);

CREATE POLICY "Professionals can manage own certifications" ON public.professional_certifications 
  FOR ALL USING (
    professional_id IN (
      SELECT id FROM public.professional_profiles WHERE user_id = auth.uid()
    )
  );

-- Reviews policies
CREATE POLICY "Anyone can view visible reviews" ON public.professional_reviews 
  FOR SELECT USING (visible = true AND flagged = false);

CREATE POLICY "Customers can create reviews for their bookings" ON public.professional_reviews 
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Professionals can respond to their reviews" ON public.professional_reviews 
  FOR UPDATE USING (
    professional_id IN (
      SELECT id FROM public.professional_profiles WHERE user_id = auth.uid()
    )
  );

-- Availability policies
CREATE POLICY "Professionals can manage own availability" ON public.professional_availability 
  FOR ALL USING (
    professional_id IN (
      SELECT id FROM public.professional_profiles WHERE user_id = auth.uid()
    )
  );

-- Professional services policies
CREATE POLICY "Anyone can view professional service offerings" ON public.professional_services 
  FOR SELECT USING (available = true);

CREATE POLICY "Professionals can manage own service offerings" ON public.professional_services 
  FOR ALL USING (
    professional_id IN (
      SELECT id FROM public.professional_profiles WHERE user_id = auth.uid()
    )
  );

-- Add updated_at triggers
CREATE TRIGGER update_professional_profiles_updated_at 
  BEFORE UPDATE ON public.professional_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_professional_reviews_updated_at 
  BEFORE UPDATE ON public.professional_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_professional_services_updated_at 
  BEFORE UPDATE ON public.professional_services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_professional_profiles_user_id ON public.professional_profiles(user_id);
CREATE INDEX idx_professional_profiles_status ON public.professional_profiles(profile_status);
CREATE INDEX idx_professional_profiles_location ON public.professional_profiles USING GIN (base_location);
CREATE INDEX idx_professional_profiles_service_areas ON public.professional_profiles USING GIN (service_areas);

CREATE INDEX idx_professional_portfolio_professional_id ON public.professional_portfolio(professional_id);
CREATE INDEX idx_professional_portfolio_category ON public.professional_portfolio(category_slug);
CREATE INDEX idx_professional_portfolio_featured ON public.professional_portfolio(featured) WHERE featured = true;

CREATE INDEX idx_professional_reviews_professional_id ON public.professional_reviews(professional_id);
CREATE INDEX idx_professional_reviews_rating ON public.professional_reviews(overall_rating);
CREATE INDEX idx_professional_reviews_visible ON public.professional_reviews(visible) WHERE visible = true;

CREATE INDEX idx_professional_availability_professional_id ON public.professional_availability(professional_id);
CREATE INDEX idx_professional_availability_date ON public.professional_availability(date);

CREATE INDEX idx_professional_services_professional_id ON public.professional_services(professional_id);
CREATE INDEX idx_professional_services_service_id ON public.professional_services(service_id);

-- Function to update professional rating when reviews change
CREATE OR REPLACE FUNCTION update_professional_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.professional_profiles
  SET 
    rating_avg = (
      SELECT AVG(overall_rating)::DECIMAL(3,2)
      FROM public.professional_reviews
      WHERE professional_id = NEW.professional_id AND visible = true AND flagged = false
    ),
    rating_count = (
      SELECT COUNT(*)
      FROM public.professional_reviews
      WHERE professional_id = NEW.professional_id AND visible = true AND flagged = false
    )
  WHERE id = NEW.professional_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update ratings when reviews are added/updated
CREATE TRIGGER update_professional_rating_on_review_change
  AFTER INSERT OR UPDATE ON public.professional_reviews
  FOR EACH ROW EXECUTE FUNCTION update_professional_rating();