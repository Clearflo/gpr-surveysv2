import { useState, useCallback } from 'react';
import { uploadFile } from '../../lib/storage';
import { MAX_FILE_SIZE, ACCEPTED_FILE_TYPES } from '../../constants/booking';

interface FileUploadState {
  files: File[];
  uploading: boolean;
  error: string | null;
  isDragging: boolean;
}

interface UseFileUploadReturn {
  fileUpload: FileUploadState;
  processFiles: (files: File[]) => Promise<string[]>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleDragEnter: (e: React.DragEvent) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => Promise<void>;
  removeFile: (index: number, currentUrls: string[]) => string[];
  resetFileUpload: () => void;
}

const useFileUpload = (): UseFileUploadReturn => {
  const [fileUpload, setFileUpload] = useState<FileUploadState>({
    files: [],
    uploading: false,
    error: null,
    isDragging: false
  });

  const validateFiles = useCallback((files: File[]): File[] => {
    return files.filter(file => {
      // Check file type
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        setFileUpload(prev => ({
          ...prev,
          error: `Invalid file type: ${file.name}. Only PDF and images are allowed.`
        }));
        return false;
      }
      
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        setFileUpload(prev => ({
          ...prev,
          error: `File too large: ${file.name}. Maximum size is 25MB.`
        }));
        return false;
      }
      
      return true;
    });
  }, []);

  const processFiles = useCallback(async (files: File[]): Promise<string[]> => {
    const validFiles = validateFiles(files);
    
    if (!validFiles.length) return [];

    setFileUpload(prev => ({
      ...prev,
      files: [...prev.files, ...validFiles],
      uploading: true,
      error: null
    }));

    try {
      const uploadPromises = validFiles.map(file => uploadFile(file));
      const urls = await Promise.all(uploadPromises);
      
      setFileUpload(prev => ({
        ...prev,
        uploading: false
      }));
      
      return urls;
    } catch (error) {
      setFileUpload(prev => ({
        ...prev,
        uploading: false,
        error: 'Failed to upload files. Please try again or contact us directly.'
      }));
      return [];
    }
  }, [validateFiles]);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    await processFiles(Array.from(e.target.files));
  }, [processFiles]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFileUpload(prev => ({ ...prev, isDragging: true }));
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!fileUpload.isDragging) {
      setFileUpload(prev => ({ ...prev, isDragging: true }));
    }
  }, [fileUpload.isDragging]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFileUpload(prev => ({ ...prev, isDragging: false }));
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setFileUpload(prev => ({ ...prev, isDragging: false }));

    const droppedFiles = Array.from(e.dataTransfer.files);
    await processFiles(droppedFiles);
  }, [processFiles]);

  const removeFile = useCallback((index: number, currentUrls: string[]): string[] => {
    setFileUpload(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
    
    return currentUrls.filter((_, i) => i !== index);
  }, []);

  const resetFileUpload = useCallback(() => {
    setFileUpload({
      files: [],
      uploading: false,
      error: null,
      isDragging: false
    });
  }, []);

  return {
    fileUpload,
    processFiles,
    handleFileChange,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    removeFile,
    resetFileUpload
  };
};

export default useFileUpload;