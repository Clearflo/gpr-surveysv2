import React from 'react';
import { Upload, X } from 'lucide-react';
import { ACCEPTED_FILE_EXTENSIONS } from '../../constants/contact';

interface FileUploadProps {
  files: File[];
  isDragging: boolean;
  isSubmitting: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDragEnter: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onRemoveFile: (index: number) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  files,
  isDragging,
  isSubmitting,
  onFileChange,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDrop,
  onRemoveFile
}) => {
  return (
    <div>
      <label htmlFor="files" className="block text-sm font-medium text-gray-700 mb-1">
        Project Files (Optional)
      </label>
      <div 
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${
          isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 border-dashed hover:border-blue-500'
        } rounded-lg transition-colors duration-300`}
      >
        <div className="space-y-1 text-center">
          <Upload className={`mx-auto h-12 w-12 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor="files"
              className="relative cursor-pointer bg-white rounded-md font-medium text-blue-900 hover:text-blue-800 focus-within:outline-none"
            >
              <span>Upload files</span>
              <input
                id="files"
                name="files"
                type="file"
                className="sr-only"
                multiple
                onChange={onFileChange}
                accept={ACCEPTED_FILE_EXTENSIONS}
                disabled={isSubmitting}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">
            PDF, DOC, DWG, XLS, JPG, PNG up to 25MB each
          </p>
        </div>
      </div>
      
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
                onClick={() => onRemoveFile(index)}
                className="ml-2 text-red-600 hover:text-red-800"
                disabled={isSubmitting}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
