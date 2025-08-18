/*
  # Add billing instructions field
  
  1. Changes
    - Add billing_instructions column to customers table
    - Add billing_instructions to existing validation
    
  2. Security
    - Maintains existing RLS policies
*/

-- Add billing_instructions column
ALTER TABLE customers 
ADD COLUMN billing_instructions text;