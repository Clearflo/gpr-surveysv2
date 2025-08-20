import React from 'react';
import { BookingFormData } from '../../types/form.types';
import { PROVINCES } from '../../constants/locations';

interface SiteInfoProps {
  formData: BookingFormData;
  onFormDataChange: (data: Partial<BookingFormData>) => void;
}

/**
 * Site Information component - Step 4 of the booking form
 * Collects site contact information, site location details, and additional notes
 */
const SiteInfo: React.FC<SiteInfoProps> = ({
  formData,
  onFormDataChange
}) => {
  // Canadian postal code helpers
  const formatCanadianPostal = (value: string): string => {
    const alnum = (value || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    const first = alnum.slice(0, 3);
    const second = alnum.slice(3, 6);
    return second ? `${first} ${second}` : first;
  };

  const isValidCanadianPostal = (value: string): boolean => {
    const v = (value || '').toUpperCase().trim();
    return /^[A-Z]\d[A-Z] \d[A-Z]\d$/.test(v);
  };

  const sitePostalValid = isValidCanadianPostal(formData.site_postal_code);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Site Contact First Name
          </label>
          <input
            type="text"
            value={formData.site_contact_first_name}
            onChange={(e) => onFormDataChange({ site_contact_first_name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Site Contact Last Name
          </label>
          <input
            type="text"
            value={formData.site_contact_last_name}
            onChange={(e) => onFormDataChange({ site_contact_last_name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Site Contact Phone
          </label>
          <input
            type="tel"
            value={formData.site_contact_phone}
            onChange={(e) => onFormDataChange({ site_contact_phone: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Site Contact Email (optional)
          </label>
          <input
            type="email"
            value={formData.site_contact_email}
            onChange={(e) => onFormDataChange({ site_contact_email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Site Address Line 1
        </label>
        <input
          type="text"
          value={formData.site_address_line1}
          onChange={(e) => onFormDataChange({ site_address_line1: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Site Address Line 2 (optional)
        </label>
        <input
          type="text"
          value={formData.site_address_line2}
          onChange={(e) => onFormDataChange({ site_address_line2: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            type="text"
            value={formData.site_city}
            onChange={(e) => onFormDataChange({ site_city: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Province
          </label>
          <select
            value={formData.site_province}
            onChange={(e) => onFormDataChange({ site_province: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Province</option>
            {PROVINCES.map((province) => (
              <option key={province.value} value={province.value}>
                {province.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Postal Code
          </label>
          <input
            type="text"
            value={formData.site_postal_code}
            onChange={(e) => onFormDataChange({ site_postal_code: formatCanadianPostal(e.target.value) })}
            className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${sitePostalValid || !formData.site_postal_code ? 'border-gray-300' : 'border-red-500'}`}
            required
            placeholder="A1A 1A1"
          />
          {(!sitePostalValid && !!formData.site_postal_code) && (
            <p className="mt-1 text-sm text-red-600">Enter a valid Canadian postal code (e.g., A1A 1A1).</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Additional Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => onFormDataChange({ notes: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Please include any additional project notes, such as meeting, location, gates, or access codes, and any site-specific or public sensitivities"
        />
      </div>
    </div>
  );
};

export default SiteInfo;
