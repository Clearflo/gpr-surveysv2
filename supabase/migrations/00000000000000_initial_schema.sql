/*
  # GPR Surveys Database Schema - Consolidated Migration
  
  This is a consolidated schema that combines all 31 previous migrations into a single file.
  Created on: 2025-06-10
  
  ## Tables:
  - customers: Customer information and billing details
  - bookings: Booking records with time slots
  - contact_submissions: Contact form submissions
  - estimate_requests: Online estimate requests
  
  ## Features:
  - Row Level Security (RLS) enabled on all tables
  - Time slot booking system (8 AM - 5 PM, 30-minute intervals)
  - One booking per day validation
  - Booking status tracking (pending, confirmed, completed, cancelled, rescheduled)
  - Admin blocking functionality
  - Updated timestamp triggers
  - Data validation constraints
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing objects to ensure clean state
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS contact_submissions CASCADE;
DROP TABLE IF EXISTS estimate_requests CASCADE;
DROP TYPE IF EXISTS booking_service CASCADE;

-- Create custom types
CREATE TYPE booking_service AS ENUM (
  'Underground Utility Detection',
  'Underground Storage Tank Detection',
  'Environmental Drilling Support',
  'Pre-Construction Locating',
  '3D Mapping & Asset Management',
  'Emergency Locate Services'
);

-- Create customers table
CREATE TABLE customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  company text,
  email text NOT NULL UNIQUE,
  phone text NOT NULL,
  billing_email text NOT NULL,
  billing_address_line1 text NOT NULL,
  billing_address_line2 text,
  billing_city text NOT NULL,
  billing_province text NOT NULL,
  billing_postal_code text NOT NULL,
  billing_country text NOT NULL DEFAULT 'Canada',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_billing_province CHECK (
    billing_province IN ('BC', 'AB', 'SK', 'MB', 'ON', 'QC', 'NB', 'NS', 'PE', 'NL', 'YT', 'NT', 'NU')
  ),
  CONSTRAINT valid_billing_postal_code CHECK (
    billing_postal_code ~ '^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$'
  ),
  CONSTRAINT valid_email_format CHECK (
    email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  ),
  CONSTRAINT valid_billing_email_format CHECK (
    billing_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  )
);

-- Create bookings table
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id),
  service booking_service NOT NULL,
  duration text NOT NULL,
  project_details text,
  bc1_call_number text,
  date date NOT NULL,
  start_time TIME, -- Time slot selection feature
  end_date date,
  site_contact_first_name text NOT NULL,
  site_contact_last_name text NOT NULL,
  site_contact_phone text NOT NULL,
  site_contact_email text,
  site_address_line1 text NOT NULL,
  site_address_line2 text,
  site_city text NOT NULL,
  site_province text NOT NULL,
  site_postal_code text NOT NULL,
  site_country text NOT NULL DEFAULT 'Canada',
  notes text,
  payment_method text NOT NULL,
  purchase_order text,
  status text NOT NULL DEFAULT 'pending',
  is_blocked boolean DEFAULT false,
  admin_code text,
  cancelled_at timestamptz,
  reschedule_link text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_duration CHECK (
    duration IN ('under-4', 'over-4')
  ),
  CONSTRAINT valid_payment_method CHECK (
    payment_method IN ('credit-card', 'cheque', 'e-transfer', 'purchase-order')
  ),
  CONSTRAINT valid_status CHECK (
    status IN ('pending', 'confirmed', 'completed', 'cancelled', 'rescheduled')
  ),
  CONSTRAINT valid_site_province CHECK (
    site_province IN ('BC', 'AB', 'SK', 'MB', 'ON', 'QC', 'NB', 'NS', 'PE', 'NL', 'YT', 'NT', 'NU')
  ),
  CONSTRAINT valid_site_postal_code CHECK (
    site_postal_code ~ '^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$'
  ),
  CONSTRAINT blocked_booking_requires_code CHECK (
    (is_blocked = false) OR (is_blocked = true AND admin_code = 'GPR2025BLOCK')
  ),
  CONSTRAINT valid_site_contact_email CHECK (
    site_contact_email IS NULL OR 
    site_contact_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  )
);

-- Create contact_submissions table
CREATE TABLE contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now(),
  processed boolean DEFAULT false,
  processed_at timestamptz,
  processed_by text,
  notes text,
  CONSTRAINT valid_email CHECK (
    email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  )
);

-- Create estimate_requests table
CREATE TABLE estimate_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  company text,
  service_type booking_service NOT NULL,
  project_location text NOT NULL,
  project_size text NOT NULL,
  project_timeline text NOT NULL,
  project_description text NOT NULL,
  budget_range text,
  additional_services text[],
  created_at timestamptz DEFAULT now(),
  processed boolean DEFAULT false,
  processed_at timestamptz,
  processed_by text,
  notes text,
  CONSTRAINT valid_email CHECK (
    email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  ),
  CONSTRAINT valid_project_size CHECK (
    project_size IN ('small', 'medium', 'large', 'extra-large')
  ),
  CONSTRAINT valid_budget_range CHECK (
    budget_range IS NULL OR budget_range IN ('under-5k', '5k-10k', '10k-25k', '25k-50k', 'over-50k')
  )
);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimate_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Customers policies
CREATE POLICY "Allow public to create customers"
  ON customers FOR INSERT TO public
  WITH CHECK (true);

CREATE POLICY "Allow public to read customers"
  ON customers FOR SELECT TO public
  USING (true);

-- Bookings policies
CREATE POLICY "Allow public to create bookings"
  ON bookings FOR INSERT TO public
  WITH CHECK (true);

CREATE POLICY "Allow public to read bookings"
  ON bookings FOR SELECT TO public
  USING (true);

CREATE POLICY "Allow public to update bookings"
  ON bookings FOR UPDATE TO public
  USING (true);

-- Contact submissions policies
CREATE POLICY "Allow public to create contact submissions"
  ON contact_submissions FOR INSERT TO public
  WITH CHECK (true);

CREATE POLICY "Allow public to read contact submissions"
  ON contact_submissions FOR SELECT TO public
  USING (true);

-- Estimate requests policies
CREATE POLICY "Allow public to create estimate requests"
  ON estimate_requests FOR INSERT TO public
  WITH CHECK (true);

CREATE POLICY "Allow public to read estimate requests"
  ON estimate_requests FOR SELECT TO public
  USING (true);

-- Create indexes for performance
CREATE INDEX idx_bookings_date ON bookings(date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_date_status ON bookings(date, status);
CREATE INDEX idx_bookings_created_at ON bookings(created_at);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_contact_submissions_processed ON contact_submissions(processed);
CREATE INDEX idx_contact_submissions_created ON contact_submissions(created_at);
CREATE INDEX idx_estimate_requests_processed ON estimate_requests(processed);
CREATE INDEX idx_estimate_requests_created ON estimate_requests(created_at);
CREATE INDEX idx_estimate_requests_service ON estimate_requests(service_type);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create booking availability check function (one booking per day)
CREATE OR REPLACE FUNCTION check_booking_availability()
RETURNS TRIGGER AS $$
DECLARE
  today date := CURRENT_DATE;
  tomorrow date := CURRENT_DATE + 1;
BEGIN
  -- Skip availability check for cancelled bookings
  IF NEW.status = 'cancelled' OR NEW.cancelled_at IS NOT NULL THEN
    RETURN NEW;
  END IF;
  
  -- Skip availability check for reschedule operations
  IF TG_OP = 'UPDATE' AND NEW.status = 'rescheduled' THEN
    RETURN NEW;
  END IF;

  -- Skip checks for admin-blocked bookings
  IF NEW.is_blocked = true AND NEW.admin_code = 'GPR2025BLOCK' THEN
    RETURN NEW;
  END IF;

  -- Check if booking date is at least tomorrow (no same-day bookings)
  IF NEW.date <= today THEN
    RAISE EXCEPTION 'Bookings must be made at least one day in advance (tomorrow or later)';
  END IF;

  -- Check if the date is blocked
  IF EXISTS (
    SELECT 1 FROM bookings 
    WHERE date = NEW.date 
    AND is_blocked = true
    AND status != 'cancelled'
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000')
  ) THEN
    RAISE EXCEPTION 'Date % is blocked and unavailable for booking', NEW.date;
  END IF;

  -- Check if date already has a booking (only one per day allowed)
  IF EXISTS (
    SELECT 1 FROM bookings 
    WHERE date = NEW.date 
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000')
    AND status != 'cancelled'
    AND cancelled_at IS NULL
  ) THEN
    RAISE EXCEPTION 'Date % already has a booking. Only one booking allowed per day.', NEW.date;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for booking availability
CREATE TRIGGER check_booking_availability_trigger
  BEFORE INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION check_booking_availability();

-- Comments for documentation
COMMENT ON TABLE customers IS 'Stores customer information including billing details';
COMMENT ON TABLE bookings IS 'Stores booking information with time slot selection';
COMMENT ON TABLE contact_submissions IS 'Stores contact form submissions from the website';
COMMENT ON TABLE estimate_requests IS 'Stores online estimate request forms';
COMMENT ON COLUMN bookings.start_time IS 'The scheduled start time for the booking (8 AM - 5 PM in 30-minute intervals)';
COMMENT ON COLUMN bookings.cancelled_at IS 'Timestamp when booking was cancelled';
COMMENT ON COLUMN bookings.reschedule_link IS 'Unique link for customers to reschedule their booking';
COMMENT ON COLUMN bookings.is_blocked IS 'Admin flag to block a date from new bookings';
COMMENT ON COLUMN bookings.admin_code IS 'Code required to create admin-blocked bookings';
