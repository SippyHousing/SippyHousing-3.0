import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { MessageSquareText, X, CheckCircle2, Loader2 } from "lucide-react";
import { enquiryService } from "@/services/enquiryService";
import { normalizeIndianPhone, GENERAL_CONTACT_NUMBER, formatIndianPhone, getPhoneHref } from "@/lib/contactRouting";

/**
 * Site-wide enquiry form.
 *  1. Opens automatically a few seconds after a visitor lands on the home page (once per visit).
 *     The visitor can fill it in or close it.
 *  2. A floating "Enquire Now" button stays on every public page so anyone can open the
 *     same form at any time and send an enquiry.
 * Enquiries are saved in the existing "enquiries" table (Admin → Enquiries).
 */

const AUTO_OPEN_DELAY_MS = 2000;                  // popup opens this many ms after the website loads
const SUBMITTED_KEY = "sippy_enquiry_submitted";  // timestamp – pauses the auto-popup after someone sends an enquiry
const SUBMITTED_QUIET_DAYS = 1;                   // 0 = always show the popup, even after a submit

// Lives for as long as the page is loaded: popup opens once per website load (a refresh / new visit shows it again),
// but moving between pages inside the site does not re-open it.
let autoOpenedThisLoad = false;

const INTERESTS = [
  "General Inquiry",
  "New Projects",
  "Luxury Homes",
  "Resale / Rental (Residential)",
  "Commercial",
  "Plots / Lands",
  "Redevelopment / Joint Venture",
  "Hotels",
  "Independent Buildings",
  "International / Dubai",
];

const safeGet = (store: Storage, key: string) => { try { return store.getItem(key); } catch { return null; } };
const safeSet = (store: Storage, key: string, value: string) => { try { store.setItem(key, value); } catch { /* private mode */ } };

const recentlySubmitted = () => {
  const ts = Number(safeGet(localStorage, SUBMITTED_KEY));
  return SUBMITTED_QUIET_DAYS > 0 && !!ts && Date.now() - ts < SUBMITTED_QUIET_DAYS * 86_400_000;
};

const EMPTY = { full_name: "", phone_number: "", email: "", interest_area: "General Inquiry", message: "", website: "" };

