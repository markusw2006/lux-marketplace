-- Allow service role to insert bookings without customer authentication
-- This enables the booking API to create bookings during the payment flow

-- Drop the restrictive insert policy
DROP POLICY IF EXISTS "bookings insert by customer" ON bookings;

-- Create a new policy that allows both authenticated users and service role
CREATE POLICY "bookings insert" ON bookings
  FOR INSERT 
  WITH CHECK (
    -- Allow if user is authenticated and matches customer_id
    (auth.uid() = customer_id) 
    OR 
    -- Allow if using service role (for API endpoints)
    (auth.jwt() ->> 'role' = 'service_role')
    OR
    -- Allow if customer_id is null (for anonymous bookings during checkout)
    (customer_id IS NULL)
  );

-- Also create a select policy for anonymous bookings
CREATE POLICY "bookings select extended" ON bookings
  FOR SELECT 
  USING (
    -- Existing policies
    (customer_id = auth.uid() OR assigned_pro_id = auth.uid())
    OR
    -- Allow service role to read all bookings
    (auth.jwt() ->> 'role' = 'service_role')
  );

-- Drop and recreate the existing select policy to include service role
DROP POLICY IF EXISTS "bookings owner select" ON bookings;