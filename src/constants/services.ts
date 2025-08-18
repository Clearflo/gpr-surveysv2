// Service types offered by GPR Surveys
export const SERVICES = [
  {
    value: 'Underground Utility Detection',
    label: 'Underground Utility Detection',
    description: 'Utility locating & scanning for residential and commercial projects'
  },
  {
    value: 'Underground Storage Tank Detection',
    label: 'Underground Storage Tank Detection',
    description: 'Detection and verification of underground storage tanks'
  },
  {
    value: 'Environmental Drilling Support',
    label: 'Environmental Drilling Support',
    description: 'Daylighting and clearance for environmental drilling operations'
  },
  {
    value: 'Pre-Construction Locating',
    label: 'Pre-Construction Locating',
    description: 'Comprehensive utility mapping before construction begins'
  },
  {
    value: '3D Mapping & Asset Management',
    label: '3D Mapping & Asset Management',
    description: '3D mapping of subsurface utilities for asset management'
  },
  {
    value: 'Emergency Locate Services',
    label: 'Emergency Locate Services',
    description: 'Rapid response utility locating for urgent situations'
  }
] as const;

// Service values as a union type for TypeScript
export type ServiceType = typeof SERVICES[number]['value'];

// Duration options
export const DURATION_OPTIONS = {
  HALF_DAY: 'under-4',
  FULL_DAY: 'over-4'
} as const;

// Service duration array for UI components
export const SERVICE_DURATIONS = [
  {
    value: 'under-4',
    label: 'Half Day (Under 4 hours)',
    description: 'Best for smaller residential projects or targeted scans'
  },
  {
    value: 'over-4',
    label: 'Full Day (Over 4 hours)',
    description: 'Ideal for larger sites or comprehensive utility mapping'
  }
] as const;

export type DurationType = typeof DURATION_OPTIONS[keyof typeof DURATION_OPTIONS];
