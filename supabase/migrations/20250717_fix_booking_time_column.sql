-- Ensure booking_time column exists and is properly configured
-- This migration ensures the booking_time field is correctly set up for the booking system

-- First, check if booking_time column exists and add it if it doesn't
DO $$ 
BEGIN
    -- Check if booking_time column exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'bookings' 
        AND column_name = 'booking_time'
    ) THEN
        -- Add booking_time column if it doesn't exist
        ALTER TABLE bookings ADD COLUMN booking_time TIME;
        
        -- If start_time exists, copy its values to booking_time
        IF EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'bookings' 
            AND column_name = 'start_time'
        ) THEN
            UPDATE bookings SET booking_time = start_time::TIME WHERE start_time IS NOT NULL;
            -- Drop start_time column
            ALTER TABLE bookings DROP COLUMN start_time;
        END IF;
    END IF;
    
    -- Add comment to explain the field
    COMMENT ON COLUMN bookings.booking_time IS 'The specific time of the booking in HH:MM format';
END $$;

-- Ensure customer_email and customer_phone columns exist for tracking
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'bookings' 
        AND column_name = 'customer_email'
    ) THEN
        ALTER TABLE bookings ADD COLUMN customer_email TEXT;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'bookings' 
        AND column_name = 'customer_phone'
    ) THEN
        ALTER TABLE bookings ADD COLUMN customer_phone TEXT;
    END IF;
END $$;

-- Add job_number column if it doesn't exist (for tracking purposes)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'bookings' 
        AND column_name = 'job_number'
    ) THEN
        ALTER TABLE bookings ADD COLUMN job_number TEXT;
    END IF;
END $$;

-- Create or update the job number generation function
CREATE OR REPLACE FUNCTION generate_job_number()
RETURNS TRIGGER AS $$
BEGIN
    -- Generate job number in format: GPR-YYYYMMDD-XXXX
    IF NEW.job_number IS NULL THEN
        NEW.job_number := 'GPR-' || TO_CHAR(NEW.created_at, 'YYYYMMDD') || '-' || 
                         LPAD(
                             (SELECT COALESCE(MAX(CAST(SUBSTR(job_number, 14) AS INTEGER)), 0) + 1
                              FROM bookings 
                              WHERE job_number LIKE 'GPR-' || TO_CHAR(NEW.created_at, 'YYYYMMDD') || '-%')::TEXT, 
                             4, '0'
                         );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for job number generation if it doesn't exist
DROP TRIGGER IF EXISTS generate_job_number_trigger ON bookings;
CREATE TRIGGER generate_job_number_trigger
    BEFORE INSERT ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION generate_job_number();
