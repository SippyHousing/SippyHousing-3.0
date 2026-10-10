import { supabase } from '@/lib/supabase'

export type EnquiryStatus = 'New' | 'Contacted' | 'Closed'

export interface Enquiry {
  id: string
  full_name: string
  phone_number: string
  email?: string | null
  interest_area: string
  message?: string | null
  source?: string | null
  status: EnquiryStatus
  admin_notes?: string | null
  created_at: string
  /** true = submitted before the Enquiries table existed (comes from the old "clients" table) */
  legacy?: boolean
}

export type NewEnquiry = Pick<Enquiry, 'full_name' | 'phone_number' | 'interest_area'> &
  Partial<Pick<Enquiry, 'email' | 'message' | 'source'>>

export const enquiryService = {
  /**
   * Public contact-form submit.
   * 1) saves the enquiry (no .select(): visitors may insert but not read)
   * 2) asks the server function to send the e-mail + WhatsApp alert.
   *    The alert is best-effort – if it fails the enquiry is still saved.
   */
  async submitEnquiry(enquiry: NewEnquiry): Promise<{ notified: boolean }> {
    const payload = {
      full_name: enquiry.full_name,
      phone_number: enquiry.phone_number,
      email: enquiry.email || null,
      interest_area: enquiry.interest_area || 'General Inquiry',
      message: enquiry.message || null,
      source: enquiry.source || 'Contact Us Form',
    }

    const { error } = await supabase.from('enquiries').insert([payload])
    if (error) throw new Error(`Error saving enquiry: ${error.message}`)

    // Email/WhatsApp alert is only attempted once the server function is deployed and
    // VITE_ENQUIRY_ALERTS=true is set in .env / Vercel. Until then nothing is called and no error appears.
    let notified = false
    if (import.meta.env.VITE_ENQUIRY_ALERTS !== 'true') return { notified }
    try {
      const { error: fnError } = await supabase.functions.invoke('notify-enquiry', { body: payload })
      notified = !fnError
      if (fnError) console.warn('notify-enquiry failed (enquiry was saved):', fnError.message)
    } catch (e) {
      console.warn('notify-enquiry unavailable (enquiry was saved):', e)
    }
    return { notified }
  },

  /**
   * All enquiries: the new "enquiries" table + messages sent earlier through the old contact form
   * (stored in "clients"), so nothing disappears from the admin panel.
   * `warning` explains what to do if the new table is not set up yet.
   */
  async getAllEnquiries(): Promise<{ items: Enquiry[]; warning?: string }> {
    let warning: string | undefined
    let current: Enquiry[] = []
    let legacy: Enquiry[] = []

    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      warning = `Could not read the enquiries table (${error.message}). Run migrations/007_enquiries_and_sales_contact.sql in the Supabase SQL editor, and make sure you are logged in as admin.`
    } else {
      // Tolerate tables created with other column names (name / phone / mobile …)
      current = ((data || []) as Record<string, unknown>[]).map((r) => ({
        ...r,
        id: String(r.id),
        full_name: String(r.full_name ?? r.name ?? r.fullname ?? ''),
        phone_number: String(r.phone_number ?? r.phone ?? r.mobile ?? ''),
        interest_area: String(r.interest_area ?? r.interest ?? r.subject ?? 'General Inquiry'),
        status: (r.status as EnquiryStatus) || 'New',
        created_at: String(r.created_at ?? r.inserted_at ?? new Date().toISOString()),
      })) as Enquiry[]
    }

    const { data: old, error: oldError } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })
    if (!oldError && old) {
      legacy = (old as Enquiry[]).map((c) => ({
        ...c,
        status: 'New' as EnquiryStatus,
        source: 'Old contact form',
        legacy: true,
      }))
    }

    const items = [...current, ...legacy].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    return { items, warning }
  },

  async updateEnquiry(id: string, updates: Partial<Pick<Enquiry, 'status' | 'admin_notes'>>): Promise<void> {
    const { error } = await supabase.from('enquiries').update(updates).eq('id', id)
    if (error) throw new Error(`Error updating enquiry: ${error.message}`)
  },

  async deleteEnquiry(id: string, legacy = false): Promise<void> {
    const { error } = await supabase.from(legacy ? 'clients' : 'enquiries').delete().eq('id', id)
    if (error) throw new Error(`Error deleting enquiry: ${error.message}`)
  },
}
