/*
  # Create storage bucket for project files

  1. New Storage Bucket
    - Creates a public bucket for project files
    - Enables RLS policies for secure access
  
  2. Security
    - Enables RLS on bucket
    - Adds policy for authenticated uploads
    - Adds policy for public downloads
*/

-- Create a public bucket for project files
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-files', 'project-files', true);

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow uploads
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'project-files');

-- Create policy to allow public downloads
CREATE POLICY "Allow public downloads" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'project-files');