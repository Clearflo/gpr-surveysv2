// Canadian provinces and territories
export const PROVINCES = [
  { value: 'BC', label: 'British Columbia' },
  { value: 'AB', label: 'Alberta' },
  { value: 'SK', label: 'Saskatchewan' },
  { value: 'MB', label: 'Manitoba' },
  { value: 'ON', label: 'Ontario' },
  { value: 'QC', label: 'Quebec' },
  { value: 'NB', label: 'New Brunswick' },
  { value: 'NS', label: 'Nova Scotia' },
  { value: 'PE', label: 'Prince Edward Island' },
  { value: 'NL', label: 'Newfoundland and Labrador' },
  { value: 'YT', label: 'Yukon' },
  { value: 'NT', label: 'Northwest Territories' },
  { value: 'NU', label: 'Nunavut' }
] as const;

// Province codes as a union type for TypeScript
export type ProvinceCode = typeof PROVINCES[number]['value'];

// Default country
export const DEFAULT_COUNTRY = 'Canada';

// Company locations
export const COMPANY_LOCATIONS = {
  HEADQUARTERS: {
    city: 'Victoria',
    province: 'BC' as ProvinceCode,
    country: DEFAULT_COUNTRY
  }
};

// Service areas (for future expansion)
export const SERVICE_AREAS = {
  PRIMARY: ['BC'],
  SECONDARY: ['AB', 'SK', 'MB'],
  BY_REQUEST: ['ON', 'QC', 'NB', 'NS', 'PE', 'NL', 'YT', 'NT', 'NU']
};
