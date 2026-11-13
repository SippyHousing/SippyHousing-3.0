import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

/* ------------------------------------------------------------------ */
/*  STATIC BLOG DATA - BLOG 6                                         */
/*  Put the image at: public/dubai-property-guide.png (or your image)  */
/* ------------------------------------------------------------------ */
const POST = {
  slug: "where-can-you-find-the-best-apartments-for-sale-in-dubai-a-guide-to-areas-prices-&-budgets",
  title: "Where Can You Find the Best Apartments for Sale in Dubai? A Guide to Areas, Prices & Budgets",
  category: "Dubai Real Estate",
  author: "Sippy Housing",
  published_at: "2026-11-07",
  read_time: 8,
  image: "/blogimg6.jpeg",
  tags: ["Dubai Apartments", "Apartments for Sale", "Dubai Marina", "Downtown Dubai", "JVC", "Buyer Guide", "2026"],
  excerpt:
    "Planning to purchase an apartment in Dubai? Explore top residential areas including Dubai Marina, Downtown, and JVC, price factors, budget planning, apartment types, and essential buyer tips.",
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
const Table = ({ head, rows }: { head: string[]; rows: (React.ReactNode | string)[][] }) => (
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

// Table of contents (labels must match the <H2> / <H3> text exactly)
const TOC: { label: string; sub?: boolean }[] = [
  { label: "Introduction" },
  { label: "Quick Overview: What Should You Know Before Buying an Apartment?", sub: true },
  { label: "Why Should You Consider Buying an Apartment in Dubai?" },
  { label: "1. What Different Property Choices Are Available?", sub: true },
  { label: "2. What Modern Facilities Can You Expect?", sub: true },
  { label: "3. How Does Dubai's Infrastructure Make Living Convenient?", sub: true },
  { label: "4. Can Buying an Apartment Be a Long-Term Investment?", sub: true },
  { label: "Which Are the Best Areas to Buy an Apartment in Dubai?" },
  { label: "1. Is Dubai Marina a Good Choice for Waterfront Living?", sub: true },
  { label: "2. Why Do Buyers Prefer Downtown Dubai?", sub: true },
  { label: "3. Should You Consider Business Bay?", sub: true },
  { label: "4. Is Jumeirah Village Circle Suitable for Different Budgets?", sub: true },
  { label: "5. Why Is Dubai Hills Estate Popular Among Families?", sub: true },
  { label: "How Much Do Apartments in Dubai Cost?" },
  { label: "How Can You Plan Your Apartment Budget?" },
  { label: "What Types of Apartments Can You Buy in Dubai?" },
  { label: "What Should You Check Before Buying an Apartment in Dubai?" },
  { label: "Property Buying Checklist", sub: true },
  { label: "How Can You Choose the Right Apartment According to Your Budget?" },
  { label: "What Common Mistakes Should You Avoid When Buying Property?" },
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
  ["Which Areas Are Popular for Buying Apartments in Dubai?", "Dubai Marina, Downtown Dubai, Business Bay, Jumeirah Village Circle (JVC), and Dubai Hills Estate are among the most sought-after areas. The right choice depends on whether you seek central prestige, high rental yields, or family-friendly community living."],
  ["Are Dubai Apartments Suitable for Investment?", "Yes. Dubai offers competitive rental yields (often 6% to 8% gross) and zero property taxes. However, returns depend on acquisition cost, location, building service charges, and tenant occupancy."],
  ["What Additional Costs Should You Consider?", "Buyers should account for 4% Dubai Land Department (DLD) transfer fees, 2% agency commission, title deed administrative fees, and ongoing annual service charges (maintenance fees per square foot)."],
  ["Can Foreign Buyers Purchase Apartments in Dubai?", "Yes. Foreign nationals can purchase freehold apartments in designated investment zones with 100% full foreign ownership."],
  ["Should You Choose a Ready or Off-Plan Apartment?", "A ready apartment offers immediate handover and immediate rental income. An off-plan apartment offers flexible payment milestones during construction. Choose based on your capital readiness and possession timeline."],
];

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

export default function BlogPost6() {
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
              alt="Where Can You Find the Best Apartments for Sale in Dubai? A Guide to Areas, Prices & Budgets"
              className="mb-8 w-full rounded-xl object-cover shadow"
            />

            <MobileTableOfContents />

            <div className="space-y-5 text-lg leading-relaxed text-gray-700">
              <H2>Introduction</H2>
              <p>
                Are you planning to purchase a property in <Link to="/#properties" className="text-sippy-gold underline hover:text-sippy-charcoal">Dubai</Link> but unsure which location or apartment type would be right for you? Dubai offers a wide range of residential options, from budget-friendly studios to premium waterfront apartments. With modern infrastructure, well-developed communities, and excellent lifestyle facilities, the city attracts homebuyers and property investors from different parts of the world.
              </p>
              <p>
                However, choosing the right property requires more than comparing prices. You should understand the location, property size, available facilities, ownership costs, and your future requirements before making a decision. If you are exploring <Link to="/properties" className="text-sippy-gold underline hover:text-sippy-charcoal">apartments for sale in dubai</Link>, this guide will help you understand popular residential areas, property types, budget considerations, and important factors to check before purchasing.
              </p>

              {/* Quick Overview Card */}
              <div className="rounded-xl border bg-white p-5 shadow-sm">
                <H3>Quick Overview: What Should You Know Before Buying an Apartment?</H3>
                <UL items={[
                  <><strong>Property options:</strong> Studios, 1-bedroom, 2-bedroom, and larger penthouses.</>,
                  <><strong>Popular locations:</strong> Dubai Marina, Downtown Dubai, Business Bay, Jumeirah Village Circle (JVC), and Dubai Hills Estate.</>,
                  <><strong>Main cost factors:</strong> Location, unit size, building quality, views, and shared amenities.</>,
                  <><strong>Additional expenses:</strong> DLD 4% registration, agency commission, service charges, and maintenance.</>,
                  <><strong>Important step:</strong> Verify ownership details and transaction documents before transferring funds.</>,
                ]} />
              </div>

              {/* SECTION: Why Consider */}
              <H2>Why Should You Consider Buying an Apartment in Dubai?</H2>
              <p>
                Dubai offers a wide range of residential options, making it possible for buyers to compare properties according to their lifestyle and financial plans. Some buyers prefer apartments close to business districts, while others look for peaceful communities with parks, schools, and family-friendly facilities.
              </p>

              <H3>1. What Different Property Choices Are Available?</H3>
              <p>
                Buyers can choose from compact studios, modern one-bedroom units, spacious family apartments, and premium luxury penthouses. This variety makes it easier to shortlist properties according to household requirements and budget.
              </p>

              <H3>2. What Modern Facilities Can You Expect?</H3>
              <p>
                Many residential buildings provide resort-style facilities such as temperature-controlled swimming pools, fully equipped fitness centres, covered parking, 24/7 concierge and security, landscaped courtyards, and children's play areas.
              </p>

              <H3>3. How Does Dubai's Infrastructure Make Living Convenient?</H3>
              <p>
                Dubai has established arterial road networks, direct Dubai Metro connections, shopping malls, healthcare facilities, and commercial business districts. Choosing a location with convenient access to everyday services improves both living quality and resale liquidity.
              </p>

              <H3>4. Can Buying an Apartment Be a Long-Term Investment?</H3>
              <p>
                Many buyers consider residential property for predictable rental income or long-term capital appreciation. However, rental returns and property values depend on purchase price, micro-market demand, building maintenance, and wider macroeconomic trends.
              </p>

              {/* SECTION: Best Areas */}
              <H2>Which Are the Best Areas to Buy an Apartment in Dubai?</H2>
              <p>
                Location is the most decisive factor when selecting a property. Different neighbourhoods offer distinct lifestyles, amenities, and price brackets:
              </p>

              <H3>1. Is Dubai Marina a Good Choice for Waterfront Living?</H3>
              <p>
                <strong>Best for:</strong> Waterfront living and an active urban lifestyle.<br />
                Dubai Marina is renowned for its high-rise skyline, yacht berths, restaurants, shopping malls, and pedestrian-friendly promenade. It strongly appeals to working professionals, couples, and short-term holiday rental investors.
              </p>

              <H3>2. Why Do Buyers Prefer Downtown Dubai?</H3>
              <p>
                <strong>Best for:</strong> Premium luxury living and central connectivity.<br />
                Downtown Dubai is home to iconic landmarks such as the Burj Khalifa, Dubai Mall, and Dubai Opera. Properties here command premium valuations and attract buyers seeking elite urban luxury and high prestige.
              </p>

              <H3>3. Should You Consider Business Bay?</H3>
              <p>
                <strong>Best for:</strong> Corporate professionals and city-centre convenience.<br />
                Business Bay combines sleek residential towers with international corporate headquarters, hotels, and Dubai Canal views. Its proximity to Downtown Dubai makes it an enduring favourite for rental yields.
              </p>

              <H3>4. Is Jumeirah Village Circle Suitable for Different Budgets?</H3>
              <p>
                <strong>Best for:</strong> Community living and attractive rental yields.<br />
                Jumeirah Village Circle (JVC) offers apartments in a self-contained community environment featuring 30+ parks, Circle Mall, restaurants, and schools. It is widely considered one of the best areas for affordable entry prices and strong rental returns.
              </p>

              <H3>5. Why Is Dubai Hills Estate Popular Among Families?</H3>
              <p>
                <strong>Best for:</strong> Family-friendly surroundings and green master-planned living.<br />
                Dubai Hills Estate features championship golf course views, Dubai Hills Mall, international schools, and hospital networks. It is ideal for families seeking an upscale, planned residential community.
              </p>

              <div className="rounded-lg border-l-4 border-sippy-gold bg-white p-4 shadow-sm">
                <p>
                  <strong className="text-sippy-charcoal">Location Tip:</strong> Do not select an area only because of social media hype. Compare daily travel time to workplaces, nearby schools, building quality, service charges per sq. ft., and long-term tenant demand.
                </p>
              </div>

              {/* SECTION: Pricing & Factors */}
              <H2>How Much Do Apartments in Dubai Cost?</H2>
              <p>
                The price of an apartment in Dubai depends on several core variables. When researching <Link to="/#properties" className="text-sippy-gold underline hover:text-sippy-charcoal">apartments for sale in dubai</Link>, compare units with similar specifications within the same development rather than broad citywide averages.
              </p>

              <Table
                head={["Factor", "How It Affects Price"]}
                rows={[
                  ["Location", "Centrally connected prime hubs (Downtown, Marina) command premium per-sq-ft rates compared to outer suburbs."],
                  ["Property Size", "Larger total built-up square footage increases ticket size, though per-sq-ft rates may be lower for large units."],
                  ["Building Quality", "Tier-1 developers, superior finishes, modern elevators, and comprehensive amenities elevate valuation."],
                  ["Views and Floor", "High floors, full sea views, canal views, or skyline vistas command price premiums of 10% to 25%."],
                  ["Property Condition", "Turnkey renovated units sell faster and at a premium; older units requiring refurbishment provide negotiation leverage."],
                  ["Market Demand", "Micro-market vacancy rates and new competing project launches influence immediate pricing power."],
                ]}
              />

              {/* SECTION: Budget Planning */}
              <H2>How Can You Plan Your Apartment Budget?</H2>
              <p>
                Before selecting a property, calculate the complete purchase outlay rather than considering only the advertised listing price.
              </p>
              <p>Your complete purchase budget must account for:</p>
              <UL items={[
                "Agreed property purchase price",
                "Dubai Land Department (DLD) transfer charges (4% of property value)",
                "Real estate agency commission (typically 2% + VAT)",
                "Mortgage-related valuation and registration charges, if financing",
                "Annual building service charges and maintenance reserve funds",
                "Conveyancing and legal documentation assistance",
                "Furnishing and interior handover expenses",
              ]} />

              {/* SECTION: Apartment Types */}
              <H2>What Types of Apartments Can You Buy in Dubai?</H2>
              <p>Dubai offers diverse floor plan configurations to match different buyer profiles:</p>
              <UL items={[
                <><strong>Studio Apartments:</strong> Compact units combining living, dining, and sleeping areas. Ideal for single professionals, first-time investors, and high-occupancy holiday lets.</>,
                <><strong>1-Bedroom Apartments:</strong> Feature a dedicated master bedroom, separate lounge, guest powder room, and balcony. High demand across both rental and resale markets.</>,
                <><strong>2-Bedroom Apartments:</strong> Spacious layouts for couples, growing families, or working professionals needing dedicated home office space.</>,
                <><strong>Luxury Penthouses:</strong> High-floor residences boasting private plunge pools, expansive terraces, panoramic skyline views, and bespoke interior finishes.</>,
                <><strong>Ready vs Off-Plan Units:</strong> Ready properties provide immediate inspection and occupancy; off-plan developments offer construction-linked instalment payment plans.</>,
              ]} />

              {/* SECTION: Due Diligence */}
              <H2>What Should You Check Before Buying an Apartment in Dubai?</H2>
              <p>Thorough due diligence protects your investment. Always verify:</p>

              <H3>Property Buying Checklist</H3>
              <ul className="space-y-2">
                {[
                  "Verify the seller's official Title Deed (or Oqood for off-plan) with the Dubai Land Department.",
                  "Inspect the physical building condition, elevators, gym, pool, and parking allocations.",
                  "Review the exact schedule of annual service charges (maintenance fees per sq. ft.).",
                  "Confirm that there are no unpaid utility bills, developer liabilities, or tenant disputes.",
                  "Review the standard Form F (Memorandum of Understanding) terms with a professional conveyancer.",
                  "Confirm that the property is located in an approved foreign-ownership freehold zone.",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-sippy-gold font-bold">✔</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* SECTION: Choose by Budget */}
              <H2>How Can You Choose the Right Apartment According to Your Budget?</H2>
              <p>
                If you plan to <Link to="/#properties" className="text-sippy-gold underline hover:text-sippy-charcoal">buy apartment in dubai</Link>, follow these structured steps:
              </p>
              <UL items={[
                <><strong>1. Set a realistic budget:</strong> Determine your exact cash availability, including the 7% to 8% additional closing costs.</>,
                <><strong>2. Choose preferred locations:</strong> Shortlist communities based on lifestyle, commute times, and local schools.</>,
                <><strong>3. Compare property options:</strong> Benchmark competing units in the same building and neighboring towers.</>,
                <><strong>4. Inspect the property:</strong> Schedule in-person or virtual walkthroughs to verify actual views, natural light, and noise levels.</>,
                <><strong>5. Verify documents:</strong> Ensure clear title deeds, approved building plans, and registered escrow facilities before transferring deposits.</>,
              ]} />

              {/* SECTION: Common Mistakes */}
              <H2>What Common Mistakes Should You Avoid When Buying Property?</H2>
              <p>Avoid these common pitfalls to safeguard your investment:</p>
              <UL items={[
                "Ignoring annual service charges that diminish your net rental yields.",
                "Selecting an apartment based solely on discounted pricing without checking public transit and road access.",
                "Failing to compare recent registered DLD sales data for similar units in the building.",
                "Overlooking building management quality, maintenance history, and sinking fund reserves.",
                "Relying solely on verbal promises or aggressive promotional sales brochures.",
                "Signing contracts without verifying cancellation, handover, or penalty provisions.",
              ]} />

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
                Dubai offers unmatched residential opportunities across diverse locations, architectural styles, and price points. The best purchase decision comes from establishing your realistic budget, conducting meticulous due diligence, and partnering with experienced market professionals.
              </p>
              <p>
                Whether you are seeking a high-yielding studio in JVC, a waterfront residence in Dubai Marina, or a luxury residence in Downtown Dubai, taking time to evaluate <Link to="/properties" className="text-sippy-gold underline hover:text-sippy-charcoal">apartments for sale in dubai</Link> ensures long-term comfort and capital preservation.
              </p>
              <p>
                Explore <Link to="/" className="text-sippy-gold underline hover:text-sippy-charcoal">Sippy Housing</Link> to discover handpicked property opportunities and receive bespoke advisory for your next real estate acquisition.
              </p>

              <div className="mt-6 rounded-lg bg-gray-100 p-4 text-sm text-gray-700">
                <strong>Related Reading:</strong>{" "}
                <Link
                  to="/blog/what-should-you-know-before-buying-property-in-dubai-complete-guide-for-buyers-&-investors-(2026)"
                  className="text-sippy-gold underline hover:text-sippy-charcoal"
                >
                  What Should You Know Before Buying Property in Dubai? Complete Guide for Buyers & Investors (2026)
                </Link>
              </div>
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