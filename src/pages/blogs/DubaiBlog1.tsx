// src/pages/blogs/DubaiBlog.tsx
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const POST = {
  slug: "what-should-you-know-before-buying-property-in-dubai",
  title: "What Should You Know Before Buying Property in Dubai? Complete Guide for Buyers & Investors (2026)",
  category: "Dubai Real Estate",
  author: "Sippy Housing",
  published_at: "2026-11-02",
  read_time: 9,
  image: "/dubai-property-guide.png",
  tags: ["Dubai Property", "Property Investment", "Off-Plan", "Buyer Guide", "2026"],
  excerpt:
    "Dubai has become a popular destination for international property buyers and real estate investors. Its modern infrastructure, business opportunities, premium residential communities, and international connectivity attract people looking to purchase homes or explore investment opportunities.",
};

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
const Table = ({ head, rows }: { head: string[]; rows: string[][] }) => (
  <div className="overflow-x-auto rounded-lg border bg-white">
    <table className="w-full text-left text-base">
      <thead className="bg-sippy-charcoal text-white">
        <tr>{head.map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className="border-t">
            {r.map((c, j) => (
              <td key={j} className={`px-4 py-3 align-top ${j === 0 ? "font-semibold text-sippy-charcoal" : ""}`}>{c}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const TOC: { label: string; sub?: boolean }[] = [
  { label: "Introduction" },
  { label: "Key Factors to Understand About Dubai's Real Estate Market" },
  { label: "1. Why Is Dubai a Popular Destination for Property Buyers?" },
  { label: "2. Different Types of Properties Available in Dubai" },
  { label: "3. Popular Locations to Explore in Dubai" },
  { label: "4. Off-Plan vs Ready Properties: Which Option Is Better?" },
  { label: "5. Additional Costs Involved in Buying Property" },
  { label: "6. Legal Requirements for International Property Buyers" },
  { label: "7. Important Factors to Evaluate Before Investing" },
  { label: "8. Steps to Follow Before Purchasing a Property" },
  { label: "Buyer's Checklist", sub: true },
  { label: "9. Exploring Real Estate Opportunities with Sippy Housing" },
  { label: "Methodology and Limitations" },
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
  ["Can Foreigners Buy Property in Dubai?", "Yes. Foreign nationals can purchase freehold properties in designated areas of Dubai, subject to applicable ownership regulations."],
  ["Which Property Type Is Suitable for First-Time Buyers?", "Apartments may be a suitable starting point for many first-time buyers because they are available in different sizes and configurations. The right choice depends on budget and personal requirements."],
  ["Is Buying an Off-Plan Property a Good Option?", "Off-plan properties may offer different payment arrangements and access to new developments. However, buyers should carefully check the developer, project registration, construction progress, and delivery conditions."],
  ["What Additional Expenses Should Buyers Consider?", "Additional expenses may include registration fees, agency commission, mortgage charges, service charges, maintenance, insurance, and other transaction-related costs."],
  ["Can International Investors Rent Out Their Dubai Properties?", "Yes. Owners can generally rent out eligible properties, subject to applicable regulations, registration requirements, and community rules."],
  ["What Should Buyers Check Before Investing in Dubai?", "Buyers should evaluate the location, property price, rental demand, developer reputation, documentation, service charges, and future development plans."],
  ["How Can Buyers Choose Between Different Dubai Locations?", "Compare neighbourhoods based on your budget, daily travel requirements, nearby facilities, preferred lifestyle, and intended property use."],
];

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

export default function DubaiBlog() {
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
              alt="Property in Dubai: Complete Guide for Buyers & Investors (2026)"
              className="mb-8 w-full rounded-xl object-cover shadow"
            />

            <MobileTableOfContents />

            <div className="space-y-5 text-lg leading-relaxed text-gray-700">
              <H2>Introduction</H2>
              <p>
                <Link to="/#properties" className="text-sippy-gold underline hover:text-sippy-charcoal">Dubai</Link> has become a popular destination for international property buyers and real estate investors. Its modern infrastructure, business opportunities, premium residential communities, and international connectivity attract people looking to purchase homes or explore investment opportunities.
              </p>
              <p>However, buying real estate in another country requires proper research and financial planning. Buyers need to understand ownership regulations, property types, payment plans, additional costs, rental demand, and legal requirements before making a decision.</p>
              <p>
                This <Link to="/#international" className="text-sippy-gold underline hover:text-sippy-charcoal">Dubai property</Link> guide explains the important factors to consider when exploring the <Link to="/#properties" className="text-sippy-gold underline hover:text-sippy-charcoal">Dubai real estate</Link> market in 2026.
              </p>

              <H2>Key Factors to Understand About Dubai's Real Estate Market</H2>
              <p>Before exploring individual properties, buyers should understand the factors that influence the real estate market. Some important considerations include:</p>
              <UL items={[
                "International buyers can explore different residential and commercial property options.",
                "Apartments, villas, townhouses, and commercial spaces offer different ownership opportunities.",
                "Off-plan developments may provide payment structures that differ from completed properties.",
                "Location, infrastructure, and rental demand influence property investment decisions.",
                "Legal verification and additional ownership costs are important parts of the buying process.",
              ]} />
              <div className="rounded-lg border-l-4 border-sippy-gold bg-white p-4 shadow-sm">
                <p><strong className="text-sippy-charcoal">Quick Insight:</strong> A property investment should not be based only on attractive photographs or promotional offers.</p>
              </div>

              <H2>1. Why Is Dubai a Popular Destination for Property Buyers?</H2>
              <p>Dubai offers several features that attract residential buyers and international investors.</p>
              <H3>Growing Business Environment</H3>
              <p>Dubai is an established centre for international trade, finance, tourism, and business activities.</p>
              <H3>Modern Infrastructure</H3>
              <p>The city offers developed road networks, public transportation, educational institutions, healthcare facilities, and shopping centres.</p>
              <H3>International Connectivity</H3>
              <p>Dubai's international airport and transport infrastructure make it convenient for residents, business owners, and international property investors.</p>

              <H2>2. Different Types of Properties Available in Dubai</H2>
              <Table
                head={["Property Type", "Suitable For", "Important Factors to Check"]}
                rows={[
                  ["Apartments", "Individuals, couples, and families", "Size, facilities, service charges"],
                  ["Luxury Villas", "Families looking for larger homes", "Location, maintenance, privacy"],
                  ["Townhouses", "Families interested in community living", "Layout, shared facilities, connectivity"],
                  ["Commercial Properties", "Business owners and investors", "Tenant demand, lease terms, business location"],
                ]}
              />

              <H2>3. Popular Locations to Explore in Dubai</H2>
              <Table
                head={["Location", "Key Features"]}
                rows={[
                  ["Downtown Dubai", "Central location, premium developments, shopping, and business access"],
                  ["Dubai Marina", "Waterfront lifestyle, residential towers, restaurants, and entertainment"],
                  ["Business Bay", "Commercial activity and residential developments"],
                  ["Jumeirah Village Circle", "Apartments and townhouses in a residential community"],
                  ["Dubai Hills Estate", "Planned community, green spaces, and lifestyle facilities"],
                ]}
              />

              <H2>4. Off-Plan vs Ready Properties: Which Option Is Better?</H2>
              <Table
                head={["Comparison", "Off-Plan Property", "Ready Property"]}
                rows={[
                  ["Construction", "Under development", "Completed"],
                  ["Possession", "After construction and handover", "Usually available sooner"],
                  ["Payment", "Developer-specific payment plans", "Based on purchase agreement"],
                  ["Inspection", "Plans and specifications", "Physical inspection"],
                  ["Rental Income", "Generally after completion", "Potentially available sooner"],
                  ["Main Risk", "Construction and delivery delays", "Property condition and existing costs"],
                ]}
              />

              <H2>5. Additional Costs Involved in Buying Property</H2>
              <UL items={[
                "Dubai Land Department registration fees.",
                "Real estate agency commission, where applicable.",
                "Mortgage processing and valuation charges.",
                "Property service charges.",
                "Maintenance and repair expenses.",
              ]} />
              <div className="rounded-lg bg-sippy-charcoal p-4 text-center font-semibold text-white">
                Total Property Budget = Property Price + Registration Charges + Transaction Costs + Maintenance Reserve + Other Applicable Expenses
              </div>

              <H2>6. Legal Requirements for International Property Buyers</H2>
              <UL items={[
                "Confirm that the property is in an approved ownership area.",
                "Verify the seller's ownership documents.",
                "Review the sale and purchase agreement.",
                "Check the project's registration and approvals.",
              ]} />

              <H2>7. Important Factors to Evaluate Before Investing</H2>
              <UL items={[
                <><strong>Location:</strong> Evaluate transport facilities, schools, and workplaces.</>,
                <><strong>Developer Reputation:</strong> Review previous projects and delivery history.</>,
                <><strong>Rental Demand:</strong> Research the area's tenant profile and rental activity.</>,
              ]} />

              <H2>8. Steps to Follow Before Purchasing a Property</H2>
              <Table
                head={["Step", "What Should You Do?"]}
                rows={[
                  ["1. Define Your Purpose", "Decide whether the property is for personal use, rental, or investment."],
                  ["2. Set Your Budget", "Include property price, registration charges, and emergency reserve."],
                  ["3. Research Locations", "Compare communities based on facilities and connectivity."],
                  ["4. Verify Documents", "Check ownership details, project approvals, and agreements."],
                ]}
              />
              <H3>Buyer's Checklist</H3>
              <ul className="space-y-2">
                {[
                  "Have you finalised your purchase budget?",
                  "Have you compared different locations?",
                  "Have you checked the developer's background?",
                  "Have you verified ownership documents?",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2"><span className="text-sippy-gold">✔</span><span>{t}</span></li>
                ))}
              </ul>

              <H2>9. Exploring Real Estate Opportunities with Sippy Housing</H2>
              <p>
                <Link to="/" className="text-sippy-gold underline hover:text-sippy-charcoal">Sippy Housing</Link> offers real estate services and property opportunities across Mumbai and beyond.
              </p>
              <p>Buyers interested in reviewing selected property options can also visit the <Link to="/#international" className="text-sippy-gold underline">property favourites section</Link>.</p>

              <H2>Methodology and Limitations</H2>
              <p>This guide provides a general overview of property buying considerations in Dubai for 2026.</p>

              <H2>Frequently Asked Questions (FAQs)</H2>
              <div className="space-y-3">
                {FAQS.map(([q, a], i) => (
                  <details key={q} className="group rounded-lg border bg-white p-4">
                    <summary className="cursor-pointer font-semibold text-sippy-charcoal">{i + 1}. {q}</summary>
                    <p className="mt-2 text-base">{a}</p>
                  </details>
                ))}
              </div>

              <H2>Conclusion</H2>
              <p>
                Ultimately, a well-planned <Link to="/#properties" className="text-sippy-gold underline hover:text-sippy-charcoal">property in Dubai</Link> purchase should match the buyer's financial capacity, intended use, and long-term objectives.
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