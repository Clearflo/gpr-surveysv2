import React, { useEffect, useState } from 'react';
import { AlertTriangle, Edit, Trash2, Clock } from 'lucide-react';
import { formatDisplayDate } from './weeklyCalendarUtils';
import type { Database } from '../../../types/database.types';
import { listProjectFiles } from '../../../lib/storage';
import { supabase } from '../../../lib/supabase';

type Booking = Database['public']['Tables']['bookings']['Row'];

interface BookingDetailsModalProps {
  booking: Booking;
  onClose: () => void;
  onDelete: (reason: string) => Promise<void>;
  onEdit?: (updates: Partial<Booking>, fileUrls?: string[]) => Promise<void>;
  onUnblock?: (date: string) => Promise<boolean | void>;
}

export const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({ 
  booking, 
  onClose, 
  onDelete, 
  onEdit,
  onUnblock
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('Cancelled by admin');
  const [showCancellationInput, setShowCancellationInput] = useState(false);

  // edit form state
  const [projectDetails, setProjectDetails] = useState(booking.project_details || '');
  const [notes, setNotes] = useState(booking.notes || '');
  const [siteFirst, setSiteFirst] = useState(booking.site_contact_first_name);
  const [siteLast, setSiteLast] = useState(booking.site_contact_last_name);
  const [sitePhone, setSitePhone] = useState(booking.site_contact_phone);
  const [siteEmail, setSiteEmail] = useState(booking.site_contact_email || '');
  const [addr1, setAddr1] = useState(booking.site_address_line1);
  const [addr2, setAddr2] = useState(booking.site_address_line2 || '');
  const [city, setCity] = useState(booking.site_city);
  const [province, setProvince] = useState(booking.site_province);
  const [postal, setPostal] = useState(booking.site_postal_code);
  const [paymentMethod, setPaymentMethod] = useState(booking.payment_method);
  const [po, setPo] = useState(booking.purchase_order || '');
  const [bookingDate, setBookingDate] = useState(booking.date);
  const [bookingTime, setBookingTime] = useState(((booking as unknown as { booking_time?: string }).booking_time) || '');
  // Billing state (from customers table if available)
  const [billingEmail, setBillingEmail] = useState<string>('');
  const [billingAddress1, setBillingAddress1] = useState<string>('');
  const [billingAddress2, setBillingAddress2] = useState<string>('');
  const [billingCity, setBillingCity] = useState<string>('');
  const [billingProvince, setBillingProvince] = useState<string>('');
  const [billingPostal, setBillingPostal] = useState<string>('');
  const [billingLoaded, setBillingLoaded] = useState(false);

  // Storage: list of files to display (read-only)
  const [files, setFiles] = useState<{ name: string; url: string }[]>([]);

  useEffect(() => {
    // Load billing info from customers if booking has a customer_id
    (async () => {
      try {
        if (booking.customer_id) {
          const { data, error } = await supabase
            .from('customers')
            .select('billing_email,billing_address_line1,billing_address_line2,billing_city,billing_province,billing_postal_code')
            .eq('id', booking.customer_id)
            .single();
          if (!error && data) {
            setBillingEmail(data.billing_email || '');
            setBillingAddress1(data.billing_address_line1 || '');
            setBillingAddress2(data.billing_address_line2 || '');
            setBillingCity(data.billing_city || '');
            setBillingProvince(data.billing_province || '');
            setBillingPostal(data.billing_postal_code || '');
          }
        }
      } finally {
        setBillingLoaded(true);
      }
    })();
    // Load recent files from storage for quick reference
    (async () => {
      try {
        const list = await listProjectFiles(20);
        setFiles(list);
      } catch (e) {
        // non-fatal
        console.warn('Unable to list project files', e);
      }
    })();
  }, [booking.customer_id]);

  // No separate reschedule flow; date/time can be edited in Modify mode

  // Save edited fields (partial update) and optional customer billing updates
  const handleSaveEdit = async () => {
    if (!onEdit) return;
    setIsLoading(true);
    setError(null);
    try {
      const updates: Partial<Booking> = {};
      if ((booking.project_details || '') !== projectDetails) updates.project_details = projectDetails || null;
      if ((booking.notes || '') !== notes) updates.notes = notes || null;
      if (booking.site_contact_first_name !== siteFirst) updates.site_contact_first_name = siteFirst;
      if (booking.site_contact_last_name !== siteLast) updates.site_contact_last_name = siteLast;
      if (booking.site_contact_phone !== sitePhone) updates.site_contact_phone = sitePhone;
      if ((booking.site_contact_email || '') !== siteEmail) updates.site_contact_email = siteEmail || null;
      if (booking.site_address_line1 !== addr1) updates.site_address_line1 = addr1;
      if ((booking.site_address_line2 || '') !== addr2) updates.site_address_line2 = addr2 || null;
      if (booking.site_city !== city) updates.site_city = city;
      if (booking.site_province !== province) updates.site_province = province;
      if (booking.site_postal_code !== postal) updates.site_postal_code = postal;
      if (booking.payment_method !== paymentMethod) updates.payment_method = paymentMethod as Booking['payment_method'];
      if ((booking.purchase_order || '') !== po) updates.purchase_order = po || null;

      const originalBookingTime = ((booking as unknown as { booking_time?: string }).booking_time) || '';
      if (originalBookingTime !== bookingTime) {
        (updates as unknown as { booking_time?: string }).booking_time = (bookingTime || null) as unknown as string;
      }
      if (booking.date !== bookingDate) {
        updates.date = bookingDate;
      }

      await onEdit(updates);

      // If we have a customer record, update billing info if changed
      if (booking.customer_id && billingLoaded) {
        await supabase.from('customers').update({
          billing_email: billingEmail || null,
          billing_address_line1: billingAddress1 || '',
          billing_address_line2: billingAddress2 || null,
          billing_city: billingCity || '',
          billing_province: billingProvince || '',
          billing_postal_code: billingPostal || '',
          updated_at: new Date().toISOString(),
        }).eq('id', booking.customer_id);
      }
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnblock = async () => {
    if (!onUnblock) return;
    setIsLoading(true);
    setError(null);
    try {
      const ok = await onUnblock(booking.date);
      if (ok !== false) {
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unblock date');
    } finally {
      setIsLoading(false);
    }
  };

  // Removed local upload handler; files are displayed read-only from storage list

  const handleDelete = async () => {
    if (!confirmingDelete) {
      setShowCancellationInput(true);
      setConfirmingDelete(true);
      return;
    }
    
    if (cancellationReason.trim() === '') {
      setError('Please provide a cancellation reason');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      await onDelete(cancellationReason);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel booking');
    } finally {
      setIsLoading(false);
      setConfirmingDelete(false);
      setShowCancellationInput(false);
    }
  };

  const getStatusBadge = () => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
      rescheduled: 'bg-purple-100 text-purple-800'
    };
    
    return (
      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
        statusColors[booking.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
      }`}>
        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 max-w-xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-gray-900">Booking Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-lg text-red-800 text-xs">
            {error}
          </div>
        )}

        <div className="space-y-2 text-sm">
          {/* Header with ID and Status */}
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">ID: {booking.id.substring(0, 8)}...</span>
            </div>
            <div>{getStatusBadge()}</div>
          </div>
          
          {/* Two column grid for main details */}
          <div className="grid grid-cols-2 gap-2 border-t border-b border-gray-100 py-2">
            <div>
              <div className="font-medium text-xs text-gray-600">Service</div>
              <div className="text-xs">{booking.service}</div>
            </div>
            <div>
              <div className="font-medium text-xs text-gray-600">Duration</div>
              <div className="text-xs">{
                (((booking as unknown as { duration?: 'over-4' | 'under-4' }).duration) === 'over-4')
                  ? 'Full Day'
                  : 'Half Day'
              }</div>
            </div>
            <div>
              <div className="font-medium text-xs text-gray-600">Date</div>
              <div className="text-xs">{formatDisplayDate(booking.date)}</div>
            </div>
            <div>
              <div className="font-medium text-xs text-gray-600">Payment</div>
              <div className="text-xs">{booking.payment_method.replace('-', ' ')}</div>
            </div>
          </div>

          {/* Customer section */}
          <div className="py-1">
            <div className="font-medium text-xs text-gray-600 mb-1">Customer</div>
            <div className="flex flex-col text-xs">
              {booking.customer_email && <span>{booking.customer_email}</span>}
              {booking.customer_phone && <span>{booking.customer_phone}</span>}
            </div>
          </div>

          {/* Site Contact and Address - combined for space saving */}
          <div className="py-1">
            <div className="font-medium text-xs text-gray-600 mb-1">Site Contact & Address</div>
            <div className="grid grid-cols-2 text-xs">
              <div>
                <div>{booking.site_contact_first_name} {booking.site_contact_last_name}</div>
                <div>{booking.site_contact_phone}</div>
                {booking.site_contact_email && <div className="truncate">{booking.site_contact_email}</div>}
              </div>
              <div>
                <div>{booking.site_address_line1}</div>
                {booking.site_address_line2 && <div>{booking.site_address_line2}</div>}
                <div>{booking.site_city}, {booking.site_province} {booking.site_postal_code}</div>
              </div>
            </div>
          </div>

          {/* Project Details - only if they exist */}
          {booking.project_details && (
            <div className="py-1">
              <div className="font-medium text-xs text-gray-600 mb-1">Project Details</div>
              <div className="text-xs">{booking.project_details}</div>
            </div>
          )}

          {/* Editing section (Modify Booking) */}
          {isEditing && (
            <div className="py-1 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="font-medium text-xs text-gray-600 mb-1">Date</div>
                  <input type="date" value={bookingDate} onChange={e=>setBookingDate(e.target.value)} className="w-full px-2 py-1 text-xs border rounded" />
                </div>
                <div>
                  <div className="font-medium text-xs text-gray-600 mb-1">Booking Time</div>
                  {/* Simple iOS-like two-column scroller for hour/minute */}
                  <div className="flex gap-2">
                    <div className="flex-1 max-h-24 overflow-y-auto border rounded p-1 scroll-smooth">
                      {Array.from({ length: 12 }, (_, i) => i + 7).map(h => {
                        const hh = h.toString().padStart(2, '0');
                        const selected = bookingTime?.startsWith(hh + ':');
                        return (
                          <div key={h}
                               onClick={() => setBookingTime(prev => `${hh}:${(prev?.split(':')[1]||'00')}`)}
                               className={`py-1 text-center cursor-pointer ${selected ? 'bg-blue-100 text-blue-900 rounded' : ''}`}>
                            {hh}
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex-1 max-h-24 overflow-y-auto border rounded p-1 scroll-smooth">
                      {['00','15','30','45'].map(mm => {
                        const curHH = (bookingTime?.split(':')[0] || '09').padStart(2, '0');
                        const selected = (bookingTime?.split(':')[1] || '') === mm;
                        return (
                          <div key={mm}
                               onClick={() => setBookingTime(`${curHH}:${mm}`)}
                               className={`py-1 text-center cursor-pointer ${selected ? 'bg-blue-100 text-blue-900 rounded' : ''}`}>
                            {mm}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="font-medium text-xs text-gray-600 mb-1">Project Details</div>
                <textarea value={projectDetails} onChange={e=>setProjectDetails(e.target.value)} className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-md" rows={3} />
              </div>
              <div>
                <div className="font-medium text-xs text-gray-600 mb-1">Notes</div>
                <textarea value={notes} onChange={e=>setNotes(e.target.value)} className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-md" rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="font-medium text-xs text-gray-600 mb-1">Site First Name</div>
                  <input value={siteFirst} onChange={e=>setSiteFirst(e.target.value)} className="w-full px-2 py-1 text-xs border rounded" />
                </div>
                <div>
                  <div className="font-medium text-xs text-gray-600 mb-1">Site Last Name</div>
                  <input value={siteLast} onChange={e=>setSiteLast(e.target.value)} className="w-full px-2 py-1 text-xs border rounded" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="font-medium text-xs text-gray-600 mb-1">Site Phone</div>
                  <input value={sitePhone} onChange={e=>setSitePhone(e.target.value)} className="w-full px-2 py-1 text-xs border rounded" />
                </div>
                <div>
                  <div className="font-medium text-xs text-gray-600 mb-1">Site Email</div>
                  <input value={siteEmail} onChange={e=>setSiteEmail(e.target.value)} className="w-full px-2 py-1 text-xs border rounded" />
                </div>
              </div>
              <div>
                <div className="font-medium text-xs text-gray-600 mb-1">Address Line 1</div>
                <input value={addr1} onChange={e=>setAddr1(e.target.value)} className="w-full px-2 py-1 text-xs border rounded" />
              </div>
              <div>
                <div className="font-medium text-xs text-gray-600 mb-1">Address Line 2</div>
                <input value={addr2} onChange={e=>setAddr2(e.target.value)} className="w-full px-2 py-1 text-xs border rounded" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className="font-medium text-xs text-gray-600 mb-1">City</div>
                  <input value={city} onChange={e=>setCity(e.target.value)} className="w-full px-2 py-1 text-xs border rounded" />
                </div>
                <div>
                  <div className="font-medium text-xs text-gray-600 mb-1">Province</div>
                  <input value={province} onChange={e=>setProvince(e.target.value)} className="w-full px-2 py-1 text-xs border rounded" />
                </div>
                <div>
                  <div className="font-medium text-xs text-gray-600 mb-1">Postal</div>
                  <input value={postal} onChange={e=>setPostal(e.target.value)} className="w-full px-2 py-1 text-xs border rounded" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className="font-medium text-xs text-gray-600 mb-1">Payment Method</div>
                  <input value={paymentMethod} onChange={e=>setPaymentMethod(e.target.value)} className="w-full px-2 py-1 text-xs border rounded" />
                </div>
                <div>
                  <div className="font-medium text-xs text-gray-600 mb-1">PO</div>
                  <input value={po} onChange={e=>setPo(e.target.value)} className="w-full px-2 py-1 text-xs border rounded" />
                </div>
                <div className="flex items-end text-xxs text-gray-500">
                  Changes save on "Save Changes".
                </div>
              </div>

              {/* Billing Info (from customers) */}
              {booking.customer_id && (
                <div className="mt-2 border-t border-gray-100 pt-2">
                  <div className="font-medium text-xs text-gray-600 mb-1">Billing Information</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-xxs text-gray-500 mb-0.5">Billing Email</div>
                      <input value={billingEmail} onChange={e=>setBillingEmail(e.target.value)} className="w-full px-2 py-1 text-xs border rounded" />
                    </div>
                    <div>
                      <div className="text-xxs text-gray-500 mb-0.5">Address Line 1</div>
                      <input value={billingAddress1} onChange={e=>setBillingAddress1(e.target.value)} className="w-full px-2 py-1 text-xs border rounded" />
                    </div>
                    <div>
                      <div className="text-xxs text-gray-500 mb-0.5">Address Line 2</div>
                      <input value={billingAddress2} onChange={e=>setBillingAddress2(e.target.value)} className="w-full px-2 py-1 text-xs border rounded" />
                    </div>
                    <div>
                      <div className="text-xxs text-gray-500 mb-0.5">City</div>
                      <input value={billingCity} onChange={e=>setBillingCity(e.target.value)} className="w-full px-2 py-1 text-xs border rounded" />
                    </div>
                    <div>
                      <div className="text-xxs text-gray-500 mb-0.5">Province</div>
                      <input value={billingProvince} onChange={e=>setBillingProvince(e.target.value)} className="w-full px-2 py-1 text-xs border rounded" />
                    </div>
                    <div>
                      <div className="text-xxs text-gray-500 mb-0.5">Postal Code</div>
                      <input value={billingPostal} onChange={e=>setBillingPostal(e.target.value)} className="w-full px-2 py-1 text-xs border rounded" />
                    </div>
                  </div>
                </div>
              )}
              <div>
                <div className="font-medium text-xs text-gray-600 mb-1">Project Files</div>
                <div className="text-xxs text-gray-500 mb-1">Recent uploads from storage (read-only)</div>
                <div className="max-h-28 overflow-y-auto border rounded p-2 space-y-1">
                  {files.length === 0 ? (
                    <div className="text-xxs text-gray-500">No files found.</div>
                  ) : (
                    files.map((f, i) => (
                      <a key={i} href={f.url} target="_blank" rel="noreferrer" className="block text-xxs text-blue-700 truncate hover:underline">
                        {f.name}
                      </a>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Notes - only if they exist */}
          {booking.notes && (
            <div className="py-1">
              <div className="font-medium text-xs text-gray-600 mb-1">Notes</div>
              <div className="text-xs">{booking.notes}</div>
            </div>
          )}

          {/* Cancellation info */}
          {booking.cancelled_at && (
            <div className="bg-red-50 p-2 rounded-md">
              <div className="font-medium text-xs text-red-800 flex items-center">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Cancelled
              </div>
              <div className="text-xs text-red-700">
                {new Date(booking.cancelled_at).toLocaleDateString()}
                {booking.cancelled_by && <span> by {booking.cancelled_by}</span>}
              </div>
              {booking.cancellation_reason && (
                <div className="text-xs text-red-700">Reason: {booking.cancellation_reason}</div>
              )}
            </div>
          )}

          {/* Rescheduling info (historical) */}
          {booking.rescheduled_at && booking.status !== 'cancelled' && (
            <div className="bg-purple-50 p-2 rounded-md">
              <div className="font-medium text-xs text-purple-800 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                Rescheduled
              </div>
              <div className="text-xs text-purple-700">
                From: {formatDisplayDate(booking.rescheduled_from_date || '')}
                <br />
                To: {formatDisplayDate(booking.date)}
                <br />
                {booking.rescheduled_by && <span>By: {booking.rescheduled_by}</span>}
              </div>
            </div>
          )}

          {/* Cancellation reason input */}
          {showCancellationInput && (
            <div className="py-1">
              <div className="font-medium text-xs text-gray-600 mb-1">Cancellation Reason</div>
              <input
                type="text"
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter reason for cancellation"
                required
              />
            </div>
          )}

          {/* No separate reschedule section; date is editable in Modify mode */}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-2 py-1 text-xs text-gray-700 hover:text-gray-900"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-2 py-1 text-xs bg-blue-900 text-white rounded hover:bg-blue-800 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <>
                {showCancellationInput ? (
                  <button
                    onClick={handleDelete}
                    className={`px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 flex items-center`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                        Cancelling...
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Confirm Cancel
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleDelete}
                    className="px-2 py-1 text-xs text-red-600 hover:bg-red-700 hover:text-white rounded transition-colors duration-300 disabled:opacity-50 flex items-center"
                    disabled={isLoading}
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Cancel Booking
                  </button>
                )}
                {booking.is_blocked && !showCancellationInput && (
                  <button
                    onClick={handleUnblock}
                    className="px-2 py-1 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Unblocking...' : 'Unblock Date'}
                  </button>
                )}
                {!showCancellationInput && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-2 py-1 text-xs bg-blue-900 text-white rounded hover:bg-blue-800 disabled:opacity-50 flex items-center"
                    disabled={isLoading || booking.status === 'cancelled'}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Modify Booking
                  </button>
                )}
                {showCancellationInput && (
                  <button
                    onClick={() => {
                      setShowCancellationInput(false);
                      setConfirmingDelete(false);
                    }}
                    className="px-2 py-1 text-xs text-gray-700 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
