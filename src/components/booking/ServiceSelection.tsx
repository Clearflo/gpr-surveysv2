import React from 'react';
import { SERVICES } from '../../constants/services';
import { BookingFormData } from '../../types/form.types';
import BookingCalendar from '../BookingCalendar';
import FileUpload from './FileUpload';
import { Phone } from 'lucide-react';

interface ServiceSelectionProps {
  formData: BookingFormData;
  onFormDataChange: (data: Partial<BookingFormData>) => void;
  fileUploadState: {
    files: File[];
    onFilesChange: (files: File[]) => void;
    onUrlsChange: (urls: string[]) => void;
    disabled?: boolean;
  };
}

/**
 * Service Selection component - Step 1 of the booking form
 * Handles service type, date/time selection, project details, and file uploads
 */
const ServiceSelection: React.FC<ServiceSelectionProps> = ({
  formData,
  onFormDataChange,
  fileUploadState
}) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Service Type
        </label>
        <select
          value={formData.service}
          onChange={(e) => onFormDataChange({ service: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Select a service</option>
          {SERVICES.map((service) => (
            <option key={service.value} value={service.value}>
              {service.label}
            </option>
          ))}
        </select>
        
        {/* Special inquiries message */}
        <div className="mt-3 flex items-start">
          <Phone className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
          <p className="text-sm text-blue-600">
            For multi-day bookings, large civil projects, design phase locates, short-notice/emergency requests, and other special inquiries, please contact us directly.
            <span className="text-blue-600 ml-1">*Final invoice will reflect actual time on site</span>
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Date & Time
        </label>
        <BookingCalendar
          selectedDate={formData.date}
          onDateSelect={(date) => onFormDataChange({ date })}
          selectedTime={formData.booking_time}
          onTimeSelect={(time) => onFormDataChange({ booking_time: time })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Project Details
        </label>
        <textarea
          value={formData.project_details}
          onChange={(e) => onFormDataChange({ project_details: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Please provide any relevant details about your project..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          BC1 Call Number (if applicable)
        </label>
        <input
          type="text"
          value={formData.bc1_call_number}
          onChange={(e) => onFormDataChange({ bc1_call_number: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your BC1 call number"
        />
      </div>
      
      <FileUpload
        files={fileUploadState.files}
        onFilesChange={fileUploadState.onFilesChange}
        onUrlsChange={(urls) => {
          fileUploadState.onUrlsChange(urls);
          onFormDataChange({ site_plans: urls });
        }}
        disabled={fileUploadState.disabled}
      />
    </div>
  );
};

export default ServiceSelection;
