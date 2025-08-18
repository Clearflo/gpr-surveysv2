import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Edit, AlertCircle, Upload } from 'lucide-react';
import TimeWheel from './ui/TimeWheel';
import { formatDate } from './booking-calendar/calendarUtils';
import { uploadFile } from '../lib/storage';
import type { Database } from '../types/database.types';

type Booking = Database['public']['Tables']['bookings']['Row'];

interface BookingDetailsModalProps {
  bookings: Booking[];
  onClose: () => void;
  onCancel: (booking: Booking, reason: string) => Promise<void>;
  onEdit: (booking: Booking, updates: Partial<Booking>, fileUrls?: string[]) => Promise<void>;
  onUnblock?: (booking: Booking) => Promise<void>;
}

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  bookings,
  onClose,
  onCancel,
  onEdit,
  onUnblock
}) => {
  const navigate = useNavigate();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [fileInput, setFileInput] = useState<FileList | null>(null);
  const [fileUrlsText, setFileUrlsText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('Cancelled by admin');
  // editable fields (site contact and location + project details)
  const [siteFirst, setSiteFirst] = useState('');
  const [siteLast, setSiteLast] = useState('');
  const [sitePhone, setSitePhone] = useState('');
  const [siteEmail, setSiteEmail] = useState('');
  const [addr1, setAddr1] = useState('');
  const [addr2, setAddr2] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postal, setPostal] = useState('');
  const [projectDetails, setProjectDetails] = useState('');

  // Ensure we always have a selected booking when modal opens or bookings list changes
  useEffect(() => {
    if (!selectedBooking) {
      setSelectedBooking(bookings[0] ?? null);
    } else {
      // If the selected booking is no longer in the list (e.g., cancelled or edited away), fall back to first
      const stillExists = bookings.some(b => b.id === selectedBooking.id);
      if (!stillExists) setSelectedBooking(bookings[0] ?? null);
    }
  }, [bookings, selectedBooking]);

  // Seed edit fields whenever the selected booking changes
  useEffect(() => {
    if (!selectedBooking) return;
    const b = selectedBooking;
    setNewDate(b.date ?? '');
    const maybeTime = (b as unknown as Record<string, unknown>).booking_time;
    setNewTime(typeof maybeTime === 'string' && maybeTime.trim() !== '' ? maybeTime : '');
    const existingFiles = Array.isArray((b as any).site_plans) ? (b as any).site_plans as string[] : [];
    setFileUrlsText(existingFiles.join('\n'));
    // seed editable fields
    setSiteFirst(b.site_contact_first_name || '');
    setSiteLast(b.site_contact_last_name || '');
    setSitePhone(b.site_contact_phone || '');
    setSiteEmail(b.site_contact_email || '');
    setAddr1(b.site_address_line1 || '');
    setAddr2(b.site_address_line2 || '');
    setCity(b.site_city || '');
    setProvince(b.site_province || '');
    setPostal(b.site_postal_code || '');
    setProjectDetails(b.project_details || '');
  }, [selectedBooking]);

  const handleCancel = async () => {
    if (!selectedBooking) return;
    
    if (!confirmingCancel) {
      setConfirmingCancel(true);
      return;
    }
    
    if (cancellationReason.trim() === '') {
      setError('Please provide a cancellation reason');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      await onCancel(selectedBooking, cancellationReason);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel booking');
    } finally {
      setIsLoading(false);
      setConfirmingCancel(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedBooking) return;
    setIsLoading(true);
    setError(null);
    try {
      const updates: Partial<Booking> = {};
      if (newDate && newDate !== selectedBooking.date) updates.date = newDate;
      const originalTime = (selectedBooking as unknown as Record<string, unknown>).booking_time;
      if (newTime && newTime !== (typeof originalTime === 'string' ? originalTime : '')) {
        (updates as any).booking_time = newTime;
      }

      // site contact details
      if ((selectedBooking.site_contact_first_name || '') !== siteFirst) updates.site_contact_first_name = siteFirst;
      if ((selectedBooking.site_contact_last_name || '') !== siteLast) updates.site_contact_last_name = siteLast;
      if ((selectedBooking.site_contact_phone || '') !== sitePhone) updates.site_contact_phone = sitePhone;
      if ((selectedBooking.site_contact_email || '') !== siteEmail) updates.site_contact_email = siteEmail || null;

      // site location
      if ((selectedBooking.site_address_line1 || '') !== addr1) updates.site_address_line1 = addr1;
      if ((selectedBooking.site_address_line2 || '') !== addr2) updates.site_address_line2 = addr2 || null;
      if ((selectedBooking.site_city || '') !== city) updates.site_city = city;
      if ((selectedBooking.site_province || '') !== province) updates.site_province = province;
      if ((selectedBooking.site_postal_code || '') !== postal) updates.site_postal_code = postal;

      // project details
      if ((selectedBooking.project_details || '') !== projectDetails) updates.project_details = projectDetails || null;

      const inputUrls = fileUrlsText
        .split(/\n|,/)
        .map(s => s.trim())
        .filter(Boolean);

      const uploaded: string[] = [];
      if (fileInput && fileInput.length > 0) {
        for (const file of Array.from(fileInput)) {
          const url = await uploadFile(file);
          if (url) uploaded.push(url);
        }
      }

      const allFiles = [...inputUrls, ...uploaded];
      await onEdit(selectedBooking, updates, allFiles.length ? allFiles : undefined);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setIsLoading(false);
    }
  };

  // Extract and format time from booking with safe narrowing
  const getBookingTime = (booking: Booking): string => {
    const maybe = (booking as unknown as Record<string, unknown>).booking_time;
    return typeof maybe === 'string' && maybe.trim() !== '' ? maybe : '9:00 AM';
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      rescheduled: 'bg-purple-100 text-purple-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
        statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
      }`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {`Booking for ${bookings[0]?.date ? formatDate(bookings[0].date) : 'Selected Date'}`}
            {bookings.length > 1 && (
              <span className="ml-2 text-sm font-normal text-gray-500">({bookings.length} bookings)</span>
            )}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="m-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
            <div className="flex">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="p-4">
          {bookings.length > 1 && (
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {bookings.map((b) => {
                const time = getBookingTime(b);
                const selected = selectedBooking?.id === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBooking(b)}
                    className={`w-full text-left p-3 rounded-md border transition-colors ${selected ? 'border-blue-900 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{b.service || 'Booking'}</div>
                        <div className="text-sm text-gray-600">{time}</div>
                        {b.job_number && (
                          <div className="text-xs text-gray-500 mt-0.5">Job #: {b.job_number}</div>
                        )}
                      </div>
                      <div>{getStatusBadge(b.status)}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
          {selectedBooking && (
            <div>
              {/* Booking details view */}
              <div className="mb-4 p-4 bg-gray-50 rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium mb-1">{selectedBooking.service}</h4>
                    <p className="text-sm text-gray-500">
                      {formatDate(selectedBooking.date)} at {getBookingTime(selectedBooking)}
                    </p>
                    {selectedBooking.job_number && (
                      <p className="text-xs text-gray-500 mt-1">Job #: {selectedBooking.job_number}</p>
                    )}
                  </div>
                  <div>{getStatusBadge(selectedBooking.status)}</div>
                </div>
              </div>

              {/* Read-only Site Contact/Location section removed now that fields are editable below */}

              {/* Read-only Project Details removed; now editable in the form below */}
              
              {/* Cancellation reason input */}
              {confirmingCancel && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cancellation Reason
                  </label>
                  <input
                    type="text"
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter reason for cancellation"
                    required
                  />
                </div>
              )}

              {/* Modify Booking form */}
              {isEditing && (
                <div className="mb-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Date</label>
                      <input
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Time</label>
                      <TimeWheel
                        value={newTime}
                        onChange={setNewTime}
                      />
                    </div>
                  </div>
                  {/* Site Contact */}
                  <div>
                    <h5 className="font-medium text-sm text-gray-700 mb-2">Site Contact</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <input
                          type="text"
                          value={siteFirst}
                          onChange={(e) => setSiteFirst(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <input
                          type="text"
                          value={siteLast}
                          onChange={(e) => setSiteLast(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                          type="text"
                          value={sitePhone}
                          onChange={(e) => setSitePhone(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={siteEmail}
                          onChange={(e) => setSiteEmail(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Site Location */}
                  <div>
                    <h5 className="font-medium text-sm text-gray-700 mb-2">Site Location</h5>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                        <input
                          type="text"
                          value={addr1}
                          onChange={(e) => setAddr1(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                        <input
                          type="text"
                          value={addr2}
                          onChange={(e) => setAddr2(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                          <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                          <input
                            type="text"
                            value={province}
                            onChange={(e) => setProvince(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                          <input
                            type="text"
                            value={postal}
                            onChange={(e) => setPostal(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Project Details */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Details</label>
                    <textarea
                      value={projectDetails}
                      onChange={(e) => setProjectDetails(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-24"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Attached File URLs</label>
                    <textarea
                      value={fileUrlsText}
                      onChange={(e) => setFileUrlsText(e.target.value)}
                      placeholder="Paste URLs, separated by commas or new lines"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-24"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload Additional Files</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        multiple
                        onChange={(e) => setFileInput(e.target.files)}
                      />
                      <Upload className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveEdit}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-900 border border-transparent rounded-md shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </>
                ) : confirmingCancel ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setConfirmingCancel(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                      disabled={isLoading}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Cancelling...' : 'Confirm Cancellation'}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-900 border border-transparent rounded-md shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      disabled={selectedBooking.status === 'cancelled'}
                    >
                      <Edit className="w-4 h-4 inline mr-1" />
                      Modify Booking
                    </button>
                    {/* Book a second job on the same day (admin flow) */}
                    <button
                      type="button"
                      onClick={() => {
                        if (!selectedBooking?.date) return;
                        const date = selectedBooking.date;
                        navigate(`/book?date=${encodeURIComponent(date)}&adminSecond=1`);
                      }}
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      disabled={selectedBooking.status === 'cancelled' || !!selectedBooking.is_blocked}
                    >
                      Book a second Job
                    </button>
                    {selectedBooking.is_blocked ? (
                      <button
                        type="button"
                        onClick={() => onUnblock && onUnblock(selectedBooking)}
                        className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 border border-transparent rounded-md shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                      >
                        <Trash2 className="w-4 h-4 inline mr-1" />
                        Unblock Date
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        disabled={selectedBooking.status === 'cancelled'}
                      >
                        <Trash2 className="w-4 h-4 inline mr-1" />
                        Cancel Booking
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
