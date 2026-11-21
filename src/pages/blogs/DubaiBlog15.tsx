import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, User, ShieldCheck, MapPin, CheckCircle2, AlertCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

/* ------------------------------------------------------------------ */
/*  STATIC BLOG DATA - BLOG 15 (Can Indians Buy Property in Dubai?)   */
/*  Put the image at: public/blogimg15.jpeg (or change path below)    */
/* ------------------------------------------------------------------ */
const POST = {
  slug: "can-indians-buy-property-in-dubai-what-are-the-rules-eligibility-and-required-documents",
  title: "Can Indians Buy Property in Dubai? What Are the Rules, Eligibility and Required Documents?",
  category: "Buyer & Legal Guide",
  author: "Sippy Housing",
  published_at: "2026-11-18",
  read_time: 9,
  image: "/blogimg15.jpeg",
  tags: [
    "Indians in Dubai",
    "Dubai Real Estate",
    "NRI Property Investment",
    "FEMA & LRS",
    "DLD Registration",
    "Dubai Marina",
    "Downtown Dubai",
    "Golden Visa",
    "2026",
  ],
  excerpt:
    "Can Indian residents and NRIs purchase property in Dubai? Discover the foreign ownership rules, LRS & FEMA remittance guidelines, required documents, step-by-step buying process, and additional costs.",
};

// ---------- small reusable pieces ----------
const slugify = (t: string) =>
  t.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const H2 = ({ children }: { children: string }) => (
  <h2 id={slugify(children)} className="scroll-mt-28 pt-6 text-2xl font-bold text-sippy-charcoal">
    {children}
  </h2>
);

const H3 = ({ children }: { children: string }) => (
  <h3 id={slugify(children)} className="scroll-mt-28 pt-2 text-xl font-bold text-sippy-charcoal">
    {children}
  </h3>
);

const UL = ({ items }: { items: string[] }) => (
  <ul className="list-disc space-y-1.5 pl-6">
    {items.map((t, i) => (
      <li key={i}>{t}</li>
    ))}
  </ul>
);

