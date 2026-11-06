import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

/* ------------------------------------------------------------------ */
/*  STATIC BLOG DATA - BLOG 5                                         */
/*  Put the image at: public/dubai-property-guide.png (or your image)  */
/* ------------------------------------------------------------------ */
const POST = {
  slug: "off-plan-properties-in-dubai-is-it-worth-investing-in-2026",
  title: "Off-Plan Properties in Dubai: Is It Worth Investing in 2026?",
  category: "Dubai Real Estate",
  author: "Sippy Housing",
  published_at: "2026-11-06",
  read_time: 7,
  image: "/blogimg5.jpeg",
  tags: ["Dubai Property", "Off-Plan", "Property Investment", "Payment Plans", "Buyer Guide", "2026"],
  excerpt:
    "Dubai's real estate market continues to attract buyers looking for modern homes and flexible payment plans. Discover whether investing in off-plan properties in Dubai is worth it in 2026, including payment structures, risks, and developer due diligence.",
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
  { label: "Quick Overview: Off-Plan Property", sub: true },
  { label: "What Are Off-Plan Properties in Dubai?" },
  { label: "Why Are Buyers Interested in Off-Plan Investment in 2026?" },
  { label: "1. Flexible Payment Plans", sub: true },
  { label: "2. Modern Designs and Amenities", sub: true },
  { label: "3. Potential for Long-Term Value", sub: true },
  { label: "How Do Off-Plan Payment Plans Work?" },
  { label: "Off-Plan vs Ready Properties: Which One Should You Choose?" },
  { label: "What Should You Check Before Buying an Off-Plan Property?" },
  { label: "Pre-Purchase Checklist", sub: true },
  { label: "What Are the Risks of Investing in Off-Plan Properties?" },
  { label: "Is 2026 a Good Time to Invest in Off-Plan Property in Dubai?" },
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
  ["What does off-plan property mean in Dubai?", "It refers to a property purchased directly from a developer before construction is completed. Buyers make payments according to an agreed milestone-linked schedule and receive possession after handover."],
  ["Are off-plan properties cheaper than ready properties?", "Some off-plan launches offer competitive launch pricing or staggered payment plans. However, buyers should always compare total prices, specifications, and service charges with similar ready homes in the same neighborhood."],
  ["Can foreign investors purchase off-plan property in Dubai?", "Yes. Foreign investors can purchase off-plan freehold properties in designated areas, subject to standard Dubai Land Department (DLD) ownership and escrow regulations."],
  ["Is off-plan investment suitable for beginners?", "It can be suitable for beginners who understand the construction timeline, have a comfortable payment buffer, and choose tier-1 developers with verified escrow accounts."],
];

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