const EnquiryWidget = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState("Website Popup");
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState("");

  const isAdminArea = pathname.startsWith("/admin");

  const close = useCallback(() => {
    setOpen(false);
    // reset after the closing animation so a reopened form is fresh (keep nothing if already sent)
    setTimeout(() => { setDone(false); setServerError(""); setErrors({}); }, 200);
  }, []);

  const openManually = () => { setSource("Enquire Now Button"); setOpen(true); };

  // Auto-open when the website is opened (on whichever public page the visitor lands first).
  // Add ?enquiry=1 to any URL to force it open while testing.
  useEffect(() => {
    if (isAdminArea) return;
    const forced = new URLSearchParams(window.location.search).get("enquiry") === "1";
    if (!forced && (autoOpenedThisLoad || recentlySubmitted())) return;
    const t = setTimeout(() => {
      autoOpenedThisLoad = true;   // set here (not before) so React dev double-run can't skip the popup
      setSource("Website Popup");
      setOpen(true);
    }, AUTO_OPEN_DELAY_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Esc to close + lock page scroll while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, close]);

  if (isAdminArea) return null;

  const set = (k: keyof typeof EMPTY, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.full_name.trim().length < 2) e.full_name = "Please enter your name";
    const digits = normalizeIndianPhone(form.phone_number);
    if (digits.length < 10 || digits.length > 13) e.phone_number = "Enter a valid phone number";
    if (form.email.trim() && !/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = "Enter a valid email or leave it empty";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (form.website) return; // honeypot – bots fill this hidden field
    if (!validate()) return;
    setSubmitting(true);
    setServerError("");
    try {
      await enquiryService.submitEnquiry({
        full_name: form.full_name.trim(),
        phone_number: form.phone_number.trim(),
        email: form.email.trim() || undefined,
        interest_area: form.interest_area,
        message: form.message.trim() || undefined,
        source,
      });
      safeSet(localStorage, SUBMITTED_KEY, String(Date.now()));
      setForm(EMPTY);
      setDone(true);
      setTimeout(() => setOpen(false), 4000);
    } catch (err) {
      console.error("Enquiry failed:", err);
      setServerError(`We couldn't send your enquiry. Please try again or call ${formatIndianPhone(GENERAL_CONTACT_NUMBER)}.`);
    } finally {
      setSubmitting(false);
    }
  };

  const field = "w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-sippy-charcoal focus:outline-none focus:ring-2 focus:ring-sippy-gold focus:border-sippy-gold";

  return (
    <>
      {/* Floating button – always available on public pages */}
      {!open && (
        // <button
        //   type="button"
        //   onClick={openManually}
        //   aria-label="Send an enquiry"
        //   className="fixed bottom-5 left-4 sm:left-6 z-50 flex items-center gap-2 rounded-full bg-sippy-gold text-sippy-charcoal font-semibold shadow-lg hover:shadow-xl hover:brightness-105 transition px-4 py-3"
        // >
        //   <MessageSquareText className="h-5 w-5" />
        //   <span className="text-sm">Enquire Nows</span>
        // </button>

        <button
  type="button"
  onClick={openManually}
  aria-label="Send an enquiry"
  className="fixed bottom-20 sm:bottom-24 left-8 sm:left-12 z-50 flex items-center gap-2 rounded-full bg-sippy-gold text-white font-semibold shadow-lg hover:shadow-xl hover:brightness-105 transition px-4 py-3"
>
  <MessageSquareText className="h-5 w-5" />
  <span className="text-sm">Enquire Now</span>
</button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4"
          onClick={close}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Enquiry form"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full sm:max-w-md max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-3 top-3 rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
            >
              <X className="h-5 w-5" />
            </button>

            {done ? (
              <div className="px-6 py-12 text-center">
                <CheckCircle2 className="mx-auto h-14 w-14 text-green-600" />
                <h3 className="mt-4 font-playfair text-2xl text-sippy-charcoal">Thank you!</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Your enquiry has been sent. Our team will contact you shortly.
                </p>
                <button type="button" onClick={close} className="mt-6 rounded-md bg-sippy-charcoal px-6 py-2.5 text-sm font-semibold text-white">
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="px-5 pb-6 pt-8 sm:px-7">
                <h3 className="font-playfair text-2xl text-sippy-charcoal">
                  Looking for your <span className="text-sippy-gold">dream property?</span>
                </h3>
                <p className="mt-1 mb-5 text-sm text-gray-600">
                  Share your details and our property specialist will get back to you.
                </p>

                <div className="space-y-3.5">
                  <div>
                    <input className={field} placeholder="Full name *" autoComplete="name" value={form.full_name} onChange={(e) => set("full_name", e.target.value)} />
                    {errors.full_name && <p className="mt-1 text-xs text-red-600">{errors.full_name}</p>}
                  </div>
                  <div>
                    <input className={field} placeholder="Phone number *" type="tel" inputMode="tel" autoComplete="tel" value={form.phone_number} onChange={(e) => set("phone_number", e.target.value)} />
                    {errors.phone_number && <p className="mt-1 text-xs text-red-600">{errors.phone_number}</p>}
                  </div>
                  <div>
                    <input className={field} placeholder="Email (optional)" type="email" inputMode="email" autoComplete="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
                    {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                  </div>
                  <select className={field} value={form.interest_area} onChange={(e) => set("interest_area", e.target.value)} aria-label="I am interested in">
                    {INTERESTS.map((i) => <option key={i} value={i}>{i}</option>)}
                  </select>
                  {/* <textarea className={field} rows={3} placeholder="Message (optional) – budget, location, BHK…" value={form.message} onChange={(e) => set("message", e.target.value)} /> */}

                  {/* Honeypot: hidden from people, filled by bots */}
                  <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.website} onChange={(e) => set("website", e.target.value)}
                    style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />
                </div>

                {serverError && <p className="mt-3 text-sm text-red-600">{serverError}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-sippy-gold py-3 font-semibold text-sippy-charcoal transition hover:brightness-105 disabled:opacity-60"
                >
                  {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : "Send Enquiry"}
                </button>
                <button type="button" onClick={close} className="mt-2 w-full py-2 text-sm text-gray-500 hover:text-gray-800">
                  Maybe later
                </button>
                {/* <p className="mt-2 text-center text-xs text-gray-500">
                  Or call us: <a className="font-semibold text-sippy-charcoal" href={getPhoneHref(GENERAL_CONTACT_NUMBER)}>{formatIndianPhone(GENERAL_CONTACT_NUMBER)}</a>
                </p> */}
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default EnquiryWidget;