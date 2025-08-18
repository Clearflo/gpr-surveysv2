import { useState } from 'react';
import { uploadFile } from '../lib/storage';
import { MAX_FILE_SIZE, VALID_FILE_TYPES } from '../constants/contact';

interface FileState {
  files: File[];
  fileUrls: string[];
  isUploading: boolean;
  uploadError: string | null;
  isDragging: boolean;
}

export const useFileUpload = () => {
  const [fileState, setFileState] = useState<FileState>({
    files: [],
    fileUrls: [],
    isUploading: false,
    uploadError: null,
    isDragging: false
  });

  const validateFiles = (files: File[]): { valid: File[], error: string | null } => {
    const validFiles: File[] = [];
    let error: string | null = null;

    for (const file of files) {
      // Check file type
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const isDwgFile = fileExtension === 'dwg';
      
      if (!VALID_FILE_TYPES.includes(file.type) && !isDwgFile) {
        error = `Invalid file type: ${file.name}. Only PDF, Word, Excel, DWG, and images are allowed.`;
        break;
      }
      
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        error = `File too large: ${file.name}. Maximum size is 25MB.`;
        break;
      }
      
      validFiles.push(file);
    }

    return { valid: validFiles, error };
  };

  const processFiles = async (files: File[]) => {
    const { valid: validFiles, error } = validateFiles(files);
    
    if (error) {
      setFileState(prev => ({ ...prev, uploadError: error }));
      return [];
    }

    if (!validFiles.length) return [];

    setFileState(prev => ({
      ...prev,
      files: [...prev.files, ...validFiles],
      isUploading: true,
      uploadError: null
    }));

    try {
      const uploadPromises = validFiles.map(file => uploadFile(file));
      const urls = await Promise.all(uploadPromises);
      
      setFileState(prev => ({
        ...prev,
        fileUrls: [...prev.fileUrls, ...urls],
        isUploading: false
      }));
      
      return urls;
    } catch (error) {
      setFileState(prev => ({
        ...prev,
        isUploading: false,
        uploadError: 'Failed to upload files. Please try again or contact us directly.'
      }));
      return [];
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    await processFiles(Array.from(e.target.files));
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFileState(prev => ({ ...prev, isDragging: true }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!fileState.isDragging) {
      setFileState(prev => ({ ...prev, isDragging: true }));
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFileState(prev => ({ ...prev, isDragging: false }));
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setFileState(prev => ({ ...prev, isDragging: false }));

    const droppedFiles = Array.from(e.dataTransfer.files);
    await processFiles(droppedFiles);
  };

  const removeFile = (index: number) => {
    setFileState(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
      fileUrls: prev.fileUrls.filter((_, i) => i !== index)
    }));
  };

  const resetFiles = () => {
    setFileState({
      files: [],
      fileUrls: [],
      isUploading: false,
      uploadError: null,
      isDragging: false
    });
  };

  return {
    ...fileState,
    handleFileChange,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    removeFile,
    resetFiles
  };
};
