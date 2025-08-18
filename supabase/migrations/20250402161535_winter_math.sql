/*
  # Add RLS policies for admin calendar operations
  
  1. Changes
    - Add UPDATE policy to allow public role to update bookings
    - Add DELETE policy to allow public role to delete bookings
    - These policies enable the admin calendar to function without authentication
    
  2. Security
    - Relies on admin code in the UI to restrict access
    - Works alongside existing RLS policies for INSERT and SELECT
*/

-- Add policy for updating bookings (public role)
CREATE POLICY "Allow public to update bookings" 
  ON public.bookings 
  FOR UPDATE 
  TO public 
  USING (true) 
  WITH CHECK (true);

-- Add policy for deleting bookings (public role)
CREATE POLICY "Allow public to delete bookings" 
  ON public.bookings 
  FOR DELETE 
  TO public 
  USING (true);