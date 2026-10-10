-- Migration 007: Enquiries table (contact-us form) + sales contact per property.
-- Safe to run more than once.

-- 1. Enquiries table (contact-us form now saves here, not in "clients")
CREATE TABLE IF NOT EXISTS enquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    interest_area VARCHAR(100) NOT NULL DEFAULT 'General Inquiry',
    message TEXT,
    source VARCHAR(50) DEFAULT 'Contact Us Form',
    status VARCHAR(20) NOT NULL DEFAULT 'New',      -- New | Contacted | Closed
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);

ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- Visitors (not logged in) can submit the form, but cannot read anything
DROP POLICY IF EXISTS "Anyone can submit an enquiry" ON enquiries;
CREATE POLICY "Anyone can submit an enquiry" ON enquiries
    FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Only logged-in admins can view / update / delete enquiries
DROP POLICY IF EXISTS "Admins can read enquiries" ON enquiries;
CREATE POLICY "Admins can read enquiries" ON enquiries
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admins can update enquiries" ON enquiries;
CREATE POLICY "Admins can update enquiries" ON enquiries
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can delete enquiries" ON enquiries;
CREATE POLICY "Admins can delete enquiries" ON enquiries
    FOR DELETE TO authenticated USING (true);

GRANT INSERT ON enquiries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON enquiries TO authenticated;

-- 2. Sales person handling a property / project (shown on the website with a call button)
ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS sales_person_name text,
  ADD COLUMN IF NOT EXISTS builder text,
  ADD COLUMN IF NOT EXISTS contact_number text;

COMMENT ON COLUMN properties.sales_person_name IS 'Sales member handling this property/project';
COMMENT ON COLUMN properties.contact_number IS 'Direct number of the sales member for this property/project';
