/*
  # Add job number generation
  
  1. New Tables
    - `job_numbers`
      - `id` (uuid, primary key)
      - `number` (integer) - Sequential number for job
      - `year` (integer) - Year of job
      - `created_at` (timestamptz)
  
  2. Changes
    - Add job_number column to bookings table
    - Add trigger to auto-generate job numbers
    - Add function to get next job number
    
  3. Security
    - Maintains existing RLS policies
*/

-- Create job_numbers table to track the sequence
CREATE TABLE job_numbers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number integer NOT NULL,
  year integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (number, year)
);

-- Add job_number column to bookings
ALTER TABLE bookings
ADD COLUMN job_number text;

-- Function to get next job number
CREATE OR REPLACE FUNCTION get_next_job_number()
RETURNS text AS $$
DECLARE
  current_year integer;
  next_number integer;
  job_num text;
BEGIN
  -- Get current year (last 2 digits)
  current_year := date_part('year', CURRENT_DATE)::integer % 100;
  
  -- Get the next number for this year
  SELECT COALESCE(MAX(number), 0) + 1
  INTO next_number
  FROM job_numbers
  WHERE year = current_year;
  
  -- Insert the new number
  INSERT INTO job_numbers (number, year)
  VALUES (next_number, current_year);
  
  -- Format as J25001 (for year 2025, first job)
  job_num := 'J' || current_year || LPAD(next_number::text, 3, '0');
  
  RETURN job_num;
END;
$$ LANGUAGE plpgsql;

-- Create trigger function to assign job number
CREATE OR REPLACE FUNCTION assign_job_number()
RETURNS TRIGGER AS $$
BEGIN
  -- Only assign job number if it's not already set and this isn't a blocked booking
  IF NEW.job_number IS NULL AND (NEW.is_blocked IS NULL OR NEW.is_blocked = false) THEN
    NEW.job_number := get_next_job_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-assign job numbers
CREATE TRIGGER assign_job_number_trigger
  BEFORE INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION assign_job_number();

-- Create index for job number lookups
CREATE INDEX idx_bookings_job_number ON bookings(job_number);