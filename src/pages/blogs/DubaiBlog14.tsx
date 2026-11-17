import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, User, ShieldCheck, MapPin } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

/* ------------------------------------------------------------------ */
/*  STATIC BLOG DATA - BLOG 14 (Freehold Areas in Dubai for Foreigners)*/
/*  Put the image at: public/blogimg14.jpeg (or change path below)    */
/* ------------------------------------------------------------------ */
const POST = {
  slug: "which-freehold-areas-in-dubai-can-foreigners-buy-property-in",
  title: "Which Freehold Areas in Dubai Can Foreigners Buy Property In?",
  category: "Buyer & Legal Guide",
  author: "Sippy Housing",
  published_at: "2026-11-17",
  read_time: 8,
  image: "/blogimg14.jpeg",
  tags: [
    "Freehold Areas Dubai",
    "Dubai Real Estate",
    "Foreign Buyers",
    "Dubai Marina",
    "Downtown Dubai",
    "Palm Jumeirah",
    "Business Bay",
    "2026",
  ],
  excerpt:
    "Explore the designated freehold areas in Dubai where foreigners can purchase property, understand the difference between freehold, leasehold, and usufruct, and review the essential buyer checklist.",
};

// ---------- small reusable pieces ----------
const slugify = (t) =>
  t.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const H2 = ({ children }) => (
  <h2 id={slugify(children)} className="scroll-mt-28 pt-6 text-2xl font-bold text-sippy-charcoal">
    {children}
  </h2>
);

const H3 = ({ children }) => (
  <h3 id={slugify(children)} className="scroll-mt-28 pt-2 text-xl font-bold text-sippy-charcoal">
    {children}
  </h3>
);

const UL = ({ items }) => (
  <ul className="list-disc space-y-1 pl-6">
    {items.map((t, i) => (
      <li key={i}>{t}</li>
    ))}
  </ul>
);

const Table = ({ head, rows }) => (
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

const linkClass = "text-sippy-gold underline hover:text-sippy-charcoal";

// Table of contents (labels match <H2> / <H3> text exactly)
const TOC = [
  { label: "Introduction" },
  { label: "What Does Freehold Property Ownership Mean in Dubai?" },
  { label: "Can Foreigners Buy Property Anywhere in Dubai?", sub: true },
  { label: "Which Are the Popular Freehold Areas in Dubai?" },
  { label: "1. Dubai Marina", sub: true },
  { label: "2. Downtown Dubai", sub: true },
  { label: "3. Palm Jumeirah", sub: true },
  { label: "4. Business Bay", sub: true },
  { label: "5. Jumeirah Lake Towers (JLT)", sub: true },
  { label: "6. Dubai Hills Estate", sub: true },
  { label: "7. Jumeirah Village Circle (JVC)", sub: true },
  { label: "What Is the Difference Between Freehold, Leasehold and Usufruct?" },
  { label: "How Can Foreigners Verify Whether a Property Is Freehold?" },
  { label: "What Should You Consider Before Buying Freehold Property in Dubai?" },
  { label: "Can Freehold Property Ownership Help You Qualify for a Dubai Golden Visa?" },
  { label: "What Documents Should You Check Before Purchasing?" },
  { label: "Frequently Asked Questions About Freehold Property in Dubai" },
  { label: "Final Thoughts: How Can You Choose the Right Freehold Property?" },
];

const TableOfContents = () => {
  const [active, setActive] = useState(slugify(TOC[0].label));
  const holderRef = useRef(null);
  const navRef = useRef(null);

  useEffect(() => {
    const TOP = 112;
    const update = () => {
      const holder = holderRef.current,
        nav = navRef.current;
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
    const els = TOC.map((t) => document.getElementById(slugify(t.label))).filter(Boolean);
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-100px 0px -65% 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const go = (id) => (e) => {
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
                  className={`block py-1.5 pr-1 text-sm leading-snug transition-colors ${
                    t.sub ? "pl-8" : "pl-4"
                  } ${
                    on
                      ? "-ml-px border-l-2 border-sippy-gold font-semibold text-sippy-charcoal"
                      : "text-gray-500 hover:text-sippy-charcoal"
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
    <summary className="cursor-pointer text-sm font-semibold uppercase tracking-widest text-gray-600">
      Table of Contents
    </summary>
    <ul className="mt-3 space-y-1 border-l border-gray-200">
      {TOC.map((t) => {
        const id = slugify(t.label);
        return (
          <li key={id}>
            <a
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault();
                e.currentTarget.closest("details")?.removeAttribute("open");
                document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`block py-1.5 pr-1 text-sm text-gray-600 hover:text-sippy-charcoal ${
                t.sub ? "pl-8" : "pl-4"
              }`}
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
  [
    "Can foreigners own freehold property in Dubai?",
    "Yes. Foreign nationals can acquire freehold ownership rights in designated areas of Dubai, subject to the applicable ownership and registration rules.",
  ],
  [
    "Which Dubai areas are popular among foreign property buyers?",
    "Dubai Marina, Downtown Dubai, Palm Jumeirah, Business Bay, Jumeirah Lake Towers, Dubai Hills Estate, and Jumeirah Village Circle are popular communities to explore. Buyers should verify the eligibility of the specific property before purchasing.",
  ],
  [
    "Is freehold ownership permanent in Dubai?",
    "Freehold ownership is not limited to a fixed lease period. It provides ownership rights without a time restriction, subject to applicable laws and registration requirements.",
  ],
  [
    "Can non-residents buy freehold property in Dubai?",
    "Yes. Foreign nationals do not necessarily need to be UAE residents to purchase eligible freehold property in designated areas. They must complete the required transaction and registration procedures.",
  ],
  [
    "Does freehold ownership automatically provide UAE residency?",
    "No. Property ownership and residency are separate matters. Eligible property investors may apply for relevant residency options (like the 10-year Golden Visa) if they meet the applicable investment and legal requirements.",
  ],
];

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

export default function DubaiBlog14() {
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
    return () => {
      document.title = oldTitle;
    };
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
              <span className="inline-flex items-center gap-1">
                <User className="h-4 w-4" />
                {POST.author}
              </span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(POST.published_at)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {POST.read_time} min read
              </span>
            </div>

            <img
              src={POST.image}
              alt="Which Freehold Areas in Dubai Can Foreigners Buy Property In?"
              className="mb-8 w-full rounded-xl object-cover shadow"
            />

            <MobileTableOfContents />

            <div className="space-y-5 text-lg leading-relaxed text-gray-700">
              <H2>Introduction</H2>
              <p>
                Dubai has become a popular destination for international property buyers looking for residential homes and long-term real estate investment opportunities. One of the biggest reasons is the opportunity for foreign nationals to own property in designated freehold locations across the city.
              </p>
              <p>
                However, not every area in Dubai offers the same ownership rights. Before purchasing an apartment, villa, or townhouse, buyers should understand the difference between freehold, leasehold, and usufruct ownership.
              </p>
              <p>
                Knowing the <Link to="/#invest-dubai" className={linkClass}>freehold areas in dubai</Link> can help international buyers shortlist suitable communities, understand their property rights, and make more informed investment decisions.
              </p>
              <p>
                Whether you are planning to purchase a home for personal use or invest in the Dubai real estate market, this guide explains the main locations, ownership rules, and important checks to consider. If you are exploring residential and investment opportunities, visit <Link to="/" className={linkClass}>Sippy Housing</Link> to discover Dubai properties and learn more about the local market.
              </p>

              {/* SECTION: Definition */}
              <H2>What Does Freehold Property Ownership Mean in Dubai?</H2>
              <p>
                Freehold ownership gives a buyer ownership rights over a property without a fixed time limit, subject to the applicable laws and registration requirements.
              </p>
              <p>
                In Dubai, foreign nationals can acquire freehold ownership in areas specifically designated for non-UAE nationals. Once the purchase is completed and registered, the buyer's ownership is recorded with the Dubai Land Department (DLD).
              </p>
              <p>
                This is different from leasehold ownership, where the buyer receives rights to use a property for a specified period under the relevant agreement.
              </p>
              <p>
                For international buyers, understanding <Link to="/#invest-dubai" className={linkClass}>freehold property dubai</Link> regulations is important because the ownership structure can influence how a property is used, transferred, sold, or inherited.
              </p>

              <H3>Can Foreigners Buy Property Anywhere in Dubai?</H3>
              <p>
                <strong>No.</strong> Foreign nationals can purchase freehold property only in designated ownership areas.
              </p>
              <p>
                According to the Dubai Land Department and the UAE Government's official guidance, foreign buyers can acquire freehold ownership rights in approved areas. They may also acquire certain usufruct or long-term lease rights, depending on the property and applicable regulations.
              </p>
              <div className="rounded-xl border border-sippy-gold/30 bg-amber-50/50 p-4 text-base">
                <span className="font-semibold text-sippy-charcoal">💡 Important Check:</span> Before making a purchase, buyers should confirm that the specific property or plot is eligible for foreign ownership rather than relying only on the community name.
              </div>

              {/* SECTION: Popular Freehold Areas */}
              <H2>Which Are the Popular Freehold Areas in Dubai?</H2>
              <p>
                Dubai offers a wide range of residential communities for international buyers. Some locations are known for waterfront living, while others attract buyers looking for family-friendly neighbourhoods, modern apartments, or investment opportunities.
              </p>

              <H3>1. Dubai Marina</H3>
              <p>
                Dubai Marina is a well-known waterfront community featuring residential towers, restaurants, retail outlets, and leisure facilities.
              </p>
              <p><strong>Why consider Dubai Marina?</strong></p>
              <UL
                items={[
                  "Waterfront apartments and panoramic marina views.",
                  "Direct access to restaurants, shopping, and entertainment.",
                  "Metro and tram connectivity across the wider district.",
                  "Strong tenant demand for both short-term and long-term rental investment.",
                ]}
              />

              <H3>2. Downtown Dubai</H3>
              <p>
                Downtown Dubai is one of the city's prominent residential and commercial destinations. It is home to Burj Khalifa, Dubai Mall, and an array of luxury residential developments.
              </p>
              <p><strong>Why consider Downtown Dubai?</strong></p>
              <UL
                items={[
                  "Central prime location with prestigious urban surroundings.",
                  "High-rise apartments with city and landmark views.",
                  "Direct access to global shopping, dining, and cultural attractions.",
                  "Established residential infrastructure with strong international appeal.",
                ]}
              />

              <H3>3. Palm Jumeirah</H3>
              <p>
                Palm Jumeirah is a landmark waterfront destination known for luxury apartments, villas, hotels, and private beach access in selected developments.
              </p>
              <p><strong>Why consider Palm Jumeirah?</strong></p>
              <UL
                items={[
                  "Iconic beachfront and waterfront residential options.",
                  "Exclusive luxury apartments and signature independent villas.",
                  "Private beach clubs, resorts, and world-class leisure facilities.",
                  "A premier luxury lifestyle environment for high-net-worth buyers.",
                ]}
              />

              <H3>4. Business Bay</H3>
              <p>
                Business Bay is a vibrant mixed-use district with residential towers, offices, hotels, and retail spaces, located adjacent to Downtown Dubai and the Dubai Canal.
              </p>
              <p><strong>Why consider Business Bay?</strong></p>
              <UL
                items={[
                  "Apartments in modern high-rise residential towers.",
                  "Immediate proximity to Downtown Dubai and DIFC financial hub.",
                  "Commercial surroundings popular with young corporate professionals.",
                  "Versatile property layouts ranging from compact studios to spacious penthouses.",
                ]}
              />

              <H3>5. Jumeirah Lake Towers (JLT)</H3>
              <p>
                Jumeirah Lake Towers is an established residential and commercial community with apartment buildings arranged around landscaped parks and artificial lakes.
              </p>
              <p><strong>Why consider JLT?</strong></p>
              <UL
                items={[
                  "Competitive apartment prices across diverse budget segments.",
                  "Direct connectivity to two Dedicated Red Line Metro stations.",
                  "Community parks, outdoor running tracks, cafes, and everyday conveniences.",
                  "High rental demand due to accessibility and commercial offices in the cluster.",
                ]}
              />

              <H3>6. Dubai Hills Estate</H3>
              <p>
                Dubai Hills Estate is a master-planned community featuring golf courses, apartments, villas, townhouses, parks, and Dubai Hills Mall.
              </p>
              <p><strong>Why consider Dubai Hills Estate?</strong></p>
              <UL
                items={[
                  "A planned, family-oriented residential environment with expansive green spaces.",
                  "Championship 18-hole golf course and sports facilities.",
                  "Proximity to top-rated international schools and King's College Hospital.",
                  "Balanced mix of modern mid-rise apartments and luxury villas.",
                ]}
              />

              <H3>7. Jumeirah Village Circle (JVC)</H3>
              <p>
                Jumeirah Village Circle is a popular residential community offering apartments, townhouses, and villas with convenient road access to major highways.
              </p>
              <p><strong>Why consider JVC?</strong></p>
              <UL
                items={[
                  "Attractive entry prices and consistently high rental yields.",
                  "Over 30 community parks, Circle Mall, and local neighborhood retail.",
                  "Extensive choice between completed resale units and off-plan projects.",
                  "Strong appeal for tenants seeking budget-friendly, spacious homes.",
                ]}
              />
              <p className="text-sm text-gray-500">
                These communities are commonly associated with foreign-buyer property opportunities. However, the exact freehold eligibility must always be checked against the property's registered plot and official records.
              </p>

              {/* SECTION: Ownership Types Comparison */}
              <H2>What Is the Difference Between Freehold, Leasehold and Usufruct?</H2>
              <p>
                Before purchasing a property, it is useful to understand the ownership structures available in Dubai:
              </p>
              <Table
                head={["Ownership Type", "Meaning", "Duration"]}
                rows={[
                  ["Freehold", "Ownership rights over the property and applicable land interest", "Without a fixed time limit (perpetual)"],
                  ["Leasehold", "Right to use a property under a long-term lease agreement", "Depends on the agreement (commonly up to 99 years)"],
                  ["Usufruct", "Right to use and benefit from a property without owning it outright", "Can extend up to 99 years under applicable rules"],
                ]}
              />
              <p className="text-sm text-gray-500">
                The exact rights and responsibilities depend on the registered agreement and applicable regulations. For foreign buyers, understanding these differences helps avoid confusion when comparing properties across different communities.
              </p>

              {/* SECTION: Verification */}
              <H2>How Can Foreigners Verify Whether a Property Is Freehold?</H2>
              <p>
                Checking ownership eligibility is one of the most critical steps before purchasing property in Dubai. A community may contain different plots or developments, and buyers should not assume that every unit has identical ownership rights.
              </p>
              <p>Follow these steps before making a decision:</p>
              <div className="rounded-xl border bg-white p-5 shadow-sm">
                <ul className="space-y-3">
                  {[
                    <><strong>Confirm the Property Details:</strong> Obtain the exact property name, unit number, building name, and municipality plot number.</>,
                    <><strong>Check Ownership Eligibility:</strong> Verify whether the property is registered within an approved foreign-ownership area.</>,
                    <><strong>Review the Title Deed:</strong> Inspect the registered ownership details, ownership type, and property specifications.</>,
                    <><strong>Verify Through Dubai Land Department:</strong> Use the official DLD Dubai REST application or consult an authorised real estate registration trustee.</>,
                    <><strong>Review the Sale Agreement:</strong> Understand the ownership terms, payment milestones, and transfer conditions before signing.</>,
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-bold text-sippy-gold">✔</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p>
                You can refer to the{" "}
                <a href="https://dubailand.gov.ae/" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  Dubai Land Department
                </a>{" "}
                official portal for updated information on foreign ownership rules and approved zones.
              </p>

              {/* SECTION: Considerations */}
              <H2>What Should You Consider Before Buying Freehold Property in Dubai?</H2>
              <p>
                Selecting a location is only one part of the buying process. Buyers should also evaluate the property's physical condition, financial requirements, community facilities, and long-term suitability.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border bg-white p-4">
                  <h4 className="font-bold text-sippy-charcoal">1. Location and Connectivity</h4>
                  <p className="mt-1 text-sm text-gray-600">Check direct access to major highways (E11, E44, E311), metro stations, schools, and business districts.</p>
                </div>
                <div className="rounded-xl border bg-white p-4">
                  <h4 className="font-bold text-sippy-charcoal">2. Property Type</h4>
                  <p className="mt-1 text-sm text-gray-600">Determine whether an apartment, townhouse, or independent villa best matches your family or portfolio goals.</p>
                </div>
                <div className="rounded-xl border bg-white p-4">
                  <h4 className="font-bold text-sippy-charcoal">3. Total Purchase Cost</h4>
                  <p className="mt-1 text-sm text-gray-600">Include the 4% DLD fee, agency commissions, trustee fees, and annual maintenance/service charges.</p>
                </div>
                <div className="rounded-xl border bg-white p-4">
                  <h4 className="font-bold text-sippy-charcoal">4. Rental Demand</h4>
                  <p className="mt-1 text-sm text-gray-600">Research historical occupancy rates, rental yields, and tenant demographic trends in the community.</p>
                </div>
                <div className="rounded-xl border bg-white p-4">
                  <h4 className="font-bold text-sippy-charcoal">5. Developer Reputation</h4>
                  <p className="mt-1 text-sm text-gray-600">Review completed projects, delivery timeliness, and escrow compliance for off-plan properties.</p>
                </div>
                <div className="rounded-xl border bg-white p-4">
                  <h4 className="font-bold text-sippy-charcoal">6. Ownership Documentation</h4>
                  <p className="mt-1 text-sm text-gray-600">Verify title deeds, seller identities, and ensure no outstanding developer or service charges exist.</p>
                </div>
              </div>

              {/* SECTION: Golden Visa Link */}
              <H2>Can Freehold Property Ownership Help You Qualify for a Dubai Golden Visa?</H2>
              <p>
                Property ownership can also open doors to long-term UAE residency. Eligible real estate investors who purchase qualifying freehold property can apply for a 10-year renewable UAE Golden Visa.
              </p>
              <p>
                The Dubai Land Department's real estate investor service specifies a minimum property purchase value of at least <strong>AED 2 million</strong> for this category, subject to ownership, documentation, and mortgage conditions.
              </p>
              <p>
                However, owning a freehold property does not automatically grant residency; applicants must satisfy all official requirements and complete the application process.
              </p>
              <p>
                For complete eligibility details, read our dedicated guide:{" "}
                <Link
                  to="/blog/can-you-get-a-dubai-golden-visa-through-property-investment-what-are-the-eligibility-rules-and-application-steps"
                  className={linkClass}
                >
                  Can You Get a Dubai Golden Visa Through Property Investment? Eligibility and Application Steps
                </Link>
                .
              </p>

              {/* SECTION: Documents to Check */}
              <H2>What Documents Should You Check Before Purchasing?</H2>
              <p>Documentation plays an important role in a property transaction. Buyers should review the following information before completing a purchase:</p>
              <div className="rounded-xl border bg-white p-5 shadow-sm">
                <ul className="space-y-2">
                  {[
                    "Seller's passport, Emirates ID, and registered ownership details.",
                    "Official Title Deed or e-Certificate of Title from the Dubai Land Department.",
                    "Property details and registered municipality plot information.",
                    "Unified Form F (MOU) or developer Sale and Purchase Agreement (SPA).",
                    "NOC (No Objection Certificate) from the developer confirming zero outstanding dues.",
                    "Mortgage liability or clearance letter, where applicable.",
                    "Current service charge statements and maintenance receipts.",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-bold text-sippy-gold">✔</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p>
                For off-plan purchases, buyers must also review the developer's RERA project registration, completion status, and approved escrow account details.
              </p>

              {/* SECTION: FAQs */}
              <H2>Frequently Asked Questions About Freehold Property in Dubai</H2>
              <div className="space-y-3">
                {FAQS.map(([q, a], i) => (
                  <details key={q} className="group rounded-lg border bg-white p-4">
                    <summary className="cursor-pointer font-semibold text-sippy-charcoal">
                      {i + 1}. {q}
                    </summary>
                    <p className="mt-2 text-base text-gray-600">{a}</p>
                  </details>
                ))}
              </div>

              {/* SECTION: Final Thoughts */}
              <H2>Final Thoughts: How Can You Choose the Right Freehold Property?</H2>
              <p>
                Understanding ownership rules is an important first step when purchasing real estate in Dubai. By comparing communities, verifying property eligibility, and reviewing all relevant documents, foreign buyers can make informed and confident investment decisions.
              </p>
              <p>
                <Link to="/" className={linkClass}>Sippy Housing</Link> helps buyers explore residential properties and investment opportunities across Dubai. Whether you are looking for a modern apartment, a family villa, or a high-yield rental investment, reviewing location and ownership details ensures a smooth property journey.
              </p>
              <p>
                Explore <Link to="/#invest-dubai" className={linkClass}>Dubai freehold properties</Link> today to discover verified homes and investment opportunities.
              </p>

              <div className="mt-6 space-y-2 rounded-lg bg-gray-100 p-4 text-sm text-gray-700">
                <strong>Related Reading:</strong>
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
                    to="/blog/how-do-dubai-off-plan-payment-plans-work-a-complete-guide-to-60-40-80-20-and-post-handover-options"
                    className={linkClass}
                  >
                    How Do Dubai Off-Plan Payment Plans Work? A Complete Guide to 60/40, 80/20 and Post-Handover Options
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
              </div>
            </div>

            {/* Clickable Tags */}
            <div className="mt-8 flex flex-wrap items-center gap-2">
              {/* <span className="mr-1 text-sm font-semibold text-gray-500">Tags:</span> */}
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
              <p className="mb-3 font-semibold text-sippy-charcoal">Looking for verified freehold properties in Dubai?</p>
              <Link
                to="/#invest-dubai"
                className="inline-block rounded-lg bg-sippy-gold px-6 py-2 font-semibold text-white hover:bg-sippy-gold/90 transition-colors"
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