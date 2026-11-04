import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

/* ------------------------------------------------------------------ */
/*  STATIC BLOG DATA - BLOG 3                                         */
/*  Put the image at: public/dubai-property-guide.png (or your image)  */
/* ------------------------------------------------------------------ */
const POST = {
  slug: "how-can-you-buy-property-in-dubai-a-step-by-step-process-for-2026",
  title: "How Can You Buy Property in Dubai? A Step-by-Step Process for 2026",
  category: "Dubai Real Estate",
  author: "Sippy Housing",
  published_at: "2026-11-04",
  read_time: 7,
  image: "/blogimg3.jpeg",
  tags: ["Dubai Property", "Step-by-Step", "Buyer Guide", "DLD Registration", "2026"],
  excerpt:
    "Buying a property in Dubai can be an exciting opportunity for homebuyers and international investors. Learn the complete step-by-step process, budget planning, ownership rules, and registration requirements for 2026.",
};

// ---------- small reusable pieces ----------
const slugify = (t: string) =>
  t.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const H2 = ({ children }: { children: string }) => (
  <h2 id={slugify(children)} className="scroll-mt-28 pt-6 text-2xl font-bold text-sippy-charcoal">{children}</h2>
);
const H3 = ({ children }: { children: string }) => (
  <h3 id={slugify(children)} className="scroll-mt-28 pt-2 text-xl font-bold text-sippy-charcoal">{children}</h3>
);
const UL = ({ items }: { items: React.ReactNode[] }) => (
  <ul className="list-disc space-y-1 pl-6">
    {items.map((t, i) => <li key={i}>{t}</li>)}
  </ul>
);

// Table of contents (labels must match the <H2> / <H3> text exactly)
const TOC: { label: string; sub?: boolean }[] = [
  { label: "Introduction" },
  { label: "1. Set Your Budget Before Starting Your Property Search" },
  { label: "2. Understand the Ownership Rules and Choose the Right Location" },
  { label: "3. Select the Right Property Type" },
  { label: "Ready-to-move properties", sub: true },
  { label: "Off-plan properties", sub: true },
  { label: "Apartments and villas", sub: true },
  { label: "4. Verify the Property and Developer Details" },
  { label: "5. Make an Offer and Review the Sale Agreement" },
  { label: "6. Arrange the No-Objection Certificate and Complete the Transfer" },
  { label: "7. Follow This Dubai Property Buying Process" },
  { label: "8. Keep Your Documents Ready" },
  { label: "9. Complete the Final Checks Before Taking Ownership" },
  { label: "Frequently Asked Questions (FAQs)" },
  { label: "Conclusion" },
];

