import { useState, useEffect, useCallback } from 'react';
import { BookingFormData } from '../../types/form.types';

interface StepCompletion {
  1: boolean;
  2: boolean;
  3: boolean;
}

interface UseBookingFormReturn {
  formData: BookingFormData;
  setFormData: React.Dispatch<React.SetStateAction<BookingFormData>>;
  updateFormData: (data: Partial<BookingFormData>) => void;
  resetForm: () => void;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  stepCompletion: StepCompletion;
  canProceedToNext: boolean;
  handleNext: () => void;
  handleBack: () => void;
  isComplete: boolean;
}

const initialFormData: BookingFormData = {
  first_name: '',
  last_name: '',
  company: '',
  email: '',
  phone: '',
  billing_email: '',
  billing_address_line1: '',
  billing_address_line2: '',
  billing_city: '',
  billing_province: '',
  billing_postal_code: '',
  billing_instructions: '',
  service: '',
  project_details: '',
  bc1_call_number: '',
  date: '',
  booking_time: '',
  site_contact_first_name: '',
  site_contact_last_name: '',
  site_contact_phone: '',
  site_contact_email: '',
  site_address_line1: '',
  site_address_line2: '',
  site_city: '',
  site_province: '',
  site_postal_code: '',
  notes: '',
  payment_method: '',
  purchase_order: '',
  site_plans: []
};

/**
 * Custom hook for managing booking form state and navigation
 * Handles form data, step completion tracking, and navigation between steps
 * Updated for 3-step flow with combined customer/billing
 */
export const useBookingForm = (): UseBookingFormReturn => {
  const [formData, setFormData] = useState<BookingFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [stepCompletion, setStepCompletion] = useState<StepCompletion>({
    1: false,
    2: false,
    3: false
  });

  // Update form data partially
  const updateFormData = useCallback((data: Partial<BookingFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  // Reset form to initial state
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setCurrentStep(1);
  }, []);

  // Check step completion whenever formData changes
  useEffect(() => {
    // Check if step 1 is complete (service, date, and time)
    const isStep1Complete = 
      formData.service !== '' && 
      formData.date !== '' &&
      formData.booking_time !== '';
    
    // Check if step 2 is complete (site info)
    const isStep2Complete = 
      formData.site_contact_first_name !== '' &&
      formData.site_contact_last_name !== '' &&
      formData.site_contact_phone !== '' &&
      formData.site_address_line1 !== '' &&
      formData.site_city !== '' &&
      formData.site_province !== '' &&
      formData.site_postal_code !== '';
    
    // Check if step 3 is complete (customer + billing info combined)
    const isStep3Complete = 
      // Customer info validation
      formData.first_name !== '' &&
      formData.last_name !== '' &&
      formData.email !== '' &&
      formData.phone !== '' &&
      // Billing info validation
      formData.billing_email !== '' &&
      formData.billing_address_line1 !== '' &&
      formData.billing_city !== '' &&
      formData.billing_province !== '' &&
      formData.billing_postal_code !== '' &&
      formData.payment_method !== '' &&
      (formData.payment_method !== 'purchase-order' || formData.purchase_order !== '');
    
    // Update step completion state
    setStepCompletion({
      1: isStep1Complete,
      2: isStep2Complete,
      3: isStep3Complete
    });
  }, [formData]);

  const canProceedToNext = stepCompletion[currentStep as keyof StepCompletion];
  const isComplete = Object.values(stepCompletion).every(complete => complete);

  const handleNext = useCallback(() => {
    if (currentStep < 3 && canProceedToNext) {
      setCurrentStep(currentStep + 1);
      // Scroll to top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep, canProceedToNext]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // Scroll to top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep]);

  return {
    formData,
    setFormData,
    updateFormData,
    resetForm,
    currentStep,
    setCurrentStep,
    stepCompletion,
    canProceedToNext,
    handleNext,
    handleBack,
    isComplete
  };
};

export default useBookingForm;
