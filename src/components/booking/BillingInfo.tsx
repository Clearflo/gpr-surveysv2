import React from 'react';
import { Copy } from 'lucide-react';
import { BookingFormData } from '../../types/form.types';
import { PROVINCES } from '../../constants/locations';
import { PAYMENT_METHODS } from '../../constants/payment';

interface BillingInfoProps {
  formData: BookingFormData;
  setFormData: React.Dispatch<React.SetStateAction<BookingFormData>>;
}

/**
 * Billing Information component - Step 3 of the booking form
 * Includes both Customer and Billing fields
 * Features "Same as Site Contact" button to copy site info
 */
const BillingInfo: React.FC<BillingInfoProps> = ({
  formData,
  setFormData
}) => {
  const isValidEmail = (email: string) =>
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test((email || '').trim().toLowerCase());

  const emailValid = isValidEmail(formData.email);
  const billingEmailValid = isValidEmail(formData.billing_email);

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

  const billingPostalValid = isValidCanadianPostal(formData.billing_postal_code);

  // Handler to copy site contact information to customer/billing fields
  const handleSameAsSiteContact = () => {
    setFormData(prev => ({
      ...prev,
      // Copy site contact name to customer name
      first_name: prev.site_contact_first_name,
      last_name: prev.site_contact_last_name,
      // Copy site contact phone
      phone: prev.site_contact_phone,
      // Copy site contact email to both email fields if available
      email: prev.site_contact_email || prev.email,
      billing_email: prev.site_contact_email || prev.billing_email,
      // Copy address information
      billing_address_line1: prev.site_address_line1,
      billing_address_line2: prev.site_address_line2,
      billing_city: prev.site_city,
      billing_province: prev.site_province,
      billing_postal_code: prev.site_postal_code,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Customer Information Fields with Same as Site Contact Button */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Contact Information</h3>
          <button
            type="button"
            onClick={handleSameAsSiteContact}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-900 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Copy className="w-4 h-4" />
            Same as Site Contact
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              value={formData.first_name}
              onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
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
              onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name or Project Name
          </label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
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
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
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
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500 uppercase tracking-wider">Billing Details</span>
        </div>
      </div>

      {/* Billing Fields */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Billing Email
          </label>
          <input
            type="email"
            value={formData.billing_email}
            onChange={(e) => setFormData(prev => ({ ...prev, billing_email: e.target.value }))}
            className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${billingEmailValid ? 'border-gray-300' : 'border-red-500'}`}
            required
          />
          {!billingEmailValid && (
            <p className="mt-1 text-sm text-red-600">Please enter a valid billing email (e.g., billing@example.com).</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Billing Address Line 1
          </label>
          <input
            type="text"
            value={formData.billing_address_line1}
            onChange={(e) => setFormData(prev => ({ ...prev, billing_address_line1: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Billing Address Line 2 (optional)
          </label>
          <input
            type="text"
            value={formData.billing_address_line2}
            onChange={(e) => setFormData(prev => ({ ...prev, billing_address_line2: e.target.value }))}
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
              value={formData.billing_city}
              onChange={(e) => setFormData(prev => ({ ...prev, billing_city: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Province
            </label>
            <select
              value={formData.billing_province}
              onChange={(e) => setFormData(prev => ({ ...prev, billing_province: e.target.value }))}
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
              value={formData.billing_postal_code}
              onChange={(e) => setFormData(prev => ({ ...prev, billing_postal_code: formatCanadianPostal(e.target.value) }))}
              className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${billingPostalValid || !formData.billing_postal_code ? 'border-gray-300' : 'border-red-500'}`}
              required
              placeholder="A1A 1A1"
            />
            {(!billingPostalValid && !!formData.billing_postal_code) && (
              <p className="mt-1 text-sm text-red-600">Enter a valid Canadian postal code (e.g., A1A 1A1).</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Billing Instructions (optional)
          </label>
          <textarea
            value={formData.billing_instructions}
            onChange={(e) => setFormData(prev => ({ ...prev, billing_instructions: e.target.value }))}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Any special instructions for billing..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Method
          </label>
          <select
            value={formData.payment_method}
            onChange={(e) => setFormData(prev => ({ ...prev, payment_method: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Payment Method</option>
            {PAYMENT_METHODS.map((method) => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </select>
        </div>

        {formData.payment_method === 'purchase-order' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purchase Order Number
            </label>
            <input
              type="text"
              value={formData.purchase_order}
              onChange={(e) => setFormData(prev => ({ ...prev, purchase_order: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingInfo;