const TableOfContents = () => {
  const [active, setActive] = useState(slugify(TOC[0].label));
  const holderRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const TOP = 112;
    const update = () => {
      const holder = holderRef.current, nav = navRef.current;
      if (!holder || !nav) return;
      const r = holder.getBoundingClientRect();
      if (r.top >= TOP) {
        nav.style.position = "static";
        nav.style.width = "auto";
        return;
      }
      nav.style.position = "fixed";
      nav.style.left = `${r.left}px`;
      nav.style.width = `${r.width}px`;
      nav.style.top = `${Math.min(TOP, r.bottom - nav.offsetHeight)}px`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    const els = TOC.map((t) => document.getElementById(slugify(t.label))).filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-100px 0px -65% 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(id);
  };

  return (
    <div ref={holderRef} className="h-full">
      <nav ref={navRef} aria-label="Table of contents">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-500">Table of Contents</p>
        <ul className="max-h-[calc(100vh-10rem)] space-y-1 overflow-y-auto border-l border-gray-200 pr-2">
          {TOC.map((t) => {
            const id = slugify(t.label);
            const on = active === id;
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={go(id)}
                  className={`block py-1.5 pr-1 text-sm leading-snug transition-colors ${t.sub ? "pl-8" : "pl-4"} ${
                    on ? "-ml-px border-l-2 border-sippy-gold font-semibold text-sippy-charcoal" : "text-gray-500 hover:text-sippy-charcoal"
                  }`}
                >
                  {t.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

const MobileTableOfContents = () => (
  <details className="mb-8 rounded-lg border bg-white p-4 lg:hidden">
    <summary className="cursor-pointer text-sm font-semibold uppercase tracking-widest text-gray-600">Table of Contents</summary>
    <ul className="mt-3 space-y-1 border-l border-gray-200">
      {TOC.map((t) => {
        const id = slugify(t.label);
        return (
          <li key={id}>
            <a
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault();
                (e.currentTarget.closest("details") as HTMLDetailsElement | null)?.removeAttribute("open");
                document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`block py-1.5 pr-1 text-sm text-gray-600 hover:text-sippy-charcoal ${t.sub ? "pl-8" : "pl-4"}`}
            >
              {t.label}
            </a>
          </li>
        );
      })}
    </ul>
  </details>
);

const FAQS = [
  ["Can foreigners purchase property in Dubai?", "Yes. Foreign nationals, including non-residents, can purchase property in Dubai's designated freehold areas, subject to the applicable ownership rules."],
  ["Do I need to live in Dubai to purchase property?", "No. Non-resident foreign buyers can purchase eligible properties in designated freehold areas. However, they must complete the required identity verification and registration formalities."],
  ["What is the main government authority for property registration in Dubai?", "The Dubai Land Department (DLD) is the government authority responsible for property registration and related real estate services in Dubai."],
  ["What additional costs should buyers consider?", "Buyers should account for applicable DLD fees (typically 4%), title deed and administrative charges, agent commission where agreed, mortgage costs if applicable, and ongoing property service charges."],
  ["Is it necessary to verify a property before purchasing it?", "Yes. Buyers should verify ownership, title details, project approvals, outstanding liabilities, and contractual conditions before completing a transaction."],
];

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

export default function BlogPost3() {
  useEffect(() => {
    window.scrollTo(0, 0);
    const oldTitle = document.title;
    document.title = `${POST.title} | Sippy Housing`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", POST.excerpt);
    return () => { document.title = oldTitle; };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto mt-20 w-full max-w-[1400px] px-4 py-8 md:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <article className="min-w-0">
            <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-sippy-gold">Home</Link> <span>›</span>
              <Link to="/blog" className="hover:text-sippy-gold">Blog</Link> <span>›</span>
              <span className="text-gray-700">{POST.title}</span>
            </nav>

            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-sippy-gold">{POST.category}</p>
            <h1 className="mb-4 text-3xl font-bold leading-tight text-sippy-charcoal md:text-4xl">{POST.title}</h1>
            <p className="mb-5 text-lg italic text-gray-600">{POST.excerpt}</p>

            <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1"><User className="h-4 w-4" />{POST.author}</span>
              <span className="inline-flex items-center gap-1"><Calendar className="h-4 w-4" />{formatDate(POST.published_at)}</span>
              <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" />{POST.read_time} min read</span>
            </div>

            <img
              src={POST.image}
              alt="How Can You Buy Property in Dubai? A Step-by-Step Process for 2026"
              className="mb-8 w-full rounded-xl object-cover shadow"
            />

            <MobileTableOfContents />

            <div className="space-y-5 text-lg leading-relaxed text-gray-700">
              <H2>Introduction</H2>
              <p>
                Buying a property in <Link to="/#properties" className="text-sippy-gold underline hover:text-sippy-charcoal">Dubai</Link> can be an exciting opportunity for homebuyers and international investors. The city offers a wide range of residential properties, including modern apartments, luxury villas, waterfront homes, and off-plan developments. However, before making a purchase, it is important to understand the legal requirements, ownership options, additional costs, and registration process.
              </p>
              <p>
                Whether you are purchasing a home for personal use or considering a long-term investment, understanding <Link to="/#properties" className="text-sippy-gold underline hover:text-sippy-charcoal">how to buy property in dubai</Link> can help you make informed decisions. With the right planning and professional guidance, the buying journey can become easier to manage.
              </p>
              <p>
                This guide explains the complete <Link to="/#international" className="text-sippy-gold underline hover:text-sippy-charcoal">dubai property buying process</Link>, from setting your budget and choosing the right location to completing the registration and receiving your ownership documents.
              </p>

              {/* 1 */}
              <H2>1. Set Your Budget Before Starting Your Property Search</H2>
              <p>
                The first step is to decide how much you can comfortably spend. Your budget should include more than the advertised property price because purchasing real estate involves additional expenses.
              </p>
              <p>Consider the following costs while planning:</p>
              <UL items={[
                "Property purchase price",
                "Dubai Land Department (DLD) registration and transfer fees",
                "Real estate agent commission, if applicable",
                "Mortgage arrangement and valuation charges, if financing is used",
                "Developer or property-related service charges",
                "Conveyancing and other administrative expenses",
              ]} />

              <div className="rounded-lg border-l-4 border-sippy-gold bg-white p-4 shadow-sm">
                <p>
                  <strong className="text-sippy-charcoal">Fee Breakdown:</strong> Dubai Land Department's property sale registration information lists a 2% fee for the seller and a 2% fee for the buyer (total 4%), along with additional charges for title deed issuance, maps, and service partners. Confirm the applicable fees for your specific transaction before making a financial commitment.
                </p>
              </div>

              <p>
                If you are planning to <Link to="/#international" className="text-sippy-gold underline hover:text-sippy-charcoal">buy property in dubai</Link> through a mortgage, speak with a bank or mortgage adviser early. Getting an initial financing assessment can help you understand your purchasing capacity.
              </p>

              {/* 2 */}
              <H2>2. Understand the Ownership Rules and Choose the Right Location</H2>
              <p>
                Dubai offers different property ownership arrangements. Foreign nationals can purchase property in designated freehold areas, where eligible buyers can obtain full ownership rights. Certain properties may also offer usufruct or leasehold rights for a period of up to 99 years.
              </p>
              <p>Before selecting a property, confirm the ownership type and whether the location is approved for your eligibility category.</p>
              <p>Some popular locations buyers explore include:</p>
              <UL items={[
                <><strong>Downtown Dubai:</strong> Known for its central location, high-rise residences, and access to major attractions.</>,
                <><strong>Dubai Marina:</strong> Popular for waterfront apartments, restaurants, and lifestyle facilities.</>,
                <><strong>Business Bay:</strong> An established area with residential and commercial developments.</>,
                <><strong>Dubai Hills Estate:</strong> Offers residential communities, green spaces, and family-oriented facilities.</>,
                <><strong>Palm Jumeirah:</strong> Recognised for luxury waterfront homes and premium residences.</>,
              ]} />
              <p>
                The best location depends on your budget, lifestyle, preferred property type, connectivity requirements, and investment objectives.
              </p>
              <p>
                You can explore property-related information and available real estate opportunities through the <Link to="/" className="text-sippy-gold underline hover:text-sippy-charcoal">Sippy Housing website</Link>.
              </p>

              {/* 3 */}
              <H2>3. Select the Right Property Type</H2>
              <p>Once you have shortlisted your preferred locations, decide what type of property suits your requirements.</p>

              <H3>Ready-to-move properties</H3>
              <p>These properties are already completed and can generally be inspected before purchase. They may be suitable for buyers who want to move in or evaluate an existing property before making a decision.</p>

              <H3>Off-plan properties</H3>
              <p>Off-plan properties are purchased before construction is completed. Buyers should carefully review the developer's background, project approvals, payment schedule, expected completion date, and escrow arrangements.</p>

              <H3>Apartments and villas</H3>
              <p>Apartments may suit individuals, couples, or buyers looking for access to shared facilities. Villas may be more appropriate for families seeking additional space, privacy, and outdoor areas.</p>
              <p>Before making a selection, compare the property's condition, layout, location, maintenance requirements, and overall value.</p>

              {/* 4 */}
              <H2>4. Verify the Property and Developer Details</H2>
              <p>Property verification is an important part of the purchasing journey. Never rely only on promotional photographs, advertisements, or verbal promises.</p>
              <p>Before proceeding, check:</p>
              <UL items={[
                "Whether the seller has the legal authority to sell the property.",
                "Whether the property title and ownership details are valid.",
                "Whether there are any outstanding mortgages, restrictions, or liabilities.",
                "Whether the property has the required approvals and documentation.",
                "Whether the developer and project are properly registered.",
                "Whether the agreed property details match the official documents.",
              ]} />
              <p>For off-plan purchases, review the sales agreement, construction milestones, payment conditions, and project-related escrow information.</p>
              <p>Buyers should also consider seeking independent legal or conveyancing advice before signing important documents.</p>

              {/* 5 */}
              <H2>5. Make an Offer and Review the Sale Agreement</H2>
              <p>After selecting a suitable property and completing the initial checks, the next step is to make an offer.</p>
              <p>The buyer and seller can negotiate the purchase price, payment terms, transfer arrangements, and other conditions. Once both parties agree, the terms are recorded in the relevant sale agreement or Memorandum of Understanding (MOU), where applicable.</p>
              <p>Read the agreement carefully before signing. Pay attention to:</p>
              <UL items={[
                "Final purchase price",
                "Deposit amount and payment conditions",
                "Completion and transfer deadlines",
                "Responsibilities of the buyer and seller",
                "Conditions related to mortgage approval",
                "Consequences of cancellation or delayed completion",
              ]} />
              <div className="rounded-lg bg-sippy-charcoal p-4 text-center font-semibold text-white">
                Important Rule: Do not transfer money without confirming the recipient, payment instructions, and contractual terms. Use the agreed and legally appropriate payment process.
              </div>

              {/* 6 */}
              <H2>6. Arrange the No-Objection Certificate and Complete the Transfer</H2>
              <p>For many resale transactions in Dubai, a No-Objection Certificate (NOC) from the developer is required before the transfer can be completed. The exact requirement depends on the property and transaction.</p>
              <p>Once the necessary documents and approvals are ready, the buyer and seller, or their authorised representatives, proceed with the registration process through an approved Dubai Land Department channel or Real Estate Registration Trustee Centre.</p>
              <p>The Dubai Land Department's registration procedure includes document verification, transaction data entry, fee payment, and submission of buyer details. Non-resident foreign buyers can use a valid passport for identity verification, while UAE residents may use their Emirates ID.</p>
              <p>After the transaction is successfully registered, the ownership documentation is issued through the relevant official process.</p>

              {/* 7 */}
              <H2>7. Follow This Dubai Property Buying Process</H2>
              <p>The complete buying journey becomes easier to understand when the main activities are viewed in sequence.</p>

              <div className="my-6 rounded-xl border bg-white p-6 shadow-sm">
                <p className="mb-4 text-center text-sm font-semibold uppercase tracking-wider text-sippy-charcoal">
                  Property Purchase Process – Step-by-Step Flow
                </p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { step: "01", title: "Set Your Budget", desc: "Calculate total purchase cost, DLD 4% fees and reserve" },
                    { step: "02", title: "Choose Location & Property", desc: "Select area (Downtown, Marina, Hills) & property type" },
                    { step: "03", title: "Check Ownership Eligibility", desc: "Verify freehold vs leasehold permissions" },
                    { step: "04", title: "Verify Property Documents", desc: "Check title deed, liabilities & developer escrow" },
                    { step: "05", title: "Make an Offer", desc: "Negotiate terms and confirm purchase price" },
                    { step: "06", title: "Review & Sign Agreement", desc: "Sign legally binding MOU / Form F" },
                    { step: "07", title: "Arrange Required Approvals", desc: "Obtain Developer NOC & mortgage clearance" },
                    { step: "08", title: "Complete DLD Registration", desc: "Register at Trustee Centre & pay official fees" },
                    { step: "09", title: "Receive Ownership Documents", desc: "Obtain official Title Deed in your name" },
                  ].map((s) => (
                    <div key={s.step} className="relative rounded-lg border border-gray-100 bg-gray-50/80 p-4 transition-all hover:border-sippy-gold">
                      <span className="text-xs font-bold text-sippy-gold">{s.step}</span>
                      <h4 className="mt-1 font-bold text-sippy-charcoal">{s.title}</h4>
                      <p className="mt-1 text-xs text-gray-600">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <p>Each stage should be completed carefully. Skipping property verification or overlooking contractual conditions can create unnecessary complications later.</p>

              {/* 8 */}
              <H2>8. Keep Your Documents Ready</H2>
              <p>Preparing the required documents in advance can help reduce delays during the purchase.</p>
              <p>Commonly required documents and information may include:</p>
              <UL items={[
                "Valid passport for non-resident foreign buyers",
                "Emirates ID for UAE residents, where applicable",
                "Signed sale agreement or relevant transaction documents",
                "Payment details and proof of funds, where required",
                "Mortgage approval documents, if purchasing through finance",
                "Developer NOC, where applicable",
                "Additional documents requested by the registration authority or transaction parties",
              ]} />
              <p>The exact requirements can vary depending on whether the buyer is a resident or non-resident, whether the property is ready or off-plan, and how the transaction is financed.</p>

              {/* 9 */}
              <H2>9. Complete the Final Checks Before Taking Ownership</H2>
              <p>Receiving the ownership documents is an important milestone, but buyers should also complete a few practical checks.</p>
              <p>For a ready property, arrange a final inspection and confirm that the property's condition matches the agreed terms. Check keys, access cards, utility arrangements, parking allocation, and any outstanding service charges.</p>
              <p>For an off-plan property, review the handover conditions, completion documentation, snagging process, and developer instructions.</p>
              <p>Keep copies of the signed agreements, payment receipts, registration documents, and other important records in a secure place.</p>

              {/* FAQs */}
              <H2>Frequently Asked Questions (FAQs)</H2>
              <div className="space-y-3">
                {FAQS.map(([q, a], i) => (
                  <details key={q} className="group rounded-lg border bg-white p-4">
                    <summary className="cursor-pointer font-semibold text-sippy-charcoal">{i + 1}. {q}</summary>
                    <p className="mt-2 text-base text-gray-600">{a}</p>
                  </details>
                ))}
              </div>

              {/* Conclusion */}
              <H2>Conclusion</H2>
              <p>
                Purchasing real estate in Dubai requires careful planning, proper documentation, and an understanding of the local ownership and registration rules. From choosing the right location and setting a realistic budget to reviewing the sale agreement and completing the official transfer, every step plays an important role in protecting the buyer's interests.
              </p>
              <p>
                If you are researching <Link to="/#international" className="text-sippy-gold underline hover:text-sippy-charcoal">how to buy property in dubai</Link>, take time to compare your options and verify all important details before committing. A well-planned approach to the <Link to="/#properties" className="text-sippy-gold underline hover:text-sippy-charcoal">dubai property buying process</Link> can help you make a more confident property decision.
              </p>
              <p>
                For more information about the company and its real estate services, visit the <Link to="/about" className="text-sippy-gold underline hover:text-sippy-charcoal">About Sippy Housing page</Link> or explore the <Link to="/" className="text-sippy-gold underline hover:text-sippy-charcoal">Sippy Housing website</Link>.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {POST.tags.map((t) => (
                <span key={t} className="rounded-full border bg-white px-3 py-1 text-sm text-gray-600">{t}</span>
              ))}
            </div>

            <div className="mt-10 rounded-xl bg-white p-6 text-center shadow">
              <p className="mb-3 font-semibold text-sippy-charcoal">Looking for your next property?</p>
              <Link to="/" className="inline-block rounded-lg bg-sippy-gold px-6 py-2 font-semibold text-white hover:bg-sippy-gold/90">Explore properties</Link>
            </div>

            <Link to="/blog" className="mt-8 inline-flex items-center text-sippy-gold hover:text-sippy-charcoal">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to all blogs
            </Link>
          </article>

          <aside className="hidden lg:block lg:self-stretch">
            <TableOfContents />
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}