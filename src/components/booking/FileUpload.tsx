import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { MAX_FILE_SIZE, ACCEPTED_FILE_TYPES } from '../../constants/booking';
import { uploadFile } from '../../lib/storage';

interface FileUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  onUrlsChange: (urls: string[]) => void;
  disabled?: boolean;
}

interface FileUploadState {
  uploading: boolean;
  error: string | null;
  isDragging: boolean;
}

/**
 * File upload component with drag and drop support
 * Handles file validation, upload progress, and error states
 */
const FileUpload: React.FC<FileUploadProps> = ({
  files,
  onFilesChange,
  onUrlsChange,
  disabled = false
}) => {
  const [uploadState, setUploadState] = useState<FileUploadState>({
    uploading: false,
    error: null,
    isDragging: false
  });

  const validateFiles = (filesToValidate: File[]): File[] => {
    return filesToValidate.filter(file => {
      // Check file type
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        setUploadState(prev => ({
          ...prev,
          error: `Invalid file type: ${file.name}. Only PDF and images are allowed.`
        }));
        return false;
      }
      
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        setUploadState(prev => ({
          ...prev,
          error: `File too large: ${file.name}. Maximum size is 25MB.`
        }));
        return false;
      }
      
      return true;
    });
  };

  const processFiles = async (filesToProcess: File[]) => {
    const validFiles = validateFiles(filesToProcess);
    
    if (!validFiles.length) return;

    const newFiles = [...files, ...validFiles];
    onFilesChange(newFiles);

    setUploadState(prev => ({
      ...prev,
      uploading: true,
      error: null
    }));

    try {
      const uploadPromises = validFiles.map(file => uploadFile(file));
      const newUrls = await Promise.all(uploadPromises);
      
      // Get existing URLs from parent
      const currentUrls = files.slice(0, files.length - validFiles.length)
        .map((_, index) => ''); // Parent should maintain URL mapping
      
      onUrlsChange([...currentUrls, ...newUrls]);
      
      setUploadState(prev => ({
        ...prev,
        uploading: false
      }));
    } catch (error) {
      setUploadState(prev => ({
        ...prev,
        uploading: false,
        error: 'Failed to upload files. Please try again or contact us directly.'
      }));
      
      // Remove the files that failed to upload
      onFilesChange(files);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    await processFiles(Array.from(e.target.files));
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setUploadState(prev => ({ ...prev, isDragging: true }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!uploadState.isDragging) {
      setUploadState(prev => ({ ...prev, isDragging: true }));
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setUploadState(prev => ({ ...prev, isDragging: false }));
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setUploadState(prev => ({ ...prev, isDragging: false }));

    const droppedFiles = Array.from(e.dataTransfer.files);
    await processFiles(droppedFiles);
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
    
    // Parent should handle URL removal
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Site Plans (optional)
      </label>
      <div 
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${
          uploadState.isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 border-dashed hover:border-blue-500'
        } rounded-lg transition-colors duration-300`}
      >
        <div className="space-y-1 text-center">
          <Upload className={`mx-auto h-12 w-12 ${uploadState.isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer bg-white rounded-md font-medium text-blue-900 hover:text-blue-800 focus-within:outline-none"
            >
              <span>Upload files</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                multiple
                accept={ACCEPTED_FILE_TYPES}
                onChange={handleFileChange}
                disabled={disabled || uploadState.uploading}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">
            PDF, JPG, PNG up to 25MB each
          </p>
        </div>
      </div>
      
      {uploadState.error && (
        <p className="mt-2 text-sm text-red-600">{uploadState.error}</p>
      )}
      
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded"
            >
              <span className="text-gray-600 truncate flex-1">{file.name}</span>
              <span className="text-gray-500 ml-2">
                ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="ml-2 text-red-600 hover:text-red-800"
                disabled={disabled || uploadState.uploading}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {uploadState.uploading && (
        <div className="mt-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-900"></div>
          <span className="ml-2 text-sm text-gray-600">Uploading files...</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
