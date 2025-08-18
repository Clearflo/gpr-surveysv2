export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          first_name: string
          last_name: string
          company: string | null
          email: string
          phone: string
          billing_email: string
          billing_address_line1: string
          billing_address_line2: string | null
          billing_city: string
          billing_province: string
          billing_postal_code: string
          billing_country: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          company?: string | null
          email: string
          phone: string
          billing_email: string
          billing_address_line1: string
          billing_address_line2?: string | null
          billing_city: string
          billing_province: string
          billing_postal_code: string
          billing_country?: string
          created_at?: string | null
          updated_at?: string | null
        }
      }
      bookings: {
        Row: {
          id: string
          customer_id: string | null
          service: string
          project_details: string | null
          bc1_call_number: string | null
          date: string
          booking_time: string | null
          end_date: string | null
          site_contact_first_name: string
          site_contact_last_name: string
          site_contact_phone: string
          site_contact_email: string | null
          site_address_line1: string
          site_address_line2: string | null
          site_city: string
          site_province: string
          site_postal_code: string
          site_country: string
          notes: string | null
          payment_method: string
          purchase_order: string | null
          status: string
          is_blocked: boolean | null
          admin_code: string | null
          created_at: string | null
          updated_at: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          cancellation_reason: string | null
          rescheduled_from_date: string | null
          rescheduled_to_date: string | null
          rescheduled_at: string | null
          rescheduled_by: string | null
          customer_email: string | null
          customer_phone: string | null
          job_number: string | null
        }
        Insert: {
          id?: string
          customer_id?: string | null
          service: string
          project_details?: string | null
          bc1_call_number?: string | null
          date: string
          booking_time?: string | null
          end_date?: string | null
          site_contact_first_name: string
          site_contact_last_name: string
          site_contact_phone: string
          site_contact_email?: string | null
          site_address_line1: string
          site_address_line2?: string | null
          site_city: string
          site_province: string
          site_postal_code: string
          site_country?: string
          notes?: string | null
          payment_method: string
          purchase_order?: string | null
          status?: string
          is_blocked?: boolean | null
          admin_code?: string | null
          created_at?: string | null
          updated_at?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          cancellation_reason?: string | null
          rescheduled_from_date?: string | null
          rescheduled_to_date?: string | null
          rescheduled_at?: string | null
          rescheduled_by?: string | null
          customer_email?: string | null
          customer_phone?: string | null
          job_number?: string | null
        }
      }
    }
  }
}
