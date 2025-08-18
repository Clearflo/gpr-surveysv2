/*
  # Clean up unused tables and components

  1. Changes
    - Drop employees table and related components
    - Remove unused policies and triggers
    - Clean up any orphaned functions
*/

-- Drop employees table if it exists
DROP TABLE IF EXISTS employees;

-- Clean up any orphaned functions
DROP FUNCTION IF EXISTS update_employees_updated_at CASCADE;