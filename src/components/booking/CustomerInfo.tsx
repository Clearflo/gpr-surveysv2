import React from 'react';
import { BookingFormData } from '../../types/form.types';

interface CustomerInfoProps {
  formData: BookingFormData;
  onFormDataChange: (data: Partial<BookingFormData>) => void;
}

/**
 * Customer Information component - Step 2 of the booking form
 * Collects customer contact details and company information
 */
const CustomerInfo: React.FC<CustomerInfoProps> = ({
  formData,
  onFormDataChange
}) => {
  const isValidEmail = (email: string) =>
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test((email || '').trim().toLowerCase());

  const emailValid = isValidEmail(formData.email);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            type="text"
            value={formData.first_name}
            onChange={(e) => onFormDataChange({ first_name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            type="text"
            value={formData.last_name}
            onChange={(e) => onFormDataChange({ last_name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Company Name (optional)
        </label>
        <input
          type="text"
          value={formData.company}
          onChange={(e) => onFormDataChange({ company: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => onFormDataChange({ email: e.target.value })}
          className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${emailValid ? 'border-gray-300' : 'border-red-500'}`}
          required
        />
        {!emailValid && (
          <p className="mt-1 text-sm text-red-600">Please enter a valid email (e.g., name@example.com).</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => onFormDataChange({ phone: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
    </div>
  );
};

export default CustomerInfo;