export default function BlogPost5() {
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
              alt="Off-Plan Properties in Dubai: Is It Worth Investing in 2026?"
              className="mb-8 w-full rounded-xl object-cover shadow"
            />

            <MobileTableOfContents />

            <div className="space-y-5 text-lg leading-relaxed text-gray-700">
              <H2>Introduction</H2>
              <p>
                Dubai's real estate market continues to attract buyers and investors looking for modern homes, flexible payment options, and long-term investment opportunities. Among the available choices, off-plan developments have become an important part of the property market. These properties allow buyers to purchase a home before construction is completed, often with payment schedules linked to different construction stages.
              </p>
              <p>
                But is investing in an under-construction property the right decision in 2026? Understanding the benefits, risks, payment structures, and developer reputation can help you make a more informed choice. This guide explains what buyers should consider before exploring <Link to="/#properties" className="text-sippy-gold underline hover:text-sippy-charcoal">off plan properties in dubai</Link>.
              </p>

              {/* Quick Overview Card */}
              <div className="rounded-xl border bg-white p-5 shadow-sm">
                <H3>Quick Overview: Off-Plan Property</H3>
                <UL items={[
                  <><strong>What it means:</strong> Buying a property before construction is complete.</>,
                  <><strong>Main attraction:</strong> Flexible, construction-linked payment plans.</>,
                  <><strong>Suitable for:</strong> Long-term investors and buyers planning ahead.</>,
                  <><strong>Important consideration:</strong> Developer reliability and project completion timelines.</>,
                ]} />
              </div>

              {/* SECTION: What Are Off-Plan */}
              <H2>What Are Off-Plan Properties in Dubai?</H2>
              <p>
                An off-plan property is a residential or commercial unit purchased directly from a developer before it is fully constructed. Buyers generally select a unit based on the project plans, floor layouts, location, amenities, and expected completion date.
              </p>
              <p>
                Unlike ready properties, buyers do not receive immediate possession. Instead, they make payments according to the agreed schedule while construction progresses. This arrangement can provide more time to organise finances and plan for future ownership.
              </p>
              <p>
                For buyers comparing <Link to="/#properties" className="text-sippy-gold underline hover:text-sippy-charcoal">off plan dubai</Link> opportunities, it is important to understand the project's location, construction progress, payment conditions, and expected handover date before making a commitment.
              </p>

              {/* SECTION: Why Buyers Interested */}
              <H2>Why Are Buyers Interested in Off-Plan Investment in 2026?</H2>
              <p>
                Off-plan developments offer several features that appeal to both first-time buyers and experienced investors. However, the benefits depend on the project, developer, purchase price, and market conditions.
              </p>

              <H3>1. Flexible Payment Plans</H3>
              <p>
                Many developers offer structured payment schedules that divide the property cost into instalments. Depending on the project, payments may be connected to construction milestones, with a final amount due at handover (or even post-handover).
              </p>
              <p>
                This can make purchasing more manageable compared with paying the entire property price upfront. However, buyers should always review the payment schedule and understand the consequences of delayed payments.
              </p>

              <H3>2. Modern Designs and Amenities</H3>
              <p>
                New developments are often planned with contemporary layouts, modern facilities, parking, fitness areas, landscaped spaces, and community features. Buyers may also have different unit configurations or floor options to choose from during the launch stage.
              </p>

              <H3>3. Potential for Long-Term Value</H3>
              <p>
                A property purchased at an early development stage may offer an opportunity for value appreciation before completion. However, appreciation is never guaranteed. It depends on market demand, location, supply, construction quality, and the final purchase price.
              </p>

              <div className="rounded-lg border-l-4 border-sippy-gold bg-white p-4 shadow-sm">
                <p>
                  <strong className="text-sippy-charcoal">Investor Insight:</strong> A flexible payment plan does not automatically make a property a good investment. Compare the total purchase cost with similar ready and under-construction properties before deciding.
                </p>
              </div>

              {/* SECTION: How Payment Plans Work */}
              <H2>How Do Off-Plan Payment Plans Work?</H2>
              <p>
                Payment plans differ from one developer and project to another. A buyer may pay an initial booking amount, followed by instalments during construction and a final payment at handover.
              </p>

              <div className="rounded-lg bg-sippy-charcoal p-5 text-white">
                <p className="mb-3 font-semibold text-sippy-gold text-center uppercase tracking-wide">Illustrative Payment Plan</p>
                <div className="grid grid-cols-3 gap-2 text-center text-sm md:text-base">
                  <div className="rounded bg-white/10 p-3">
                    <span className="block text-2xl font-bold">10%</span>
                    <span className="text-xs text-gray-300">On Booking</span>
                  </div>
                  <div className="rounded bg-white/10 p-3">
                    <span className="block text-2xl font-bold">50%</span>
                    <span className="text-xs text-gray-300">During Construction</span>
                  </div>
                  <div className="rounded bg-white/10 p-3">
                    <span className="block text-2xl font-bold">40%</span>
                    <span className="text-xs text-gray-300">On Handover</span>
                  </div>
                </div>
                <p className="mt-3 text-center text-xs text-gray-300">This is an illustrative structure. Always verify the exact milestone dates in the official Sale and Purchase Agreement.</p>
              </div>

              <p>
                Before choosing <Link to="/#properties" className="text-sippy-gold underline hover:text-sippy-charcoal">off plan investment dubai</Link> opportunities, calculate the total amount due at every stage. Also consider additional expenses such as registration charges, service charges, furnishing, and possible financing costs.
              </p>

              {/* SECTION: Off-Plan vs Ready */}
              <H2>Off-Plan vs Ready Properties: Which One Should You Choose?</H2>
              <p>Both property types can suit different financial goals. The right option depends on when you need the property and how much uncertainty you are comfortable accepting.</p>

              <Table
                head={["Feature", "Off-Plan Properties", "Ready Properties"]}
                rows={[
                  ["Purchase Timing", "Purchased before project completion", "Available for immediate possession"],
                  ["Payment Method", "Staged payments linked to construction milestones", "Full payment or immediate bank mortgage required"],
                  ["Unit Options", "Access to brand-new layouts and launch configurations", "Fixed available inventory in existing building"],
                  ["Inspection", "Based on architectural plans and showroom mockups", "Buyers can physically inspect the actual unit and view"],
                  ["Rental Income", "Starts after completion and leasing formalities", "Can begin earning rental income immediately"],
                  ["Primary Risk", "Construction delays, handover timing & developer risk", "Existing building maintenance & market depreciation"],
                ]}
              />

              <div className="rounded-xl border border-sippy-gold/30 bg-sippy-beige/20 p-5">
                <p className="font-bold text-sippy-charcoal mb-1">Quick Decision Guide:</p>
                <UL items={[
                  <><strong>Choose an off-plan property</strong> if you can wait for completion, prefer staged payments, and have researched the developer carefully.</>,
                  <><strong>Consider a ready property</strong> if you need immediate possession, want to inspect the actual unit, or plan to generate rental income sooner.</>,
                ]} />
              </div>

              {/* SECTION: Due Diligence */}
              <H2>What Should You Check Before Buying an Off-Plan Property?</H2>
              <p>
                Before deciding to <Link to="/#properties" className="text-sippy-gold underline hover:text-sippy-charcoal">buy off plan property</Link>, do not rely only on attractive project images or promotional offers. Review the following points carefully:
              </p>
              <UL items={[
                <><strong>Developer Reputation:</strong> Check the developer's previous projects, delivery history, construction quality, and customer feedback. A reliable track record can help you assess project-related risks.</>,
                <><strong>Project Registration and Escrow:</strong> Verify the project's registration and applicable escrow arrangements through the relevant Dubai authorities (DLD / RERA). Understand how buyer payments are protected.</>,
                <><strong>Sale and Purchase Agreement:</strong> Read the agreement carefully. Pay attention to the unit details, total price, payment milestones, handover date, delay provisions, and cancellation terms.</>,
                <><strong>Location and Connectivity:</strong> Research nearby roads, public transport, schools, healthcare facilities, shopping areas, and planned infrastructure.</>,
                <><strong>Additional Costs:</strong> Include registration fees (4% DLD), service charges, maintenance reserve, and furnishing in your complete budget.</>,
              ]} />

              <H3>Pre-Purchase Checklist</H3>
              <ul className="space-y-2">
                {[
                  "Verify the developer's background and past completion record.",
                  "Confirm official project registration and RERA escrow account details.",
                  "Review the milestone-linked payment plan against your cash flow.",
                  "Read all clauses in the Sale and Purchase Agreement (SPA).",
                  "Check the contractual expected completion date and grace period.",
                  "Compare similar ready and off-plan properties in the same neighborhood.",
                  "Calculate all closing costs and future maintenance expenses.",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-sippy-gold font-bold">✔</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* SECTION: Risks */}
              <H2>What Are the Risks of Investing in Off-Plan Properties?</H2>
              <p>Although off-plan developments can offer attractive opportunities, buyers should understand the possible risks before investing:</p>
              <UL items={[
                <><strong>Construction Delays:</strong> Projects may take longer than expected, affecting possession plans and financial arrangements.</>,
                <><strong>Market Changes:</strong> Property values may rise or fall during construction. The expected resale value or rental income may not match initial estimates.</>,
                <><strong>Developer-Related Risks:</strong> Construction quality, project management, and delivery history can influence the final outcome.</>,
                <><strong>Resale Limitations:</strong> Selling before handover (assignment) may be subject to contractual conditions, developer minimum-paid requirements, and applicable regulations.</>,
              ]} />
              <p>The best approach is to evaluate the property based on realistic financial expectations rather than relying on promised returns.</p>

              {/* SECTION: Is 2026 a Good Time */}
              <H2>Is 2026 a Good Time to Invest in Off-Plan Property in Dubai?</H2>
              <p>
                The Dubai property market offers opportunities across different communities and property categories, but investment decisions should be based on individual project fundamentals. Market reports and transaction trends can provide useful context, although citywide performance does not guarantee the success of a particular development.
              </p>
              <p>
                For a broader understanding of Dubai's property market, pricing trends, and investment outlook, read our related guide:{" "}
                <Link
                  to="/blog/what-does-dubai-real-estate-look-like-in-2026-market-trends-prices-&-investment-outlook"
                  className="text-sippy-gold underline hover:text-sippy-charcoal"
                >
                  What Does Dubai Real Estate Look Like in 2026? Market Trends, Prices & Investment Outlook
                </Link>.
              </p>
              <p>
                When evaluating <Link to="/#properties" className="text-sippy-gold underline hover:text-sippy-charcoal">off plan properties in dubai</Link>, compare the project's price with similar developments, study the area's future supply, and consider your investment timeline. A well-researched property may suit long-term plans, while an unsuitable project can create financial pressure.
              </p>

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
                Off-plan real estate can be a useful option for buyers who want modern developments, staged payments, and a longer investment horizon. However, the decision should always involve careful research, financial planning, and verification of project details.
              </p>
              <p>
                Whether you are considering <Link to="/#properties" className="text-sippy-gold underline hover:text-sippy-charcoal">off plan investment dubai</Link> for personal use or long-term investment, focus on the developer's reputation, location, payment conditions, and realistic market expectations. Taking time to compare available opportunities can help you make a more confident property decision.
              </p>
              <p>
                <Link to="/" className="text-sippy-gold underline hover:text-sippy-charcoal">Explore Sippy Housing</Link> to learn more about Dubai real estate opportunities and get guidance while evaluating properties that match your requirements.
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