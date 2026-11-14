import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

/* ------------------------------------------------------------------ */
/*  STATIC BLOG DATA - BLOG 12 (Dubai Off-Plan Payment Plans Guide)   */
/*  Put the image at: public/blogimg12.jpeg (or change path below)    */
/* ------------------------------------------------------------------ */
const POST = {
  slug: "how-do-dubai-off-plan-payment-plans-work-a-complete-guide-to-60-40-80-20-and-post-handover-options",
  title: "How Do Dubai Off-Plan Payment Plans Work? A Complete Guide to 60/40, 80/20 and Post-Handover Options",
  category: "Buyer & Investor Guide",
  author: "Sippy Housing",
  published_at: "2026-11-14",
  read_time: 8,
  image: "/blogimg12.jpeg",
  tags: [
    "Off-Plan Payment Plans",
    "Dubai Off-Plan",
    "60/40 Payment Plan",
    "80/20 Payment Plan",
    "Post-Handover",
    "1% Monthly Plan",
    "Dubai Real Estate",
    "2026",
  ],
  excerpt:
    "Confused by Dubai off-plan payment plans? Discover how 60/40, 80/20, post-handover, and 1% monthly structures work, with illustrative breakdowns, checklists, and additional cost factors.",
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
  { label: "What Is an Off-Plan Payment Plan in Dubai?" },
  { label: "What Are the Main Stages of a Payment Plan?", sub: true },
  { label: "What Does a 60/40 Payment Plan Mean in Dubai?" },
  { label: "How Does an 80/20 Payment Plan Work?" },
  { label: "What Is a Post-Handover Payment Plan in Dubai?" },
  { label: "Is a Post-Handover Plan Always Better?", sub: true },
  { label: "How Does a 1% Monthly Payment Plan Work?" },
  { label: "Which Dubai Payment Plan Should You Choose?" },
  { label: "What Should You Check Before Selecting a Payment Plan?", sub: true },
  { label: "What Additional Costs Should Buyers Consider?" },
  { label: "How Can You Protect Your Investment When Choosing an Off-Plan Plan?" },
  { label: "How Can You Find the Right Off-Plan Property in Dubai?" },
  { label: "Frequently Asked Questions About Dubai Off-Plan Payment Plans" },
  { label: "Final Thoughts: How Can You Choose the Best Payment Plan?" },
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
    "What is the most common off-plan payment plan in Dubai?",
    "Payment structures vary by developer and project. Buyers may come across 60/40, 80/20, 70/30, post-handover, and monthly instalment arrangements. Always check the actual project payment schedule.",
  ],
  [
    "Can I rent out a property with a post-handover payment plan?",
    "This may be possible after the property has been handed over and is legally ready for occupation or leasing. Buyers should confirm the developer's agreement and applicable requirements before relying on rental income.",
  ],
  [
    "Is a 1% monthly payment plan interest-free?",
    "The phrase 1% monthly describes the instalment structure, not necessarily every financial condition of the purchase. Review the Sale and Purchase Agreement to understand the total price, fees, and payment obligations.",
  ],
  [
    "Are registration fees included in developer payment plans?",
    "Not necessarily. Registration and other transaction-related charges may be payable separately. Buyers should request a complete cost breakdown before booking.",
  ],
  [
    "Can payment plans change between projects?",
    "Yes. Developers can offer different payment structures, booking amounts, instalment dates, and handover conditions. The signed agreement for the specific property determines the buyer's obligations.",
  ],
];

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

