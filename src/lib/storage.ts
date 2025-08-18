import { supabase } from './supabase';

/**
 * Sanitizes a filename by removing invalid characters
 * Replaces any non-alphanumeric characters (except dots, underscores, and hyphens) with underscores
 * 
 * @param {string} filename - The filename to sanitize
 * @returns {string} Sanitized filename safe for storage
 * 
 * @example
 * sanitizeFilename('my file@#$.pdf') // Returns: 'my_file___.pdf'
 */
function sanitizeFilename(filename: string): string {
  // Remove any path traversal characters and invalid chars
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
}

/**
 * Lists files in the 'project-files' bucket and returns public URLs.
 * Sorted by name desc by default (filenames include timestamp for rough recency)
 */
export async function listProjectFiles(limit = 50): Promise<{ name: string; url: string }[]> {
  const { data, error } = await supabase.storage
    .from('project-files')
    .list('', { limit, sortBy: { column: 'name', order: 'desc' } });

  if (error) throw error;

  return (data || []).map((f) => {
    const { data: pub } = supabase.storage.from('project-files').getPublicUrl(f.name);
    return { name: f.name, url: pub.publicUrl };
  });
}

/**
 * Uploads a file to Supabase storage and returns the public URL
 * Files are stored in the 'project-files' bucket with sanitized, unique filenames
 * 
 * @param {File} file - The file object to upload
 * @returns {Promise<string>} Public URL of the uploaded file
 * @throws {Error} If upload fails or storage error occurs
 * 
 * @example
 * const file = new File(['content'], 'example.pdf', { type: 'application/pdf' });
 * const url = await uploadFile(file);
 * console.log('File uploaded to:', url);
 */
export async function uploadFile(file: File): Promise<string> {
  try {
    const fileExt = file.name.split('.').pop();
    const originalName = file.name.slice(0, -(fileExt?.length || 0) - 1);
    const sanitizedName = sanitizeFilename(originalName);
    
    // Create filename that preserves original name while ensuring uniqueness
    const fileName = `${sanitizedName}_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { error } = await supabase.storage
      .from('project-files')
      .upload(fileName, file);

    if (error) throw error;

    // Get public URL for the file
    const { data: { publicUrl } } = supabase.storage
      .from('project-files')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}
