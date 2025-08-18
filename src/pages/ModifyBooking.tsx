import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBookingSelf, updateBookingSelf, addBookingFile, FetchBookingSelfRow, UpdateBookingSelfPayload } from '../lib/selfService';
import { uploadFile } from '../lib/storage';
import { FILE_UPLOAD } from '../constants/booking';
import TimeWheel from '../components/ui/TimeWheel';
import { sendWebhook } from '../lib/webhook';

const tomorrowISO = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split('T')[0];
};

const ModifyBooking: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'verify' | 'edit'>('verify');
  const [jobNumber, setJobNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [booking, setBooking] = useState<FetchBookingSelfRow | undefined>();

  // Editable state
  const [site, setSite] = useState({
    site_contact_first_name: '',
    site_contact_last_name: '',
    site_contact_phone: '',
    site_contact_email: '',
    site_address_line1: '',
    site_address_line2: '',
    site_city: '',
    site_province: '',
    site_postal_code: '',
    site_country: '',
  });
  const [billing, setBilling] = useState({
    billing_email: '',
    billing_address_line1: '',
    billing_address_line2: '',
    billing_city: '',
    billing_province: '',
    billing_postal_code: '',
    billing_country: '',
  });
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [purchaseOrder, setPurchaseOrder] = useState<string>('');
  const [fileUploads, setFileUploads] = useState<File[]>([]);

  const minDate = useMemo(() => tomorrowISO(), []);

  // helpers to convert between 24h stored value and 12h display for TimeWheel
  const to12h = (value?: string) => {
    if (!value) return '';
    // already 12h
    if (/^\d{1,2}:\d{2}\s*(AM|PM)$/i.test(value.trim())) return value.toUpperCase();
    const m = value.match(/^(\d{2}):(\d{2})$/);
    if (!m) return value;
    const h = parseInt(m[1], 10);
    const mm = m[2];
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${displayHour}:${mm} ${period}`;
  };

  const resetMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);
    try {
      const res = await fetchBookingSelf(jobNumber.trim(), email.trim().toLowerCase());
      if (!res) {
        setError('No booking found for that job number and email.');
        return;
      }
      setBooking(res);
      // prime edit states from result
      setSite({
        site_contact_first_name: res.site_contact_first_name || '',
        site_contact_last_name: res.site_contact_last_name || '',
        site_contact_phone: res.site_contact_phone || '',
        site_contact_email: res.site_contact_email || '',
        site_address_line1: res.site_address_line1 || '',
        site_address_line2: res.site_address_line2 || '',
        site_city: res.site_city || '',
        site_province: res.site_province || '',
        site_postal_code: res.site_postal_code || '',
        site_country: res.site_country || '',
      });
      setBilling({
        billing_email: res.billing_email || '',
        billing_address_line1: res.billing_address_line1 || '',
        billing_address_line2: res.billing_address_line2 || '',
        billing_city: res.billing_city || '',
        billing_province: res.billing_province || '',
        billing_postal_code: res.billing_postal_code || '',
        billing_country: res.billing_country || '',
      });
      setDate(res.date);
      setTime(to12h(res.booking_time || ''));
      setNotes(res.notes || '');
      setPurchaseOrder(res.purchase_order || '');
      setStep('edit');
    } catch (err: any) {
      setError(err.message || 'Failed to verify booking');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const merged = [...fileUploads, ...files].slice(0, FILE_UPLOAD.MAX_FILES);
    setFileUploads(merged);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;
    setLoading(true);
    setError('');
    try {
      // Build updated snapshot to compute diffs and for webhook
      const originalSnapshot = { ...booking };
      const updatedSnapshot: FetchBookingSelfRow & Record<string, any> = {
        ...booking,
        date,
        booking_time: time || booking.booking_time || null,
        notes,
        purchase_order: purchaseOrder,
        site_contact_first_name: site.site_contact_first_name,
        site_contact_last_name: site.site_contact_last_name,
        site_contact_phone: site.site_contact_phone,
        site_contact_email: site.site_contact_email,
        site_address_line1: site.site_address_line1,
        site_address_line2: site.site_address_line2,
        site_city: site.site_city,
        site_province: site.site_province,
        site_postal_code: site.site_postal_code,
        site_country: site.site_country,
        billing_email: billing.billing_email,
        billing_address_line1: billing.billing_address_line1,
        billing_address_line2: billing.billing_address_line2,
        billing_city: billing.billing_city,
        billing_province: billing.billing_province,
        billing_postal_code: billing.billing_postal_code,
        billing_country: billing.billing_country,
      };

      // Compute changed fields (only keys we might update)
      const candidateKeys = [
        'date','booking_time','notes','purchase_order',
        'site_contact_first_name','site_contact_last_name','site_contact_phone','site_contact_email',
        'site_address_line1','site_address_line2','site_city','site_province','site_postal_code','site_country',
        'billing_email','billing_address_line1','billing_address_line2','billing_city','billing_province','billing_postal_code','billing_country'
      ] as const;
      const changedFields: string[] = [];
      const oldValues: Record<string, unknown> = {};
      const newValues: Record<string, unknown> = {};
      for (const key of candidateKeys) {
        const before = (originalSnapshot as any)[key] ?? null;
        const after = (updatedSnapshot as any)[key] ?? null;
        if (before !== after) {
          changedFields.push(key);
          oldValues[key] = before;
          newValues[key] = after;
        }
      }

      const payload: UpdateBookingSelfPayload = {
        job_number: jobNumber.trim(),
        email: email.trim().toLowerCase(),
        booking_updates: {
          date,
          booking_time: time || undefined as any,
          notes,
          purchase_order: purchaseOrder,
          ...site,
        },
        customer_updates: { ...billing },
      };
      await updateBookingSelf(payload);

      // Upload files and attach
      const uploadedUrls: string[] = [];
      for (const f of fileUploads) {
        const url = await uploadFile(f);
        uploadedUrls.push(url);
        await addBookingFile(jobNumber.trim(), email.trim().toLowerCase(), url);
      }

      // Send webhook with structure similar to admin modified/rescheduled
      try {
        const formatDateSlash = (isoDate?: string) => (isoDate || '').replace(/-/g, '/');
        const formatTimeDisplay = (t?: string | null) => {
          if (!t) return '';
          if (/^\d{1,2}:\d{2}\s?(AM|PM)$/i.test(t)) return t.toUpperCase();
          const m = t.match(/^(\d{2}):(\d{2})$/);
          if (!m) return String(t);
          const h = parseInt(m[1], 10);
          const mm = m[2];
          const ampm = h >= 12 ? 'PM' : 'AM';
          const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
          return `${displayHour}:${mm} ${ampm}`;
        };

        const us: any = updatedSnapshot as any;
        const bookingTimeRaw = (us.booking_time ?? '') as string;
        const payloadForWebhook = {
          bookingId: booking.booking_id,
          jobNumber: booking.job_number,

          // Customer Info (limited in self-service context)
          firstName: null,
          lastName: null,
          company: null,
          email: booking.customer_email, // best available
          phone: booking.customer_phone,

          // Billing Info
          billingEmail: us.billing_email,
          billingAddressLine1: us.billing_address_line1,
          billingAddressLine2: us.billing_address_line2,
          billingCity: us.billing_city,
          billingProvince: us.billing_province,
          billingPostalCode: us.billing_postal_code,
          billingInstructions: null,

          // Service Details
          service: booking.service,
          projectDetails: booking.project_details,
          bc1CallNumber: booking.bc1_call_number,
          date: formatDateSlash(us.date),
          bookingTime: bookingTimeRaw,
          bookingTimeFormatted: formatTimeDisplay(bookingTimeRaw),

          // Site Contact
          siteContactFirstName: us.site_contact_first_name,
          siteContactLastName: us.site_contact_last_name,
          siteContactPhone: us.site_contact_phone,
          siteContactEmail: us.site_contact_email,

          // Site Location
          siteAddressLine1: us.site_address_line1,
          siteAddressLine2: us.site_address_line2,
          siteCity: us.site_city,
          siteProvince: us.site_province,
          sitePostalCode: us.site_postal_code,

          // Additional Info
          notes: us.notes,
          paymentMethod: booking.payment_method,
          purchaseOrder: us.purchase_order,

          // Files (self-service: only newly uploaded available here)
          siteFiles: uploadedUrls,
          fileCount: uploadedUrls.length,
          filesUploaded: uploadedUrls.length > 0,

          // Flags
          isBlockedBooking: false,

          // Change metadata
          changedFields,
          oldValues,
          newValues,
          original: originalSnapshot,
          updated: updatedSnapshot,
        } as const;

        const event = changedFields.some(f => f === 'date' || f === 'booking_time') ? 'rescheduled' : 'modified';
        await sendWebhook(event as any, payloadForWebhook);
      } catch (webhookErr) {
        // Non-fatal
        console.error('Self-service modify webhook failed:', webhookErr);
      }

      // Navigate to success page with job number in state
      navigate('/modify/success', { state: { jobNumber: booking.job_number, email } });
    } catch (err: any) {
      setError(err.message || 'Failed to update booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-28 pb-16">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Modify Your Booking</h1>
      <p className="text-gray-600 mb-8">Verify your booking using job number and email, then update details.</p>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded">{success}</div>}

      {step === 'verify' && (
        <form onSubmit={handleVerify} className="bg-white shadow rounded p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Job Number</label>
            <input value={jobNumber} onChange={(e) => setJobNumber(e.target.value)} className="input w-full" placeholder="e.g. J25024" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input w-full" placeholder="email@domain.com" required />
          </div>
          <div className="flex gap-3">
            <button disabled={loading} className="btn-primary px-6">{loading ? 'Verifying...' : 'Verify Booking'}</button>
          </div>
        </form>
      )}

      {step === 'edit' && booking && (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white shadow rounded p-6">
            <h2 className="text-xl font-semibold mb-4">Schedule</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input type="date" className="input w-full ring-1 ring-blue-300 focus:ring-2 focus:ring-blue-500 bg-blue-50" min={minDate} value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center justify-between">
                  Preferred Start Time
                  <button
                    type="button"
                    className="text-xs text-blue-700 hover:underline"
                    onClick={() => setTime('')}
                  >
                    No change
                  </button>
                </label>
                <TimeWheel
                  value={time}
                  onChange={setTime}
                />
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded p-6">
            <h2 className="text-xl font-semibold mb-4">Site Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(site).map(([k, v]) => (
                <div key={k}>
                  <label className="block text-sm font-medium mb-1">{k.replace(/_/g, ' ')}</label>
                  <input className="input w-full ring-1 ring-blue-300 focus:ring-2 focus:ring-blue-500 bg-blue-50" value={v as string} onChange={(e) => setSite((s) => ({ ...s, [k]: e.target.value }))} />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white shadow rounded p-6">
            <h2 className="text-xl font-semibold mb-4">Billing Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(billing).map(([k, v]) => (
                <div key={k}>
                  <label className="block text-sm font-medium mb-1">{k.replace(/_/g, ' ')}</label>
                  <input className="input w-full ring-1 ring-blue-300 focus:ring-2 focus:ring-blue-500 bg-blue-50" value={v as string} onChange={(e) => setBilling((b) => ({ ...b, [k]: e.target.value }))} />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white shadow rounded p-6">
            <h2 className="text-xl font-semibold mb-4">Additional Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea className="input w-full ring-1 ring-blue-300 focus:ring-2 focus:ring-blue-500 bg-blue-50" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Purchase Order</label>
                <input className="input w-full ring-1 ring-blue-300 focus:ring-2 focus:ring-blue-500 bg-blue-50" value={purchaseOrder} onChange={(e) => setPurchaseOrder(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center justify-between">Upload Files <span className="text-xs text-gray-500">Max {FILE_UPLOAD.MAX_FILES} files, {Math.round(FILE_UPLOAD.MAX_FILE_SIZE/1024/1024)}MB each</span></label>
                <input type="file" multiple accept={FILE_UPLOAD.ALLOWED_TYPES.join(',')} onChange={handleFileSelect} />
                {fileUploads.length > 0 && (
                  <ul className="mt-2 text-sm text-gray-600 list-disc pl-5">
                    {fileUploads.map((f, i) => (
                      <li key={i}>{f.name}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" disabled={loading} className="btn-primary px-6">{loading ? 'Saving...' : 'Save Changes'}</button>
            <button type="button" className="btn-secondary px-6" onClick={() => setStep('verify')}>Back</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ModifyBooking;