export default function DubaiBlog12() {
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
              alt="How Do Dubai Off-Plan Payment Plans Work? A Complete Guide to 60/40, 80/20 and Post-Handover Options"
              className="mb-8 w-full rounded-xl object-cover shadow"
            />

            <MobileTableOfContents />

            <div className="space-y-5 text-lg leading-relaxed text-gray-700">
              <H2>Introduction</H2>
              <p>
                Are you planning to buy an off-plan property in Dubai but confused by payment plans such as 60/40, 80/20, 1% monthly, and post-handover options? Dubai's real estate market offers different payment structures that allow buyers to pay for a property in stages instead of paying the entire amount upfront.
              </p>
              <p>
                Understanding an <Link to="/#properties" className={linkClass}>off plan payment plan dubai</Link> is important before booking a property because each structure affects your budget, payment schedule, and financial planning. Some plans require a larger amount during construction, while others allow buyers to pay a portion after receiving the property.
              </p>
              <p>
                Whether you are a first-time buyer or an experienced investor, knowing how these plans work can help you compare projects and select an option that matches your financial goals.
              </p>
              <p>
                If you are exploring property opportunities in Dubai, visit <Link to="/" className={linkClass}>Sippy Housing</Link> to learn more about available real estate options and investment opportunities.
              </p>

              {/* SECTION: Definition */}
              <H2>What Is an Off-Plan Payment Plan in Dubai?</H2>
              <p>
                An off-plan payment plan is a structured payment arrangement offered by a property developer when a buyer purchases a property before its construction is completed. Instead of paying the full property price immediately, the buyer makes payments according to an agreed schedule.
              </p>
              <p>
                These payments may be connected to construction milestones or specific calendar dates. Depending on the project, a buyer may pay an initial booking amount, followed by instalments during construction and a final payment at handover.
              </p>
              <p>
                An <Link to="/#properties" className={linkClass}>off plan payment plan dubai</Link> can make property purchases more manageable by spreading payments over a longer period. However, buyers should always check the complete payment schedule and additional charges before making a booking.
              </p>

              <H3>What Are the Main Stages of a Payment Plan?</H3>
              <p>Most off-plan payment arrangements include these distinct stages:</p>
              <UL
                items={[
                  <><strong>Booking Amount:</strong> The initial payment required to reserve the selected property.</>,
                  <><strong>Construction Instalments:</strong> Payments made in stages according to the developer's agreed schedule.</>,
                  <><strong>Handover Payment:</strong> The amount payable when the property is completed and ready for possession.</>,
                  <><strong>Post-Handover Instalments:</strong> If included in the agreement, the remaining amount is paid over an agreed period after handover.</>,
                ]}
              />
              <p className="text-sm text-gray-500">
                The exact percentages, payment dates, and conditions depend on the developer and the Sale and Purchase Agreement (SPA).
              </p>

              {/* SECTION: 60/40 */}
              <H2>What Does a 60/40 Payment Plan Mean in Dubai?</H2>
              <p>
                A 60/40 payment plan means that 60% of the property price is paid before handover, while the remaining 40% is payable at handover.
              </p>
              <p>
                For example, if you purchase an apartment worth AED 1,000,000, the payment structure would look like this:
              </p>
              <Table
                head={["Payment Stage", "Percentage", "Amount (AED 1,000,000 Example)"]}
                rows={[
                  ["During construction", "60%", "AED 600,000"],
                  ["At handover", "40%", "AED 400,000"],
                  ["Total property price", "100%", "AED 1,000,000"],
                ]}
              />
              <p>
                The initial booking amount is generally included within the 60% construction portion rather than being an additional amount on top of it.
              </p>
              <p>
                A 60/40 payment plan can suit buyers who prefer to distribute payments throughout construction and have a financial arrangement ready for the remaining amount at handover. Before selecting this option, check whether the final instalment can be paid through available funds or an eligible mortgage.
              </p>

              {/* SECTION: 80/20 */}
              <H2>How Does an 80/20 Payment Plan Work?</H2>
              <p>
                An 80/20 payment plan requires buyers to pay 80% of the property price during construction and the remaining 20% at handover.
              </p>
              <p>For a property priced at AED 1,000,000, the payment breakdown would be:</p>
              <Table
                head={["Payment Stage", "Percentage", "Amount (AED 1,000,000 Example)"]}
                rows={[
                  ["During construction", "80%", "AED 800,000"],
                  ["At handover", "20%", "AED 200,000"],
                  ["Total property price", "100%", "AED 1,000,000"],
                ]}
              />
              <p>
                This structure allows buyers to complete most of the property payments before receiving the keys.
              </p>
              <p>
                An 80/20 payment plan may be suitable for buyers who have sufficient funds available during construction and want a smaller final payment at handover. However, paying a larger portion earlier means you should plan your finances carefully. Always compare payment dates with your expected income and cash flow.
              </p>

              {/* SECTION: Post-Handover */}
              <H2>What Is a Post-Handover Payment Plan in Dubai?</H2>
              <p>
                A post-handover payment plan allows buyers to pay a portion of the property price after the property has been completed and handed over.
              </p>
              <p>
                Under this arrangement, the buyer pays an agreed amount during construction and at handover, while the remaining balance is divided into instalments over a specified period. Depending on the project, the payment period may extend across several months or years.
              </p>
              <p>For example, consider a property worth AED 1,000,000 with the following illustrative structure:</p>
              <Table
                head={["Payment Stage", "Percentage", "Amount (AED 1,000,000 Example)"]}
                rows={[
                  ["During construction", "50%", "AED 500,000"],
                  ["At handover", "10%", "AED 100,000"],
                  ["After handover (Instalments)", "40%", "AED 400,000"],
                  ["Total property price", "100%", "AED 1,000,000"],
                ]}
              />
              <p>
                The remaining AED 400,000 could be divided into instalments according to the developer's agreement.
              </p>
              <p>
                A <Link to="/#properties" className={linkClass}>post-handover payment plan dubai</Link> option may appeal to investors who want to receive the property before completing all payments. If the property is eligible for rental and finds a tenant, rental income may help contribute towards future instalments. However, rental income is not guaranteed, and buyers should be prepared to meet payments independently.
              </p>

              <H3>Is a Post-Handover Plan Always Better?</H3>
              <p>
                Not necessarily. A longer payment period may appear attractive, but buyers should consider the total property price, instalment frequency, payment deadlines, and any additional contractual conditions.
              </p>
              <p>
                Before choosing a <Link to="/#properties" className={linkClass}>post handover payment plan dubai</Link>, check whether the property can be rented or occupied after handover, when the remaining payments become due, and what happens if an instalment is delayed.
              </p>

              {/* SECTION: 1% Monthly */}
              <H2>How Does a 1% Monthly Payment Plan Work?</H2>
              <p>
                A 1% monthly payment plan is a payment structure in which the buyer pays instalments equivalent to approximately 1% of the property price each month, according to the developer's schedule.
              </p>
              <p>
                For example, if the property price is AED 1,000,000, a 1% monthly instalment would equal AED 10,000.
              </p>
              <p>
                The complete payment structure may include an initial booking amount, monthly instalments, and a remaining amount due at or after handover. The exact arrangement varies between projects.
              </p>
              <p>
                A <Link to="/#properties" className={linkClass}>1% payment plan dubai</Link> option can make monthly budgeting easier for some buyers because the instalment amount is relatively predictable. However, the monthly payment alone does not show the complete financial commitment. Buyers should calculate the booking amount, total monthly instalments, handover balance, and any post-handover payments before making a decision.
              </p>

              {/* SECTION: Comparison */}
              <H2>Which Dubai Payment Plan Should You Choose?</H2>
              <p>
                Different payment plans are designed for different financial situations. The best option depends on how much you can pay during construction, how much you want to keep available for later, and when you need the property.
              </p>
              <Table
                head={["Payment Plan", "Payment Structure", "May Suit"]}
                rows={[
                  ["80/20", "80% before handover, 20% at handover", "Buyers with stronger construction-period funds"],
                  ["60/40", "60% before handover, 40% at handover", "Buyers planning for a larger final payment or mortgage at completion"],
                  ["Post-handover", "Part of the price paid after handover", "Buyers who prefer payments spread beyond completion"],
                  ["1% monthly", "Regular monthly instalments under the agreed schedule", "Buyers who prefer structured monthly budgeting"],
                ]}
              />
              <p className="text-sm text-gray-500">
                When comparing an <Link to="/#properties" className={linkClass}>off plan payment plan dubai</Link>, do not select an option simply because its initial payment looks lower. Consider the complete amount and timing of every instalment.
              </p>

              <H3>What Should You Check Before Selecting a Payment Plan?</H3>
              <div className="rounded-xl border bg-white p-5 shadow-sm">
                <ul className="space-y-2">
                  {[
                    "Review the developer's complete payment schedule.",
                    "Confirm the booking amount and the next instalment date.",
                    "Understand whether payments are time-based or construction-linked.",
                    "Check the expected project completion and handover dates.",
                    "Calculate the exact amount due at handover.",
                    "Review any post-handover instalment conditions.",
                    "Keep additional registration and administrative costs in your budget.",
                    "Read the Sale and Purchase Agreement (SPA) before signing.",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-bold text-sippy-gold">✔</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* SECTION: Additional Costs */}
              <H2>What Additional Costs Should Buyers Consider?</H2>
              <p>
                A developer's payment plan generally explains how the property price is divided. It does not necessarily include every expense associated with purchasing a property.
              </p>
              <p>Buyers should also consider:</p>
              <UL
                items={[
                  <><strong>Dubai Land Department Registration Fee:</strong> Applicable 4% DLD registration charges should be factored into your budget.</>,
                  <><strong>Oqood and Administrative Charges:</strong> Interim off-plan property registration and project administrative fees.</>,
                  <><strong>Agency Fees:</strong> Brokerage charges, where applicable under your agreements.</>,
                  <><strong>Service Charges:</strong> Recurring maintenance and service charges that apply after completion and handover.</>,
                  <><strong>Utility and Other Charges:</strong> Connection fees, deposits, and initial administrative setup expenses.</>,
                ]}
              />
              <p>
                For official information about property registration and procedures, visit the{" "}
                <a href="https://dubailand.gov.ae/" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  Dubai Land Department
                </a>.
              </p>

              {/* SECTION: Protection */}
              <H2>How Can You Protect Your Investment When Choosing an Off-Plan Plan?</H2>
              <p>
                A flexible payment structure is useful only when the project and agreement are properly evaluated. Before booking, buyers should verify the developer, project details, and contractual conditions.
              </p>
              <p>
                Dubai has a regulated framework for off-plan property projects, including mandatory project escrow accounts. Buyers should confirm the project's registration and correct escrow account details through official channels.
              </p>
              <div className="rounded-xl border bg-white p-5 shadow-sm">
                <ul className="space-y-2">
                  {[
                    "Verify the developer's track record and completed projects.",
                    "Confirm the project's registration with the relevant authorities.",
                    "Review the Sale and Purchase Agreement carefully.",
                    "Check the escrow account details before making payments.",
                    "Understand the construction timeline and handover conditions.",
                    "Review the consequences of late payments and other contractual obligations.",
                    "Keep copies of payment receipts and transaction documents.",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-bold text-sippy-gold">✔</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p>
                A well-reviewed <Link to="/#properties" className={linkClass}>off plan payment plan dubai</Link> should be clear about the amount payable, payment dates, handover conditions, and any remaining financial obligations.
              </p>

              {/* SECTION: Find Right Property */}
              <H2>How Can You Find the Right Off-Plan Property in Dubai?</H2>
              <p>
                Choosing a property involves more than comparing payment structures. Buyers should also evaluate the location, developer reputation, property type, nearby facilities, and potential demand.
              </p>
              <p>
                Some buyers prefer apartments in established communities, while others explore new developments with modern facilities and future growth potential.
              </p>
              <p>
                If you are still comparing property options, explore our related guide:{" "}
                <Link
                  to="/blog/off-plan-vs-ready-property-in-dubai-which-is-better-for-you"
                  className={linkClass}
                >
                  Off-Plan vs Ready Property in Dubai: Which Is Better for You?
                </Link>
                . Understanding the differences between property types and payment structures can help you make a decision that suits your financial plans.
              </p>

              {/* SECTION: FAQs */}
              <H2>Frequently Asked Questions About Dubai Off-Plan Payment Plans</H2>
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
              <H2>Final Thoughts: How Can You Choose the Best Payment Plan?</H2>
              <p>
                Understanding payment plans is an important step towards making a confident real estate decision. Whether you are comparing 60/40 and 80/20 structures or considering a longer post-handover arrangement, review the complete payment schedule before committing.
              </p>
              <p>
                <Link to="/" className={linkClass}>Sippy Housing</Link> helps buyers explore Dubai property opportunities and understand different real estate options. Visit our website to explore available properties and take the next step towards your Dubai real estate journey.
              </p>

              <div className="mt-6 space-y-2 rounded-lg bg-gray-100 p-4 text-sm text-gray-700">
                <strong>Related Reading:</strong>
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
                    to="/blog/where-can-you-find-the-best-studio-apartments-in-dubai-prices-areas-investment-potential"
                    className={linkClass}
                  >
                    Where Can You Find the Best Studio Apartments in Dubai? Prices, Areas &amp; Investment Potential
                  </Link>
                </div>
                <div>
                  <Link
                    to="/blog/rental-yield-in-dubai-which-areas-give-the-best-roi"
                    className={linkClass}
                  >
                    Rental Yield in Dubai: Which Areas Give the Best ROI?
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {POST.tags.map((t) => (
                <span key={t} className="rounded-full border bg-white px-3 py-1 text-sm text-gray-600">
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-10 rounded-xl bg-white p-6 text-center shadow">
              <p className="mb-3 font-semibold text-sippy-charcoal">Looking for off-plan investment opportunities?</p>
              <Link
                to="/"
                className="inline-block rounded-lg bg-sippy-gold px-6 py-2 font-semibold text-white hover:bg-sippy-gold/90"
              >
                Explore properties
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