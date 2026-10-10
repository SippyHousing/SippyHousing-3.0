# notify-enquiry – e-mail + WhatsApp alert for every contact-us enquiry

1. Install the Supabase CLI and log in:  `supabase login` then `supabase link --project-ref YOUR_PROJECT_REF`
2. Set the secrets (use only the channels you want):
```
supabase secrets set NOTIFY_EMAIL="info@yourcompany.com,second@yourcompany.com"
supabase secrets set RESEND_API_KEY="re_xxx"
supabase secrets set MAIL_FROM="Sippy Housing <enquiry@yourdomain.com>"

supabase secrets set NOTIFY_WHATSAPP="919820053962,917777030607"
supabase secrets set WHATSAPP_TOKEN="EAAG..."
supabase secrets set WHATSAPP_PHONE_ID="1234567890"
# optional – needed for numbers that have not messaged your business number in the last 24 hours
supabase secrets set WHATSAPP_TEMPLATE="new_enquiry"
```
3. Deploy:  `supabase functions deploy notify-enquiry --no-verify-jwt`
4. Submit a test on the website. Check Admin > Enquiries, the inbox and WhatsApp.

Notes
- The enquiry is ALWAYS saved first; if e-mail/WhatsApp fails the visitor still sees success.
- WhatsApp: automatic sending needs the free WhatsApp Business Cloud API (Meta). Without it, use the
  "WhatsApp" and "Email" buttons next to every enquiry in Admin > Enquiries.
