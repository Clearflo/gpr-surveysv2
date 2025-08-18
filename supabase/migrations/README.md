# Supabase Migrations

## Current Schema

The database schema is now consolidated in a single migration file:
- `00000000000000_initial_schema.sql` - Complete database schema

## Migration History

### Consolidation (2025-06-10)
All 31 previous migrations have been consolidated into a single initial schema file. This was done to:
- Improve AI context window usage by reducing file count
- Simplify database setup for new environments
- Remove duplicate and conflicting migrations
- Create a clean baseline for future migrations

### Archived Migrations
The original 31 migration files have been archived and can be found in the project history. They included:
- Initial booking system setup
- Customer management tables
- Contact form submissions
- Estimate request functionality
- Time slot selection feature (added 2025-06-09)
- Various bug fixes and improvements

## Important Notes

1. **For Production**: If these migrations have already been applied to production, DO NOT re-run the consolidated migration. Only new environments should use the consolidated schema.

2. **For New Environments**: Use the consolidated migration to set up the complete schema in one step.

3. **Future Migrations**: Create new migration files with timestamps after the consolidation date (2025-06-10).

## Schema Overview

### Tables
- `customers` - Customer information and billing details
- `bookings` - Booking records with time slot selection
- `contact_submissions` - Contact form submissions
- `estimate_requests` - Online estimate requests

### Key Features
- Row Level Security (RLS) on all tables
- Time slot booking (8 AM - 5 PM, 30-minute intervals)
- One booking per day validation
- Booking status tracking
- Admin blocking functionality
- Automatic timestamp updates