const Table = ({ head, rows }: { head: string[]; rows: (string | React.ReactNode)[][] }) => (
  <div className="overflow-x-auto rounded-lg border bg-white">
    <table className="w-full text-left text-base">
      <thead className="bg-sippy-charcoal text-white">
        <tr>
          {head.map((h) => (
            <th key={h} className="px-4 py-3 font-semibold">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className="border-t">
            {r.map((c, j) => (
              <td
                key={j}
                className={`px-4 py-3 align-top ${j === 0 ? "font-semibold text-sippy-charcoal" : ""}`}
              >
                {c}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

//const linkClass = "text-sippy-gold underline hover:text-sippy-charcoal font-medium";
const linkClass = "text-sippy-gold hover:underline hover:text-sippy-charcoal font-medium";
// Table of contents
const TOC = [
  { label: "Introduction" },
  { label: "Can Indians Buy Property in Dubai?" },
  { label: "Which Dubai Areas Can Indian Buyers Purchase Property In?" },
  { label: "1. Dubai Marina", sub: true },
  { label: "2. Downtown Dubai", sub: true },
  { label: "3. Business Bay", sub: true },
  { label: "4. Dubai Hills Estate", sub: true },
  { label: "5. Jumeirah Village Circle (JVC)", sub: true },
  { label: "What Are the Rules for Indian Residents Buying Property in Dubai?" },
  { label: "Can NRIs Buy Property in Dubai?" },
  { label: "What Documents Do Indians Need to Buy Property in Dubai?" },
  { label: "How Can Indians Buy Property in Dubai? Step-by-Step Process" },
  { label: "What Is the Difference Between Buying Ready and Off-Plan Property in Dubai?" },
  { label: "What Additional Costs Should Indian Buyers Consider?" },
  { label: "Can Indians Get a Dubai Golden Visa Through Property Investment?" },
  { label: "What Should Indian Buyers Check Before Finalising a Property Purchase?" },
  { label: "Frequently Asked Questions" },
  { label: "Explore Dubai Property Opportunities with Sippy Housing" },
];

const TableOfContents = () => {
  const [active, setActive] = useState(slugify(TOC[0].label));
  const holderRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const TOP = 112;
    const update = () => {
      const holder = holderRef.current,
        nav = navRef.current;
      if (holder && nav) {
        const r = holder.getBoundingClientRect();
        if (r.top <= TOP) {
          nav.style.position = "fixed";
          nav.style.top = `${TOP}px`;
          nav.style.width = `${holder.offsetWidth}px`;
        } else {
          nav.style.position = "static";
          nav.style.top = "auto";
          nav.style.width = "auto";
        }
      }

      const ids = TOC.map((t) => slugify(t.label));
      let cur = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 140) cur = id;
      }
      setActive(cur);
    };

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div ref={holderRef} className="w-full">
      <nav
        ref={navRef}
        aria-label="Table of contents"
        className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
      >
        <p className="mb-3 font-bold text-sippy-charcoal">Table of Contents</p>
        <ul className="max-h-[calc(100vh-180px)] space-y-1.5 overflow-y-auto text-sm text-gray-600 pr-1">
          {TOC.map((t) => {
            const id = slugify(t.label);
            const isAct = active === id;
            return (
              <li key={t.label} className={t.sub ? "pl-4" : ""}>
                <a
                  href={`#${id}`}
                  className={`block py-1 transition-colors ${
                    isAct ? "font-semibold text-sippy-gold" : "hover:text-sippy-gold"
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

// FAQ list
const FAQS = [
  {
    q: "Can Indian citizens buy apartments in Dubai?",
    a: "Yes. Indian citizens can purchase eligible apartments in Dubai's designated foreign-ownership (freehold) areas, subject to standard Dubai Land Department property registration rules without any nationality restrictions.",
  },
  {
    q: "Can an Indian resident buy property in Dubai while living in India?",
    a: "Yes. Indian residents can purchase overseas property using permitted remittances under the Reserve Bank of India's Liberalised Remittance Scheme (LRS), subject to applicable FEMA regulations and the annual remittance limit ($250,000 USD per financial year per individual).",
  },
  {
    q: "Do Indians need a UAE residence visa to purchase property?",
    a: "No. A UAE residence visa is not required to purchase freehold property in Dubai. Foreign buyers can acquire, register, and own property while residing in India or anywhere else internationally.",
  },
  {
    q: "What is the minimum investment required to buy property in Dubai?",
    a: "There is no statutory minimum purchase price required simply to own property in Dubai. Studios in areas like JVC or Dubai South start around AED 450,000 to AED 600,000. However, if your goal is long-term residency (UAE Golden Visa), the minimum property valuation threshold is AED 2,000,000.",
  },
  {
    q: "Can Indians buy property in Dubai with a mortgage?",
    a: "Yes. Eligible Indian residents and NRIs can obtain non-resident home loans from UAE banks. Non-resident buyers typically require a down payment of 40% to 50%, subject to income assessment and lender approval.",
  },
];

export default function BlogPost15() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${POST.title} | Sippy Housing`;
    let m = document.querySelector('meta[name="description"]');
    if (!m) {
      m = document.createElement("meta");
      m.setAttribute("name", "description");
      document.head.appendChild(m);
    }
    m.setAttribute("content", POST.excerpt);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8 mt-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
          <article className="min-w-0">
            {/* Breadcrumb */}
            <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm text-gray-500">
              <Link to="/" className="hover:text-sippy-gold">Home</Link>
              <span>›</span>
              <Link to="/blog" className="hover:text-sippy-gold">Blog</Link>
              <span>›</span>
              <span className="text-gray-700">{POST.title}</span>
            </nav>

            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-sippy-gold">
              {POST.category}
            </p>
            <h1 className="mb-4 text-3xl font-bold leading-tight text-sippy-charcoal md:text-4xl">
              {POST.title}
            </h1>
            <p className="mb-5 text-lg italic text-gray-600">{POST.excerpt}</p>

            {/* Author / Date / Time */}
            <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1">
                <User className="h-4 w-4" />
                {POST.author}
              </span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Nov 18, 2026
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {POST.read_time} min read
              </span>
            </div>

            {/* Cover image */}
            <div className="relative mb-8 overflow-hidden rounded-xl bg-gray-100">
              <img
                src={POST.image}
                alt={POST.title}
                className="w-full object-cover max-h-[480px]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/blogimg1.jpeg";
                }}
              />
            </div>

            {/* Article Content */}
            <div className="space-y-5 text-lg leading-relaxed text-gray-700">
              <H2>Introduction</H2>
              <p>
                Dubai has become an attractive real estate destination for Indian buyers looking for residential properties, rental income opportunities, and long-term investments. Its modern infrastructure, international business environment, high rental yields, and zero capital gains tax make it a natural choice for individuals exploring property outside India.
              </p>
              <p>
                <strong>But can Indians buy property in Dubai while living in India?</strong> Yes. Indian nationals can purchase property in Dubai, including eligible freehold properties in designated communities across the emirate. However, the buying process, payment arrangements, and documentation requirements depend on whether the buyer is an Indian resident living in India, a Non-Resident Indian (NRI), or another category of eligible investor.
              </p>
              <p>
                Understanding the rules before making a purchase helps buyers plan their finances under Indian remittance laws, verify property ownership with the Dubai Land Department (DLD), and complete the transaction smoothly.
              </p>
              <p>
                If you are exploring real estate opportunities in the UAE, visit{" "}
                <Link to="/#invest-dubai" className={linkClass}>Sippy Housing</Link>{" "}
                to discover curated Dubai properties and understand your investment options.
              </p>

              <H2>Can Indians Buy Property in Dubai?</H2>
              <p>
                Yes, Indian citizens can purchase property in Dubai. Foreign nationals, including Indian buyers, have had the legal right to acquire freehold property since the introduction of Law No. 7 of 2006 concerning Real Estate Registration in the Emirate of Dubai.
              </p>
              <p>
                Freehold ownership provides registered, absolute ownership rights over both the unit and the underlying land parcel without any fixed lease expiration period. Buyers can freely occupy, lease, gift, mortgage, or sell the property.
              </p>
              <p>
                However, foreign ownership is designated to specific zones known as <strong>freehold areas</strong>. Non-UAE nationals cannot purchase in areas reserved exclusively for UAE/GCC citizens (such as Deira, Bur Dubai, or Jumeirah 1 residential parcels, unless classified as leasehold). Before booking a property, buyers should confirm whether the specific project and plot are registered with the Dubai Land Department as eligible for foreign ownership.
              </p>
              <p>
                The purchase process is governed by two complementary legal frameworks:
              </p>
              <UL
                items={[
                  "Dubai's property regulations: Governed by the Dubai Land Department (DLD) and Real Estate Regulatory Agency (RERA), dictating title registration, contracts, and developer escrow accounts.",
                  "Indian foreign exchange laws: For Indian residents transferring funds abroad, remittances are governed by the Reserve Bank of India (RBI) under the Foreign Exchange Management Act (FEMA) and the Liberalised Remittance Scheme (LRS).",
                ]}
              />

              <H2>Which Dubai Areas Can Indian Buyers Purchase Property In?</H2>
              <p>
                Dubai offers a rich selection of master communities where Indian buyers can acquire freehold homes. The ideal location depends on your budget, property type, lifestyle preferences, and whether your objective is capital appreciation or high rental yields.
              </p>
              <p>Here are the top freehold areas favoured by Indian buyers and investors:</p>

              <H3>1. Dubai Marina</H3>
              <p>
                Dubai Marina is a world-renowned waterfront district featuring residential skyscrapers, yachts, al fresco dining on the Marina Walk, and immediate beach access at JBR.
              </p>
              <UL
                items={[
                  "Luxury waterfront apartments with stunning skyline and marina views.",
                  "Exceptional short-term (holiday home) and long-term rental yields averaging 6.5% – 7.8%.",
                  "Direct connectivity via Dubai Metro, Dubai Tram, and Sheikh Zayed Road.",
                  "High liquidity with active secondary resale and tenant demand.",
                ]}
              />

              <H3>2. Downtown Dubai</H3>
              <p>
                Often described as the &quot;Centre of Now,&quot; Downtown Dubai is home to the iconic Burj Khalifa, The Dubai Mall, and Dubai Opera. It represents the pinnacle of prestigious urban living.
              </p>
              <UL
                items={[
                  "Prime central location with trophy residential addresses.",
                  "Luxury apartments with panoramic fountain and Burj Khalifa views.",
                  "Unrivalled shopping, dining, and global entertainment facilities.",
                  "Consistent capital preservation and sustained international demand.",
                ]}
              />

              <H3>3. Business Bay</H3>
              <p>
                Located directly adjacent to Downtown Dubai along the Dubai Canal, Business Bay is a dynamic mixed-use commercial and residential hub popular with working professionals and corporate executives.
              </p>
              <UL
                items={[
                  "Contemporary residential high-rises and serviced hotel apartments.",
                  "Lower entry price per square foot compared to Downtown Dubai.",
                  "Strong rental demand from corporate tenants and expats.",
                  "Rapid infrastructure growth along Marasi Bay and Dubai Canal promenade.",
                ]}
              />

              <H3>4. Dubai Hills Estate</H3>
              <p>
                Known as the &quot;Green Heart of Dubai,&quot; Dubai Hills Estate is a master-planned golf community developed by Emaar, offering luxury villas, townhouses, modern low-rise apartments, Dubai Hills Mall, and an 18-hole championship golf course.
              </p>
              <UL
                items={[
                  "Spacious landscaped parks, family-oriented amenities, and open green corridors.",
                  "Top international schools, King's College Hospital, and extensive retail options within the community.",
                  "High capital appreciation since launch and steady rental performance.",
                  "Ideal for Indian families planning relocation or premium buy-to-let investments.",
                ]}
              />

              <H3>5. Jumeirah Village Circle (JVC)</H3>
              <p>
                JVC is one of Dubai's most transacted residential communities, offering affordable apartments, townhouses, and villas with excellent community amenities.
              </p>
              <UL
                items={[
                  "Competitive entry prices starting from AED 500,000 for studios and AED 750,000 for 1-BHKs.",
                  "Among the highest net rental yields in Dubai (typically 7.5% – 9%).",
                  "Over 30 landscaped community parks, sports courts, and Circle Mall.",
                  "Direct road links to Al Khail Road (E44) and Sheikh Mohammed Bin Zayed Road (E311).",
                ]}
              />

              <H2>What Are the Rules for Indian Residents Buying Property in Dubai?</H2>
              <p>
                Indian residents (individuals living in India under FEMA definition) who plan to buy overseas real estate must strictly comply with the Reserve Bank of India's (RBI) regulations.
              </p>
              <p>
                Under the <strong>Liberalised Remittance Scheme (LRS)</strong>, resident individuals are permitted to remit up to <strong>USD 250,000</strong> (or its equivalent in AED or other foreign currency) per financial year (April 1 to March 31) for permissible capital account transactions, including the acquisition of immovable property outside India.
              </p>
              <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-5">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-amber-900 mb-1">Key LRS Guidelines for Indian Residents:</h4>
                    <UL
                      items={[
                        "Annual Remittance Cap: USD 250,000 per financial year per resident individual. Family members (including spouse, parents, and children) can combine their independent LRS quotas for a joint property purchase.",
                        "Authorised Dealer (AD) Bank: All payments must be routed through your designated bank branch via SWIFT wire transfer with Form A2.",
                        "Direct Remittance: Funds must be remitted directly to the registered developer's DLD-approved Escrow Account or the official DLD registration account—never through cash or unverified third-party intermediaries.",
                        "Tax Collected at Source (TCS): Remittances under LRS for overseas property purchases attract TCS under Section 206C(1G) of the Indian Income Tax Act (currently 20% on amounts exceeding INR 7 lakh per financial year), which can be adjusted against your annual income tax liability.",
                      ]}
                    />
                  </div>
                </div>
              </div>

              <H2>Can NRIs Buy Property in Dubai?</H2>
              <p>
                Yes. Non-Resident Indians (NRIs) can freely purchase property in Dubai. Since NRIs earn income abroad and maintain non-resident status under FEMA, their overseas transactions are not subject to the RBI's LRS annual cap when using foreign earnings.
              </p>
              <p>
                NRIs should evaluate the following points:
              </p>
              <UL
                items={[
                  "Source of Funds: NRIs can pay directly from their international bank accounts or from their Non-Resident External (NRE) accounts in India.",
                  "Income Tax Considerations: Rental income earned in Dubai is tax-free in the UAE. Under the India-UAE Double Taxation Avoidance Agreement (DTAA), understanding tax reporting in your country of tax residency is recommended.",
                  "Mortgage Eligibility: NRIs working in GCC countries, the UK, Europe, the US, or Singapore are widely eligible for non-resident property mortgages with UAE banks with down payments of 20% to 40%.",
                  "Power of Attorney (POA): If an NRI cannot travel to Dubai for transfer formalities, they can appoint an authorized representative via a DLD-compliant Power of Attorney.",
                ]}
              />

              <H2>What Documents Do Indians Need to Buy Property in Dubai?</H2>
              <p>
                One of the major advantages of buying real estate in Dubai is the straightforward, transparent paperwork. The required documents vary depending on whether you are buying an off-plan unit from a developer or a ready property on the secondary market.
              </p>

              <H3>Documents for Property Buyers</H3>
              <Table
                head={["Document", "Purpose & Details"]}
                rows={[
                  ["Valid Indian Passport", "Primary proof of identity, nationality, and legal signature."],
                  ["UAE Visa & Emirates ID (if applicable)", "Required for UAE residents; not mandatory for buyers living in India."],
                  ["Proof of Residential Address", "Utility bill, Aadhaar card, or bank statement (issued within last 3 months)."],
                  ["Bank Account Statements", "Past 3 to 6 months of bank statements confirming source of funds and remittance capability."],
                  ["Permanent Account Number (PAN) Card", "Required by your Indian bank for processing LRS Form A2 wire transfers."],
                  ["Sale and Purchase Agreement (SPA / Form F)", "Legally binding contract specifying unit details, payment schedule, and terms."],
                  ["Bank Remittance Receipts / Swift Copy", "Official bank confirmation of funds transferred to the developer's escrow account."],
                ]}
              />

              <H3>Documents for Property Registration at Dubai Land Department (DLD)</H3>
              <p>During final registration and title deed issuance, the following documents are finalized:</p>
              <UL
                items={[
                  "Developer No Objection Certificate (NOC): Required for secondary market transfers confirming zero outstanding service charges.",
                  "Oqood Certificate: Pre-title deed registration document issued for off-plan properties during the construction phase.",
                  "Title Deed (Mulkia): Official ownership certificate issued by the DLD once the unit is completed and handed over.",
                  "Mortgage Clearance / Bank Approval: Relevant bank documentation if the property is being mortgaged.",
                ]}
              />

              <H2>How Can Indians Buy Property in Dubai? Step-by-Step Process</H2>
              <p>
                The purchase journey in Dubai is structured, fast, and digitally integrated through the Dubai Land Department and Dubai REST platform:
              </p>

              <div className="space-y-4">
                <div className="rounded-lg border bg-white p-4">
                  <h4 className="font-bold text-sippy-charcoal flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-sippy-gold" /> Step 1: Establish Your Budget & Financial Plan
                  </h4>
                  <p className="mt-1 text-base text-gray-600">
                    Calculate your total investment outlay, including the purchase price plus approximately 7% to 8% in government registration fees, agency commissions, and administrative costs. For resident Indians, ensure remittance plans align with LRS limits.
                  </p>
                </div>

                <div className="rounded-lg border bg-white p-4">
                  <h4 className="font-bold text-sippy-charcoal flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-sippy-gold" /> Step 2: Select the Right Community & Property Type
                  </h4>
                  <p className="mt-1 text-base text-gray-600">
                    Compare key freehold locations (such as Dubai Marina, Downtown, Business Bay, Dubai Hills, or JVC) based on lifestyle needs, expected rental returns, and proximity to major business centres.
                  </p>
                </div>

                <div className="rounded-lg border bg-white p-4">
                  <h4 className="font-bold text-sippy-charcoal flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-sippy-gold" /> Step 3: Choose Between Ready vs Off-Plan Property
                  </h4>
                  <p className="mt-1 text-base text-gray-600">
                    Decide whether you want immediate rental income from a completed unit or prefer the flexible milestone payment plans (e.g., 60/40, 70/30, or post-handover) offered by off-plan developments.
                  </p>
                </div>

                <div className="rounded-lg border bg-white p-4">
                  <h4 className="font-bold text-sippy-charcoal flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-sippy-gold" /> Step 4: Verify the Developer, Escrow Account & DLD Project Status
                  </h4>
                  <p className="mt-1 text-base text-gray-600">
                    Verify the project's registration on the official DLD / RERA portal. Ensure that all buyer installments will be deposited into the project's officially sanctioned Escrow Account.
                  </p>
                </div>

                <div className="rounded-lg border bg-white p-4">
                  <h4 className="font-bold text-sippy-charcoal flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-sippy-gold" /> Step 5: Sign the Booking Form & Sale and Purchase Agreement (SPA)
                  </h4>
                  <p className="mt-1 text-base text-gray-600">
                    Pay the initial reservation deposit (typically 10% to 20%) and sign the contract (Unified Form F for secondary resale or developer SPA for off-plan).
                  </p>
                </div>

                <div className="rounded-lg border bg-white p-4">
                  <h4 className="font-bold text-sippy-charcoal flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-sippy-gold" /> Step 6: Arrange Bank Remittances (LRS / Direct SWIFT)
                  </h4>
                  <p className="mt-1 text-base text-gray-600">
                    Submit Form A2 and your SPA copy to your Authorised Dealer bank in India (for residents) or initiate an international wire transfer from your overseas account (for NRIs).
                  </p>
                </div>

                <div className="rounded-lg border bg-white p-4">
                  <h4 className="font-bold text-sippy-charcoal flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-sippy-gold" /> Step 7: Complete DLD Registration & Obtain Title Deed
                  </h4>
                  <p className="mt-1 text-base text-gray-600">
                    The transaction is registered with the Dubai Land Department (either digitally or at a DLD Registration Trustee office). You receive your official Title Deed (for ready units) or Oqood Certificate (for off-plan).
                  </p>
                </div>
              </div>

              <H2>What Is the Difference Between Buying Ready and Off-Plan Property in Dubai?</H2>
              <p>
                Indian buyers can explore both ready properties on the secondary market and off-plan properties directly from master developers like Emaar, Damac, Sobha, and Nakheel.
              </p>
              <Table
                head={["Feature / Factor", "Ready Property", "Off-Plan Property"]}
                rows={[
                  ["Property Condition", "Fully constructed and ready to inspect.", "Under planning or active construction."],
                  ["Possession Timeline", "Immediate upon DLD transfer.", "On project completion (typically 2 to 4 years)."],
                  ["Payment Structure", "100% upfront (or 20–40% down payment with bank mortgage).", "Staged installment plans linked to construction milestones."],
                  ["Capital Growth", "Reflects market appreciation of established area.", "Opportunity for substantial capital gain before handover."],
                  ["Rental Generation", "Immediate rental income from day one.", "Rental income begins only after handover."],
                  ["Physical Inspection", "Walkthrough of actual unit, views, and finishes.", "Based on show homes, floor plans, and 3D mockups."],
                ]}
              />
              <p>
                For an in-depth analysis of which option suits your timeline and financial profile, read our complete guide:{" "}
                <Link to="/blog/off-plan-vs-ready-property-in-dubai-which-is-better-for-you" className={linkClass}>
                  Off-Plan vs Ready Property in Dubai: Which Is Better for You?
                </Link>
              </p>

              <H2>What Additional Costs Should Indian Buyers Consider?</H2>
              <p>
                When budgeting for a property purchase in Dubai, ensure you account for mandatory transaction charges and ongoing ownership expenses:
              </p>
              <UL
                items={[
                  "Dubai Land Department (DLD) Transfer Fee: 4% of the total purchase price + administrative fees (AED 580 for off-plan or AED 4,300 for ready property at Trustee offices).",
                  "Real Estate Agency Brokerage: Standard 2% of the purchase value (+ 5% UAE VAT).",
                  "Oqood Registration Fee: AED 3,000 to AED 5,000 for off-plan property registration with DLD.",
                  "Property Valuation Fee: AED 2,500 to AED 3,500 (+ VAT) if obtaining a bank mortgage.",
                  "Annual Service Charges: Recurring maintenance fees paid per square foot (typically AED 12 to AED 30/sq.ft. depending on the building's amenities and community).",
                  "Indian TCS & Forex Conversion: Resident Indians must account for bank conversion spreads and applicable TCS (20% above INR 7 Lakhs, adjustable in tax returns).",
                ]}
              />

              <H2>Can Indians Get a Dubai Golden Visa Through Property Investment?</H2>
              <p>
                Yes. Indian investors can qualify for the prestigious <strong>10-Year Renewable UAE Golden Visa</strong> through real estate investment.
              </p>
              <p>
                To qualify under the Dubai Land Department&apos;s real estate investor route, the applicant must satisfy the following criteria:
              </p>
              <UL
                items={[
                  "Minimum Property Value: AED 2,000,000 (approx. USD 545,000 or INR 4.5+ Crore) total purchase value. This can be met with a single property or cumulative investment across multiple properties.",
                  "Eligible Property Types: Freehold residential or commercial properties (ready units or qualifying off-plan units with approved developers).",
                  "Mortgaged Properties Allowed: Buyers can obtain a mortgage from a UAE bank, provided the bank issues a No Objection Letter to the DLD.",
                  "Family Sponsorship: Golden Visa holders can sponsor their spouse, children (any age), and domestic staff.",
                  "No Extended Absence Restriction: Unlike standard residency visas, Golden Visa holders can stay outside the UAE for more than 6 consecutive months without invalidating their residency.",
                ]}
              />
              <p>
                For complete step-by-step documentation, medical fitness tests, and application fees, explore our detailed guide:{" "}
                <Link
                  to="/blog/can-you-get-a-dubai-golden-visa-through-property-investment-what-are-the-eligibility-rules-and-application-steps"
                  className={linkClass}
                >
                  Can You Get a Dubai Golden Visa Through Property Investment? Eligibility and Application Steps
                </Link>
                .
              </p>

              <H2>What Should Indian Buyers Check Before Finalising a Property Purchase?</H2>
              <p>
                Before remitting funds or signing binding agreements, verify this essential checklist:
              </p>
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-6 w-6 text-sippy-gold shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sippy-charcoal">1. Verify Freehold Designation</p>
                    <p className="text-sm text-gray-600">Ensure the property is legally located within a designated freehold zone that permits non-UAE citizen ownership.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-6 w-6 text-sippy-gold shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sippy-charcoal">2. RERA Developer & Escrow Account Check</p>
                    <p className="text-sm text-gray-600">Verify the project&apos;s construction completion percentage on the Dubai REST app and confirm the developer&apos;s active escrow account number.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-6 w-6 text-sippy-gold shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sippy-charcoal">3. Review Indian Remittance (LRS/FEMA) Feasibility</p>
                    <p className="text-sm text-gray-600">Confirm with your Indian bank branch that your remittance documents (Form A2, PAN, bank statements) align with LRS guidelines.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-6 w-6 text-sippy-gold shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sippy-charcoal">4. Check Building Service Charges (Mollak Portal)</p>
                    <p className="text-sm text-gray-600">Review historical annual service charges on DLD&apos;s Mollak system to ensure recurring maintenance costs match your net rental yield expectations.</p>
                  </div>
                </div>
              </div>

              <H2>Frequently Asked Questions</H2>
              <div className="space-y-3">
                {FAQS.map((item, idx) => (
                  <details key={idx} className="group rounded-lg border bg-white p-4 transition-all">
                    <summary className="cursor-pointer font-semibold text-sippy-charcoal flex justify-between items-center">
                      <span>{idx + 1}. {item.q}</span>
                      <span className="text-sippy-gold transition-transform group-open:rotate-180">▼</span>
                    </summary>
                    <p className="mt-3 text-base text-gray-600 leading-relaxed border-t pt-3">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>

              <H2>Explore Dubai Property Opportunities with Sippy Housing</H2>
              <p>
                Buying property in Dubai can be a transformative financial decision for Indian residents and NRIs alike. Understanding foreign ownership rules, LRS remittance pathways, documentation, and total transaction fees empowers you to invest with confidence.
              </p>
              <p>
                <Link to="/" className={linkClass}>Sippy Housing</Link> helps Indian buyers explore prime residential homes, luxury waterfront apartments, family villas, and high-yield off-plan developments across Dubai. Whether you are looking for personal use, steady rental cash flows, or UAE Golden Visa eligibility, our team provides transparent guidance through every step of the process.
              </p>
              <p>
                Explore verified <Link to="/#invest-dubai" className={linkClass}>Dubai property opportunities</Link> today or get in touch with our team for personalized advisory.
              </p>

              {/* Related Reading Links */}
              <div className="mt-6 space-y-2 rounded-lg bg-gray-100 p-4 text-sm text-gray-700">
                <strong>Related Reading:</strong>
                <div>
                  <Link
                    to="/blog/which-freehold-areas-in-dubai-can-foreigners-buy-property-in"
                    className={linkClass}
                  >
                    Which Freehold Areas in Dubai Can Foreigners Buy Property In?
                  </Link>
                </div>
                <div>
                  <Link
                    to="/blog/can-you-get-a-dubai-golden-visa-through-property-investment-what-are-the-eligibility-rules-and-application-steps"
                    className={linkClass}
                  >
                    Can You Get a Dubai Golden Visa Through Property Investment? Eligibility and Application Steps
                  </Link>
                </div>
                <div>
                  <Link
                    to="/blog/off-plan-vs-ready-property-in-dubai-which-is-better-for-you"
                    className={linkClass}
                  >
                    Off-Plan vs Ready Property in Dubai: Which Is Better for You?
                  </Link>
                </div>
                <div>
                  <Link
                    to="/blog/why-are-indian-investors-choosing-dubai-for-property-investment"
                    className={linkClass}
                  >
                    Why Are Indian Investors Choosing Dubai for Property Investment?
                  </Link>
                </div>
              </div>
            </div>

            {/* Clickable Tags */}
            <div className="mt-8 flex flex-wrap items-center gap-2">
              {POST.tags.map((t) => (
                <Link
                  key={t}
                  to={`/blog?tag=${encodeURIComponent(t)}`}
                  className="inline-block rounded-full border border-gray-200 bg-white px-3.5 py-1 text-sm font-medium text-gray-600 transition-all duration-200 hover:border-sippy-gold hover:bg-sippy-gold hover:text-white hover:shadow-sm"
                >
                  {t}
                </Link>
              ))}
            </div>

            {/* CTA Card pointing to #invest-dubai */}
            <div className="mt-10 rounded-xl bg-white p-6 text-center shadow">
              <p className="mb-3 font-semibold text-sippy-charcoal">
                Ready to explore verified property opportunities in Dubai?
              </p>
              <Link
                to="/#invest-dubai"
                className="inline-block rounded-lg bg-sippy-gold px-6 py-2.5 font-semibold text-white hover:bg-sippy-gold/90 transition-colors"
              >
                Explore Dubai Properties
              </Link>
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
