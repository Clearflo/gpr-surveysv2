import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useBookings } from '../hooks/useBookings';
import { sendWebhook } from '../lib/webhook';
import { useBookingForm } from '../hooks/booking';
import { useFileUpload } from '../hooks/booking';

// Import extracted components
import {
  ProgressSteps,
  ServiceSelection,
  BillingInfo,
  SiteInfo,
  BookingSuccess
} from '../components/booking';

// Import types
import { BookingFormData } from '../types/form.types';

// Simple email validator requiring a TLD (e.g., john@doe.com)
const isValidEmail = (email: string) => /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test((email || '').trim().toLowerCase());
// Canadian postal code validator for UI (formatted as A1A 1A1)
const isValidCanadianPostal = (value: string) => /^[A-Z]\d[A-Z] \d[A-Z]\d$/.test(((value || '').toUpperCase().trim()));

const BookJob = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  
  const { createBooking, checkCustomerExists, checkDateAvailability } = useBookings();
  const [searchParams] = useSearchParams();
  
  // Use custom hooks
  const {
    formData,
    setFormData,
    stepCompletion,
    resetForm
  } = useBookingForm();
  
  const {
    fileUpload,
    handleFileChange,
    resetFileUpload
  } = useFileUpload();

  // Derived validity flags
  const sitePostalValid = isValidCanadianPostal(formData.site_postal_code);
  const billingPostalValid = isValidCanadianPostal(formData.billing_postal_code);

  // Scroll to top when success state changes to true
  useEffect(() => {
    if (success) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [success]);

  // Always scroll to top when the step changes (covers any navigation path)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // Prefill from query params (admin second job flow)
  useEffect(() => {
    const qDate = searchParams.get('date');
    if (qDate) {
      setFormData(prev => ({ ...prev, date: qDate }));
    }
    // no extra state needed; presence of adminSecond in URL indicates admin flow
  }, [searchParams, setFormData]);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      setError(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setError(null);
    setProcessingStep('');

    try {
      // Validate only truly required fields (removed project_details and bc1_call_number)
      const requiredFields = [
        'first_name', 'last_name', 'email', 'phone',
        'billing_email', 'billing_address_line1', 'billing_city', 'billing_province', 'billing_postal_code',
        'service', 'date', 'booking_time',
        'site_contact_first_name', 'site_contact_last_name', 'site_contact_phone',
        'site_address_line1', 'site_city', 'site_province', 'site_postal_code',
        'payment_method'
      ];
      
      const missingFields = requiredFields.filter(field => 
        !formData[field as keyof BookingFormData] || formData[field as keyof BookingFormData] === ''
      );
      
      if (missingFields.length > 0) {
        throw new Error('Please fill in all required fields before submitting');
      }

      // Normalize and validate emails before any Supabase calls
      const normalizedEmail = formData.email.toLowerCase().trim();
      const normalizedBillingEmail = formData.billing_email.toLowerCase().trim();
      if (!isValidEmail(normalizedEmail) || !isValidEmail(normalizedBillingEmail)) {
        throw new Error('Please enter valid email addresses (e.g., name@example.com)');
      }

      // Apply normalization to form data passed to hooks
      const normalizedForm: BookingFormData = {
        ...formData,
        email: normalizedEmail,
        billing_email: normalizedBillingEmail,
      } as BookingFormData;

      // Check if customer already exists
      const isExistingCustomer = await checkCustomerExists(normalizedForm.email);
      
      // App-level availability enforcement
      const isAdminSecond = searchParams.get('adminSecond') === '1';
      const available = await checkDateAvailability(normalizedForm.date, isAdminSecond ? 'admin' : 'public');
      if (!available) {
        throw new Error(isAdminSecond
          ? 'This date already has two bookings. Please choose another date.'
          : 'This date is not available. Please choose another date.');
      }

      // Create the booking in Supabase
      setProcessingStep('Creating booking in system...');
      const bookingData = await createBooking(normalizedForm as any);
      
      if (!bookingData) {
        throw new Error('Failed to create booking');
      }

      // Format date for webhook
      const formattedDate = normalizedForm.date.replace(/-/g, '/');
      
      // Format time for display
      const formatTimeDisplay = (time: string) => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        return `${displayHour}:${minutes} ${ampm}`;
      };

      // Send the webhook
      setProcessingStep('Sending booking information...');
      
      const webhookData = {
        bookingId: bookingData.id,
        jobNumber: bookingData.job_number,
        
        // Customer Info
        firstName: normalizedForm.first_name,
        lastName: normalizedForm.last_name,
        company: normalizedForm.company,
        email: normalizedForm.email,
        phone: normalizedForm.phone,
        
        // Billing Info
        billingEmail: normalizedForm.billing_email,
        billingAddressLine1: normalizedForm.billing_address_line1,
        billingAddressLine2: normalizedForm.billing_address_line2,
        billingCity: normalizedForm.billing_city,
        billingProvince: normalizedForm.billing_province,
        billingPostalCode: normalizedForm.billing_postal_code,
        billingInstructions: normalizedForm.billing_instructions,
        
        // Service Details
        service: normalizedForm.service,
        projectDetails: normalizedForm.project_details,
        bc1CallNumber: normalizedForm.bc1_call_number,
        date: formattedDate,
        bookingTime: normalizedForm.booking_time,
        bookingTimeFormatted: formatTimeDisplay(normalizedForm.booking_time),
        
        // Site Contact
        siteContactFirstName: normalizedForm.site_contact_first_name,
        siteContactLastName: normalizedForm.site_contact_last_name,
        siteContactPhone: normalizedForm.site_contact_phone,
        siteContactEmail: normalizedForm.site_contact_email,
        
        // Site Location
        siteAddressLine1: normalizedForm.site_address_line1,
        siteAddressLine2: normalizedForm.site_address_line2,
        siteCity: normalizedForm.site_city,
        siteProvince: normalizedForm.site_province,
        sitePostalCode: normalizedForm.site_postal_code,
        
        // Additional Info
        notes: normalizedForm.notes,
        paymentMethod: normalizedForm.payment_method,
        purchaseOrder: normalizedForm.purchase_order,
        
        // Files
        siteFiles: normalizedForm.site_plans,
        fileCount: normalizedForm.site_plans.length,
        filesUploaded: normalizedForm.site_plans.length > 0,
        
        // Flags
        isExistingCustomer: isExistingCustomer,
        isBlockedBooking: false
      };

      await sendWebhook('created', webhookData);
      
      setSuccess(true);
      resetForm();
      resetFileUpload();
      setCurrentStep(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while submitting the form');
    } finally {
      setIsSubmitting(false);
      setProcessingStep('');
    }
  };

  const handleNewBooking = () => {
    setSuccess(false);
    resetForm();
    resetFileUpload();
    setCurrentStep(1);
  };

  // Handle file processing results
  const handleFilesProcessed = async (urls: string[]) => {
    setFormData(prev => ({
      ...prev,
      site_plans: [...prev.site_plans, ...urls]
    }));
  };

  // (removed unused handleFileRemove to satisfy linter)

  // Create the file upload state object expected by ServiceSelection
  const fileUploadState = {
    files: fileUpload.files,
    onFilesChange: (files: File[]) => {
      // Update the fileUpload state
      handleFileChange({ target: { files } } as any);
    },
    onUrlsChange: (urls: string[]) => {
      handleFilesProcessed(urls);
    },
    disabled: fileUpload.uploading
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {success ? (
            <BookingSuccess onBookAnother={handleNewBooking} />
          ) : (
            <form onSubmit={handleSubmit}>
              <ProgressSteps
                currentStep={currentStep}
                onStepClick={(step) => {
                  if (step < currentStep) {
                    setCurrentStep(step);
                    setError(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
              />

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                  {error}
                </div>
              )}

              {/* Step 1: Service Selection */}
              {currentStep === 1 && (
                <ServiceSelection
                  formData={formData}
                  onFormDataChange={(data) => setFormData(prev => ({ ...prev, ...data }))}
                  fileUploadState={fileUploadState}
                />
              )}

              {/* Step 2: Site Information */}
              {currentStep === 2 && (
                <SiteInfo
                  formData={formData}
                  onFormDataChange={(data) => setFormData(prev => ({ ...prev, ...data }))}
                />
              )}

              {/* Step 3: Billing Information (includes Customer Info) */}
              {currentStep === 3 && (
                <BillingInfo
                  formData={formData}
                  setFormData={setFormData}
                />
              )}

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </button>
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!stepCompletion[currentStep as keyof typeof stepCompletion] ||
                      (currentStep === 2 && !sitePostalValid) ||
                      (currentStep === 3 && (!isValidEmail(formData.email) || !isValidEmail(formData.billing_email) || !billingPostalValid))}
                    className={`btn-primary ${
                      !stepCompletion[currentStep as keyof typeof stepCompletion] ||
                      (currentStep === 2 && !sitePostalValid) ||
                      (currentStep === 3 && (!isValidEmail(formData.email) || !isValidEmail(formData.billing_email) || !billingPostalValid))
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                  >
                    Next Step
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      !stepCompletion[3 as keyof typeof stepCompletion] ||
                      fileUpload.uploading ||
                      !isValidEmail(formData.email) ||
                      !isValidEmail(formData.billing_email) ||
                      !sitePostalValid ||
                      !billingPostalValid
                    }
                    className={`btn-primary ${
                      isSubmitting || !stepCompletion[3 as keyof typeof stepCompletion] || fileUpload.uploading || !isValidEmail(formData.email) || !isValidEmail(formData.billing_email) || !sitePostalValid || !billingPostalValid
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></span>
                        {processingStep || 'Submitting...'}
                      </>
                    ) : (
                      <>
                        Submit Booking
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookJob;