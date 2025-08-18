-- Add missing service types to the booking_service enum
-- This migration adds service values that are being used in the frontend but missing from the database enum

-- Add the missing service type to the enum
ALTER TYPE booking_service ADD VALUE IF NOT EXISTS 'Subsurface Utility Locating & Scanning';

-- Add other potentially missing service types that might be used in the application
ALTER TYPE booking_service ADD VALUE IF NOT EXISTS 'Concrete Scanning';
ALTER TYPE booking_service ADD VALUE IF NOT EXISTS 'Structural Scanning';
ALTER TYPE booking_service ADD VALUE IF NOT EXISTS 'Rebar Detection';
ALTER TYPE booking_service ADD VALUE IF NOT EXISTS 'Void Detection';
ALTER TYPE booking_service ADD VALUE IF NOT EXISTS 'Post-Tension Cable Detection';
ALTER TYPE booking_service ADD VALUE IF NOT EXISTS 'Utility Locating';
ALTER TYPE booking_service ADD VALUE IF NOT EXISTS 'GPR Surveys';
ALTER TYPE booking_service ADD VALUE IF NOT EXISTS 'Ground Penetrating Radar';

-- Display all current enum values for verification
SELECT unnest(enum_range(NULL::booking_service)) as service_type ORDER BY service_type;
