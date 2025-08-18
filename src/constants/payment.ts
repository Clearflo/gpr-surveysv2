// Payment method options
export const PAYMENT_METHODS = [
  { value: 'credit-card', label: 'Credit Card' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'e-transfer', label: 'E-Transfer' },
  { value: 'purchase-order', label: 'Purchase Order' }
] as const;

// Payment method values as a union type for TypeScript
export type PaymentMethodType = typeof PAYMENT_METHODS[number]['value'];

// Payment-related constants
export const PAYMENT_CONSTANTS = {
  // Payment methods that require additional information
  REQUIRES_ADDITIONAL_INFO: ['purchase-order'],
  
  // Default payment terms
  PAYMENT_TERMS: {
    NET_30: 30,
    NET_15: 15,
    IMMEDIATE: 0
  }
};
