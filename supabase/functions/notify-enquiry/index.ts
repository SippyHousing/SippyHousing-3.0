// Supabase Edge Function: notify-enquiry
// Sends every new contact-us enquiry to the company by E-MAIL (Resend) and WHATSAPP (Meta Cloud API)
// at the same time. Each channel is optional: it is used only when its secrets are set.
//
// Secrets (Supabase Dashboard > Edge Functions > Secrets, or `supabase secrets set ...`):
//   NOTIFY_EMAIL            comma separated list of company e-mail addresses to notify
//   RESEND_API_KEY          from https://resend.com
//   MAIL_FROM               e.g. "Sippy Housing <enquiry@yourdomain.com>" (domain verified in Resend)
//   NOTIFY_WHATSAPP         comma separated numbers with country code, digits only: 919820053962,917777030607
//   WHATSAPP_TOKEN          permanent access token of the WhatsApp Cloud API app
//   WHATSAPP_PHONE_ID       phone-number ID of the WhatsApp Business number
//   WHATSAPP_TEMPLATE       (optional) approved template name – needed to message numbers that have not
//                           written to your business in the last 24 hours. Template must have ONE body
//                           variable {{1}} which receives the whole enquiry text.
//   WHATSAPP_TEMPLATE_LANG  (optional) default "en"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Enquiry {
  full_name: string
  phone_number: string
  email?: string | null
  interest_area?: string
  message?: string | null
  source?: string
}

const list = (v?: string) => (v || '').split(',').map((s) => s.trim()).filter(Boolean)
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string))

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const e: Enquiry = await req.json()
    if (!e?.full_name || !e?.phone_number) {
      return new Response(JSON.stringify({ error: 'name and phone are required' }), { status: 400, headers: corsHeaders })
    }

    const when = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    const text =
      `New enquiry – Sippy Housing\n` +
      `Name: ${e.full_name}\nPhone: ${e.phone_number}\nEmail: ${e.email || '-'}\n` +
      `Interested in: ${e.interest_area || 'General Inquiry'}\nMessage: ${e.message || '-'}\nTime: ${when}`

    const results: Record<string, unknown> = {}

    // ---- E-MAIL (Resend) ----
    const emails = list(Deno.env.get('NOTIFY_EMAIL'))
    const resendKey = Deno.env.get('RESEND_API_KEY')
    const mailTask = (async () => {
      if (!emails.length || !resendKey) return (results.email = 'skipped (not configured)')
      const html =
        `<h2>New enquiry – Sippy Housing</h2><table cellpadding="6" style="border-collapse:collapse">` +
        [['Name', e.full_name], ['Phone', e.phone_number], ['Email', e.email || '-'],
         ['Interested in', e.interest_area || 'General Inquiry'], ['Message', e.message || '-'], ['Time', when]]
          .map(([k, v]) => `<tr><td><b>${k}</b></td><td>${esc(String(v))}</td></tr>`).join('') + `</table>`
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: Deno.env.get('MAIL_FROM') || 'Sippy Housing <onboarding@resend.dev>',
          to: emails,
          reply_to: e.email || undefined,
          subject: `New enquiry from ${e.full_name} – ${e.interest_area || 'General Inquiry'}`,
          html,
          text,
        }),
      })
      results.email = r.ok ? 'sent' : `failed ${r.status}: ${await r.text()}`
    })()

    // ---- WHATSAPP (Meta Cloud API) ----
    const numbers = list(Deno.env.get('NOTIFY_WHATSAPP')).map((n) => n.replace(/\D/g, ''))
    const waToken = Deno.env.get('WHATSAPP_TOKEN')
    const waPhoneId = Deno.env.get('WHATSAPP_PHONE_ID')
    const template = Deno.env.get('WHATSAPP_TEMPLATE')
    const waTask = (async () => {
      if (!numbers.length || !waToken || !waPhoneId) return (results.whatsapp = 'skipped (not configured)')
      const outcomes = await Promise.all(numbers.map(async (to) => {
        const body = template
          ? { messaging_product: 'whatsapp', to, type: 'template',
              template: { name: template, language: { code: Deno.env.get('WHATSAPP_TEMPLATE_LANG') || 'en' },
                components: [{ type: 'body', parameters: [{ type: 'text', text: text.replace(/\n/g, ' | ') }] }] } }
          : { messaging_product: 'whatsapp', to, type: 'text', text: { body: text } }
        const r = await fetch(`https://graph.facebook.com/v20.0/${waPhoneId}/messages`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${waToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        return r.ok ? `${to}: sent` : `${to}: failed ${r.status} ${await r.text()}`
      }))
      results.whatsapp = outcomes
    })()

    await Promise.all([mailTask, waTask])
    return new Response(JSON.stringify({ ok: true, results }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: corsHeaders })
  }
})
