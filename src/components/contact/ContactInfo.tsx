import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export const ContactInfo = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
      <div className="space-y-6">
        <div className="flex items-start">
          <Phone className="w-6 h-6 text-blue-900 mr-4" />
          <div>
            <h3 className="font-semibold text-gray-900">Phone</h3>
            <p className="text-gray-600">250-896-7576</p>
          </div>
        </div>
        <div className="flex items-start">
          <Mail className="w-6 h-6 text-blue-900 mr-4" />
          <div>
            <h3 className="font-semibold text-gray-900">Email</h3>
            <p className="text-gray-600">info@gprsurveys.ca</p>
          </div>
        </div>
        <div className="flex items-start">
          <MapPin className="w-6 h-6 text-blue-900 mr-4" />
          <div>
            <h3 className="font-semibold text-gray-900">Mailing Address</h3>
            <p className="text-gray-600">
              550-2950 Douglas St<br />
              Victoria BC V8T 4N4<br />
              <span className="text-sm italic">(Mailing address only)</span>
            </p>
          </div>
        </div>
        <div className="flex items-start">
          <Clock className="w-6 h-6 text-blue-900 mr-4" />
          <div>
            <h3 className="font-semibold text-gray-900">Business Hours</h3>
            <p className="text-gray-600">
              <span className="font-medium">Regular Business Hours</span><br />
              Monday - Friday: 8:00 AM - 5:00 PM<br /><br />
              <span className="font-medium">After Hours & Weekends</span><br />
              Contact us to schedule
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
