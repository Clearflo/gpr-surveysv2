import React, { useState } from 'react';
import { contactServices } from '../../constants/contact';
import { FileUpload } from './FileUpload';
import { useFileUpload } from '../../hooks/useFileUpload';

interface ContactFormProps {
  onSuccess?: () => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    files,
    fileUrls,
    isDragging,
    uploadError,
    handleFileChange,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    removeFile,
    resetFiles
  } = useFileUpload();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Create webhookData object with all form fields and file URLs
      const webhookData = {
        // Contact Info
        firstName: formData.firstName,
        lastName: formData.lastName,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        
        // Service Details
        service: formData.service,
        message: formData.message,
        
        // Files (URLs for HTTP module in make.com)
        projectFiles: fileUrls,
        fileCount: fileUrls.length,
        filesUploaded: fileUrls.length > 0,
        
        // Timestamp
        submittedAt: new Date().toISOString()
      };

      // Send to webhook
      const response = await fetch('https://hook.us2.make.com/rv1cj93vot34iug5j316xdnuqxgjbhxx', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      // Reset form on success
      setFormData({
        firstName: '',
        lastName: '',
        company: '',
        email: '',
        phone: '',
        service: '',
        message: ''
      });
      resetFiles();
      setIsSuccess(true);

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }

      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);

    } catch (error) {
      setError('Failed to submit form. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      {isSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          Thank you for your message! We'll get back to you shortly.
        </div>
      )}
      {(error || uploadError) && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error || uploadError}
        </div>
      )}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Get a Quote</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="Enter your last name"
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
            Company Name
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
            Service Needed
          </label>
          <select
            id="service"
            name="service"
            value={formData.service}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select a service</option>
            {contactServices.map((service) => (
              <option key={service.id} value={service.id}>
                {service.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Project Details
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          ></textarea>
        </div>

        <FileUpload
          files={files}
          isDragging={isDragging}
          isSubmitting={isSubmitting}
          onFileChange={handleFileChange}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onRemoveFile={removeFile}
        />

        <button
          type="submit"
          className={`w-full bg-blue-900 text-white py-3 px-6 rounded-md hover:bg-blue-800 transition duration-300 flex items-center justify-center ${
            isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></span>
              Submitting...
            </>
          ) : (
            'Submit Request'
          )}
        </button>
      </form>
    </div>
  );
};
