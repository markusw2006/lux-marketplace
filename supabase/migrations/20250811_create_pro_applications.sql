-- Create pro_applications table for storing professional service provider applications
CREATE TABLE pro_applications (
    id BIGSERIAL PRIMARY KEY,
    application_id TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    services TEXT[] NOT NULL DEFAULT '{}',
    experience TEXT NOT NULL,
    location TEXT NOT NULL DEFAULT 'Mexico City',
    has_license BOOLEAN DEFAULT FALSE,
    has_insurance BOOLEAN DEFAULT FALSE,
    has_vehicle BOOLEAN DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')),
    admin_notes TEXT,
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_pro_applications_application_id ON pro_applications(application_id);
CREATE INDEX idx_pro_applications_email ON pro_applications(email);
CREATE INDEX idx_pro_applications_status ON pro_applications(status);
CREATE INDEX idx_pro_applications_created_at ON pro_applications(created_at);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pro_applications_updated_at 
    BEFORE UPDATE ON pro_applications 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add Row Level Security (RLS)
ALTER TABLE pro_applications ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can see all applications
CREATE POLICY "Admins can view all pro applications" ON pro_applications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Policy: Admins can update applications
CREATE POLICY "Admins can update pro applications" ON pro_applications
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Policy: Anyone can insert applications (for the application form)
CREATE POLICY "Anyone can submit pro applications" ON pro_applications
    FOR INSERT WITH CHECK (true);

-- Add comment for documentation
COMMENT ON TABLE pro_applications IS 'Stores professional service provider applications with review status';