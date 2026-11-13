// import { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";
// import BlogCard from "@/components/blog/blogCard";
// import { BlogPost as Post, formatBlogDate, getBlogBySlug, getBlogs } from "@/lib/blogs";

// // Very small formatter so no extra library is needed. In the "content" column write:
// //   a blank line between paragraphs, "## Heading", "### Sub heading", "- list item", "![alt](image-url)"
// function BlogContent({ text }: { text: string }) {
//   const blocks = text.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
//   return (
//     <div className="space-y-5 text-lg leading-relaxed text-gray-700">
//       {blocks.map((b, i) => {
//         const img = b.match(/^!\[(.*)\]\((.+)\)$/);
//         if (img) return <img key={i} src={img[2]} alt={img[1]} loading="lazy" className="w-full rounded-lg" />;
//         if (b.startsWith("### ")) return <h3 key={i} className="pt-2 text-xl font-bold text-sippy-charcoal">{b.slice(4)}</h3>;
//         if (b.startsWith("## ")) return <h2 key={i} className="pt-4 text-2xl font-bold text-sippy-charcoal">{b.slice(3)}</h2>;
//         const lines = b.split("\n").map((l) => l.trim());
//         if (lines.every((l) => l.startsWith("- ")))
//           return <ul key={i} className="list-disc space-y-1 pl-6">{lines.map((l, j) => <li key={j}>{l.slice(2)}</li>)}</ul>;
//         return <p key={i} className="whitespace-pre-line">{b}</p>;
//       })}
//     </div>
//   );
// }

// // Page: /blog/:slug   e.g. /blog/how-to-choose-the-right-home-in-bandra
// const BlogPostPage = () => {
//   const { slug = "" } = useParams();
//   const [post, setPost] = useState<Post | null | undefined>(undefined); // undefined = loading, null = not found
//   const [more, setMore] = useState<Post[]>([]);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//     setPost(undefined);
//     getBlogBySlug(slug).then(setPost);
//     getBlogs().then((all) => setMore(all.filter((p) => p.slug !== slug).slice(0, 3)));
//   }, [slug]);

//   // browser tab title + search-engine description
//   useEffect(() => {
//     if (!post) return;
//     const oldTitle = document.title;
//     document.title = `${post.title} | Sippy Housing`;
//     let meta = document.querySelector('meta[name="description"]');
//     if (!meta) {
//       meta = document.createElement("meta");
//       meta.setAttribute("name", "description");
//       document.head.appendChild(meta);
//     }
//     meta.setAttribute("content", post.excerpt ?? "");
//     return () => { document.title = oldTitle; };
//   }, [post]);

//   if (post === undefined) {
//     return <div className="flex min-h-screen items-center justify-center"><p>Loading blog...</p></div>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
//       <main className="container mx-auto px-4 py-8 mt-20">
//         {post === null ? (
//           <div className="py-24 text-center">
//             <h1 className="mb-3 text-2xl font-bold text-sippy-charcoal">Blog not found</h1>
//             <Link to="/blog" className="text-sippy-gold hover:underline">Back to all blogs</Link>
//           </div>
//         ) : (
//           <article className="mx-auto max-w-3xl">
//             <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500" aria-label="Breadcrumb">
//               <Link to="/" className="hover:text-sippy-gold">Home</Link> <span>›</span>
//               <Link to="/blog" className="hover:text-sippy-gold">Blog</Link> <span>›</span>
//               <span className="text-gray-700">{post.title}</span>
//             </nav>

//             {post.category && <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-sippy-gold">{post.category}</p>}
//             <h1 className="mb-4 text-3xl font-bold leading-tight text-sippy-charcoal md:text-4xl">{post.title}</h1>
//             {post.excerpt && <p className="mb-5 text-lg italic text-gray-600">{post.excerpt}</p>}

//             <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
//               <span className="inline-flex items-center gap-1"><User className="h-4 w-4" />{post.author || "Sippy Housing"}</span>
//               <span className="inline-flex items-center gap-1"><Calendar className="h-4 w-4" />{formatBlogDate(post.published_at)}</span>
//               <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" />{post.read_time ?? 1} min read</span>
//             </div>

//             {post.cover_image && <img src={post.cover_image} alt={post.title} className="mb-8 w-full rounded-xl object-cover" />}

//             <BlogContent text={post.content ?? ""} />

//             {!!post.tags?.length && (
//               <div className="mt-8 flex flex-wrap gap-2">
//                 {post.tags.map((t) => <span key={t} className="rounded-full border bg-white px-3 py-1 text-sm text-gray-600">{t}</span>)}
//               </div>
//             )}

//             <div className="mt-10 rounded-xl bg-white p-6 text-center shadow">
//               <p className="mb-3 font-semibold text-sippy-charcoal">Looking for your next property?</p>
//               <Link to="/" className="inline-block rounded-lg bg-sippy-gold px-6 py-2 font-semibold text-white hover:bg-sippy-gold/90">Explore properties</Link>
//             </div>

//             <Link to="/blog" className="mt-8 inline-flex items-center text-sippy-gold hover:text-sippy-charcoal">
//               <ArrowLeft className="mr-2 h-4 w-4" /> Back to all blogs
//             </Link>
//           </article>
//         )}

//         {more.length > 0 && post && (
//           <section className="mx-auto mt-16 max-w-6xl">
//             <h2 className="mb-6 text-2xl font-bold text-sippy-charcoal">More articles</h2>
//             <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
//               {more.map((p) => <BlogCard key={p.id} post={p} />)}
//             </div>
//           </section>
//         )}
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default BlogPostPage;


// import { useEffect } from "react";
// import { Link } from "react-router-dom";
// import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";

// /* ------------------------------------------------------------------ */
// /*  STATIC BLOG DATA (no Supabase)                                     */
// /*  Put the image at:  public/images/blog/dubai-property-guide.png     */
// /* ------------------------------------------------------------------ */
// const POST = {
//   slug: "what-should-you-know-before-buying-property-in-dubai",
//   title: "What Should You Know Before Buying Property in Dubai? Complete Guide for Buyers & Investors (2026)",
//   category: "Dubai Real Estate",
//   author: "Sippy Housing",
//   published_at: "2026-11-02",
//   read_time: 9,
//   image: "/public/dubai-property-guide.png",
//   tags: ["Dubai Property", "Property Investment", "Off-Plan", "Buyer Guide", "2026"],
//   excerpt:
//     "Dubai has become a popular destination for international property buyers and real estate investors. Its modern infrastructure, business opportunities, premium residential communities, and international connectivity attract people looking to purchase homes or explore investment opportunities.",
// };

// // ---------- small reusable pieces ----------
// const H2 = ({ children }: { children: React.ReactNode }) => (
//   <h2 className="pt-6 text-2xl font-bold text-sippy-charcoal">{children}</h2>
// );
// const H3 = ({ children }: { children: React.ReactNode }) => (
//   <h3 className="pt-2 text-xl font-bold text-sippy-charcoal">{children}</h3>
// );
// const UL = ({ items }: { items: React.ReactNode[] }) => (
//   <ul className="list-disc space-y-1 pl-6">
//     {items.map((t, i) => <li key={i}>{t}</li>)}
//   </ul>
// );
// const Table = ({ head, rows }: { head: string[]; rows: string[][] }) => (
//   <div className="overflow-x-auto rounded-lg border bg-white">
//     <table className="w-full text-left text-base">
//       <thead className="bg-sippy-charcoal text-white">
//         <tr>{head.map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr>
//       </thead>
//       <tbody>
//         {rows.map((r, i) => (
//           <tr key={i} className="border-t">
//             {r.map((c, j) => (
//               <td key={j} className={`px-4 py-3 align-top ${j === 0 ? "font-semibold text-sippy-charcoal" : ""}`}>{c}</td>
//             ))}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// );

// const FAQS = [
//   ["Can Foreigners Buy Property in Dubai?", "Yes. Foreign nationals can purchase freehold properties in designated areas of Dubai, subject to applicable ownership regulations."],
//   ["Which Property Type Is Suitable for First-Time Buyers?", "Apartments may be a suitable starting point for many first-time buyers because they are available in different sizes and configurations. The right choice depends on budget and personal requirements."],
//   ["Is Buying an Off-Plan Property a Good Option?", "Off-plan properties may offer different payment arrangements and access to new developments. However, buyers should carefully check the developer, project registration, construction progress, and delivery conditions."],
//   ["What Additional Expenses Should Buyers Consider?", "Additional expenses may include registration fees, agency commission, mortgage charges, service charges, maintenance, insurance, and other transaction-related costs."],
//   ["Can International Investors Rent Out Their Dubai Properties?", "Yes. Owners can generally rent out eligible properties, subject to applicable regulations, registration requirements, and community rules."],
//   ["What Should Buyers Check Before Investing in Dubai?", "Buyers should evaluate the location, property price, rental demand, developer reputation, documentation, service charges, and future development plans."],
//   ["How Can Buyers Choose Between Different Dubai Locations?", "Compare neighbourhoods based on your budget, daily travel requirements, nearby facilities, preferred lifestyle, and intended property use."],
// ];

// const formatDate = (d: string) =>
//   new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

// // Page: /blog/what-should-you-know-before-buying-property-in-dubai
// const BlogPostPage = () => {
//   useEffect(() => {
//     window.scrollTo(0, 0);
//     const oldTitle = document.title;
//     document.title = `${POST.title} | Sippy Housing`;
//     let meta = document.querySelector('meta[name="description"]');
//     if (!meta) {
//       meta = document.createElement("meta");
//       meta.setAttribute("name", "description");
//       document.head.appendChild(meta);
//     }
//     meta.setAttribute("content", POST.excerpt);
//     return () => { document.title = oldTitle; };
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
//       <main className="container mx-auto px-4 py-8 mt-20">
//         <article className="mx-auto max-w-3xl">
//           <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500" aria-label="Breadcrumb">
//             <Link to="/" className="hover:text-sippy-gold">Home</Link> <span>›</span>
//             <Link to="/blog" className="hover:text-sippy-gold">Blog</Link> <span>›</span>
//             <span className="text-gray-700">{POST.title}</span>
//           </nav>

//           <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-sippy-gold">{POST.category}</p>
//           <h1 className="mb-4 text-3xl font-bold leading-tight text-sippy-charcoal md:text-4xl">{POST.title}</h1>
//           <p className="mb-5 text-lg italic text-gray-600">{POST.excerpt}</p>

//           <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
//             <span className="inline-flex items-center gap-1"><User className="h-4 w-4" />{POST.author}</span>
//             <span className="inline-flex items-center gap-1"><Calendar className="h-4 w-4" />{formatDate(POST.published_at)}</span>
//             <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" />{POST.read_time} min read</span>
//           </div>

//           {/* IMAGE right after the top description */}
//           <img
//             src={POST.image}
//             alt="Property in Dubai: Complete Guide for Buyers & Investors (2026)"
//             className="mb-8 w-full rounded-xl object-cover shadow"
//           />

//           <div className="space-y-5 text-lg leading-relaxed text-gray-700">
//             <H2>Introduction</H2>
//             <p>Dubai has become a popular destination for international property buyers and real estate investors. Its modern infrastructure, business opportunities, premium residential communities, and international connectivity attract people looking to purchase homes or explore investment opportunities.</p>
//             <p>However, buying real estate in another country requires proper research and financial planning. Buyers need to understand ownership regulations, property types, payment plans, additional costs, rental demand, and legal requirements before making a decision.</p>
//             <p>This Dubai property guide explains the important factors to consider when exploring the Dubai real estate market in 2026. Whether you are a first-time buyer, an experienced investor, or someone planning to purchase a second home, understanding these details can help you make a more informed decision.</p>

//             <H2>Key Factors to Understand About Dubai's Real Estate Market</H2>
//             <p>Before exploring individual properties, buyers should understand the factors that influence the real estate market. Some important considerations include:</p>
//             <UL items={[
//               "International buyers can explore different residential and commercial property options.",
//               "Apartments, villas, townhouses, and commercial spaces offer different ownership opportunities.",
//               "Off-plan developments may provide payment structures that differ from completed properties.",
//               "Location, infrastructure, and rental demand influence property investment decisions.",
//               "Legal verification and additional ownership costs are important parts of the buying process.",
//             ]} />
//             <div className="rounded-lg border-l-4 border-sippy-gold bg-white p-4 shadow-sm">
//               <p><strong className="text-sippy-charcoal">Quick Insight:</strong> A property investment should not be based only on attractive photographs or promotional offers. Buyers should compare property prices, location, developer records, available facilities, and potential ownership expenses.</p>
//             </div>

//             {/* 1 */}
//             <H2>1. Why Is Dubai a Popular Destination for Property Buyers?</H2>
//             <p>Dubai offers several features that attract residential buyers and international investors.</p>
//             <H3>Growing Business Environment</H3>
//             <p>Dubai is an established centre for international trade, finance, tourism, and business activities. Its business environment attracts professionals, entrepreneurs, and companies from different countries.</p>
//             <H3>Modern Infrastructure</H3>
//             <p>The city offers developed road networks, public transportation, educational institutions, healthcare facilities, shopping centres, and entertainment destinations. These facilities contribute to the overall residential experience.</p>
//             <H3>International Connectivity</H3>
//             <p>Dubai's international airport and transport infrastructure make it convenient for residents, business owners, and international property investors.</p>
//             <H3>Different Property Options</H3>
//             <p>Buyers can explore studio apartments, family homes, luxury villas, townhouses, and commercial spaces according to their financial requirements.</p>
//             <H3>Investment Opportunities</H3>
//             <p>Different residential communities provide opportunities for long-term ownership and rental income. However, investment performance depends on the purchase price, location, expenses, rental demand, and wider market conditions. No property should be considered a guaranteed source of returns.</p>

//             {/* 2 */}
//             <H2>2. Different Types of Properties Available in Dubai</H2>
//             <p>Before purchasing a property, buyers should understand the major property categories available in the market.</p>
//             <Table
//               head={["Property Type", "Suitable For", "Important Factors to Check"]}
//               rows={[
//                 ["Apartments", "Individuals, couples, and families", "Size, facilities, service charges"],
//                 ["Luxury Villas", "Families looking for larger homes", "Location, maintenance, privacy"],
//                 ["Townhouses", "Families interested in community living", "Layout, shared facilities, connectivity"],
//                 ["Commercial Properties", "Business owners and investors", "Tenant demand, lease terms, business location"],
//               ]}
//             />
//             <H3>Apartments</H3>
//             <p>Apartments are available in different configurations, including studios, one-bedroom, two-bedroom, and larger units. They may suit individuals, couples, and families looking for residential properties with different facilities.</p>
//             <H3>Luxury Villas</H3>
//             <p>Villas offer private living spaces, multiple bedrooms, and additional outdoor areas. They are often considered by families looking for larger homes and greater privacy.</p>
//             <H3>Townhouses</H3>
//             <p>Townhouses combine features of apartment-style community living and independent residential homes. Many developments include shared facilities, landscaped areas, and recreational spaces.</p>
//             <H3>Commercial Properties</H3>
//             <p>Commercial properties include offices, retail spaces, and business premises. Investors should evaluate business activity, location, tenant requirements, and lease conditions before purchasing.</p>

//             {/* 3 */}
//             <H2>3. Popular Locations to Explore in Dubai</H2>
//             <p>Location plays an important role in property selection. Different areas offer different residential experiences, facilities, and investment considerations.</p>
//             <Table
//               head={["Location", "Key Features"]}
//               rows={[
//                 ["Downtown Dubai", "Central location, premium developments, shopping, and business access"],
//                 ["Dubai Marina", "Waterfront lifestyle, residential towers, restaurants, and entertainment"],
//                 ["Business Bay", "Commercial activity and residential developments"],
//                 ["Jumeirah Village Circle", "Apartments and townhouses in a residential community"],
//                 ["Dubai Hills Estate", "Planned community, green spaces, and lifestyle facilities"],
//               ]}
//             />
//             <H3>How to Choose the Right Location</H3>
//             <p>When comparing properties in Dubai, buyers should consider more than just the neighbourhood's popularity. Important factors include:</p>
//             <UL items={[
//               "Distance from workplaces and business areas.",
//               "Access to schools, hospitals, and daily facilities.",
//               "Public transportation and road connectivity.",
//               "Available amenities and community facilities.",
//               "Purchase budget and potential rental demand.",
//             ]} />
//             <p>The right location depends on personal requirements, financial capacity, and intended property use.</p>

//             {/* 4 */}
//             <H2>4. Off-Plan vs Ready Properties: Which Option Is Better?</H2>
//             <p>One important decision for buyers is whether to purchase an off-plan property or an already completed home.</p>
//             <Table
//               head={["Comparison", "Off-Plan Property", "Ready Property"]}
//               rows={[
//                 ["Construction", "Under development", "Completed"],
//                 ["Possession", "After construction and handover", "Usually available sooner"],
//                 ["Payment", "Developer-specific payment plans", "Based on purchase agreement"],
//                 ["Inspection", "Plans and specifications", "Physical inspection"],
//                 ["Rental Income", "Generally after completion", "Potentially available sooner"],
//                 ["Main Risk", "Construction and delivery delays", "Property condition and existing costs"],
//               ]}
//             />
//             <H3>Benefits and Considerations of Off-Plan Properties</H3>
//             <p>Some off-plan developments provide payment arrangements that differ from completed properties. However, buyers should verify the developer's reputation, project registration, escrow arrangements, payment schedule, and expected completion date.</p>
//             <H3>Benefits and Considerations of Ready Properties</H3>
//             <p>Ready properties allow buyers to inspect the actual unit, building facilities, and surrounding area before purchasing. Rental opportunities may also be available sooner, depending on the property's condition and applicable requirements.</p>
//             <p>The right option depends on the buyer's budget, financial planning, investment goals, risk tolerance, and preferred possession timeline.</p>

//             {/* 5 */}
//             <H2>5. Additional Costs Involved in Buying Property</H2>
//             <p>Is the listed property price the only amount buyers need to pay? No. Several additional expenses can influence the overall purchase budget. These may include:</p>
//             <UL items={[
//               "Dubai Land Department registration fees.",
//               "Real estate agency commission, where applicable.",
//               "Mortgage processing and valuation charges.",
//               "Property service charges.",
//               "Maintenance and repair expenses.",
//               "Insurance and utility costs.",
//               "Property management expenses for rented units.",
//             ]} />
//             <H3>How to Prepare a Realistic Property Budget</H3>
//             <p>Buyers should calculate the complete purchase and ownership budget before signing an agreement.</p>
//             <div className="rounded-lg bg-sippy-charcoal p-4 text-center font-semibold text-white">
//               Total Property Budget = Property Price + Registration Charges + Transaction Costs + Maintenance Reserve + Other Applicable Expenses
//             </div>
//             <p>Request a detailed cost breakdown from relevant professionals before completing the transaction. Registration and other charges should be verified through the appropriate authorities because applicable fees may vary.</p>

//             {/* 6 */}
//             <H2>6. Legal Requirements for International Property Buyers</H2>
//             <p>International buyers can purchase freehold properties in designated areas of Dubai, subject to applicable regulations. Before completing a transaction, buyers should:</p>
//             <UL items={[
//               "Confirm that the property is in an approved ownership area.",
//               "Verify the seller's ownership documents.",
//               "Review the sale and purchase agreement.",
//               "Check the project's registration and approvals.",
//               "Understand the payment schedule and transfer conditions.",
//               "Complete the required registration through authorised channels.",
//             ]} />
//             <p>The Dubai Land Department is responsible for registering and documenting real estate transactions. Buyers should ensure that the transaction is properly registered to protect their ownership rights.</p>

//             {/* 7 */}
//             <H2>7. Important Factors to Evaluate Before Investing</H2>
//             <p>A property purchase should be based on proper research rather than promotional offers alone.</p>
//             <UL items={[
//               <><strong>Location:</strong> Evaluate transport facilities, schools, hospitals, workplaces, and nearby amenities.</>,
//               <><strong>Developer Reputation:</strong> Review previous projects, construction quality, delivery history, and project approvals.</>,
//               <><strong>Rental Demand:</strong> Research the area's tenant profile, rental activity, and competition from similar properties.</>,
//               <><strong>Property Condition:</strong> Inspect the unit, building facilities, maintenance requirements, and available documentation.</>,
//               <><strong>Service Charges:</strong> Compare annual maintenance and service expenses because these affect ownership costs.</>,
//               <><strong>Future Development:</strong> Understand planned infrastructure and upcoming projects that could influence local property supply and demand.</>,
//             ]} />
//             <H3>Calculating Potential Rental Income</H3>
//             <p>Investors should not consider only the expected monthly rent. They should also account for vacancy periods, maintenance, service charges, property management, and other expenses.</p>
//             <p>A realistic calculation provides a clearer understanding of the property's potential financial performance.</p>

//             {/* 8 */}
//             <H2>8. Steps to Follow Before Purchasing a Property</H2>
//             <p>A structured buying process can help reduce confusion and support better decisions.</p>
//             <Table
//               head={["Step", "What Should You Do?"]}
//               rows={[
//                 ["1. Define Your Purpose", "Decide whether the property is for personal use, rental income, relocation, or long-term investment."],
//                 ["2. Set Your Budget", "Include the property price, registration charges, additional expenses, and an emergency reserve."],
//                 ["3. Research Locations", "Compare communities based on facilities, connectivity, and your requirements."],
//                 ["4. Shortlist Properties", "Evaluate multiple options instead of relying only on photographs or advertisements."],
//                 ["5. Verify Documents", "Check ownership details, project approvals, agreements, and payment schedules."],
//                 ["6. Complete the Purchase", "Follow the official transaction and registration process with authorised professionals."],
//               ]}
//             />
//             <H3>Buyer's Checklist</H3>
//             <ul className="space-y-2">
//               {[
//                 "Have you finalised your purchase budget?",
//                 "Have you compared different locations?",
//                 "Have you checked the developer's background?",
//                 "Have you reviewed all additional expenses?",
//                 "Have you verified ownership documents?",
//                 "Have you understood the payment and transfer conditions?",
//               ].map((t) => (
//                 <li key={t} className="flex items-start gap-2"><span className="text-sippy-gold">✔</span><span>{t}</span></li>
//               ))}
//             </ul>

//             {/* 9 */}
//             <H2>9. Exploring Real Estate Opportunities with Sippy Housing</H2>
//             <p>Along with researching international opportunities, buyers may also explore residential and investment options available in India. Comparing different real estate markets can help buyers understand property quality, location, documentation, and financial planning.</p>
//             <p>Sippy Housing offers real estate services and property opportunities across Mumbai and beyond. Its property-related expertise covers luxury homes, residential and commercial properties, redevelopment, joint ventures, and investment opportunities.</p>
//             <p>Buyers interested in reviewing selected property options can also visit the <Link to="/favorites" className="text-sippy-gold underline">property favourites section</Link> to keep track of their preferred choices.</p>
//             <p>Exploring different property markets helps buyers understand the importance of location, property facilities, documentation, and long-term financial planning before making a real estate decision.</p>

//             <H2>Methodology and Limitations</H2>
//             <p>This guide provides a general overview of property buying considerations in Dubai for 2026. It covers ownership regulations, property categories, popular locations, additional expenses, and investment evaluation factors.</p>
//             <p>The information is intended for educational purposes. Property prices, rental demand, regulations, and transaction charges can change over time. Buyers should verify current details through the Dubai Land Department, relevant government authorities, developers, and qualified real estate professionals before making a purchase.</p>

//             <H2>Frequently Asked Questions (FAQs)</H2>
//             <div className="space-y-3">
//               {FAQS.map(([q, a], i) => (
//                 <details key={q} className="group rounded-lg border bg-white p-4">
//                   <summary className="cursor-pointer font-semibold text-sippy-charcoal">{i + 1}. {q}</summary>
//                   <p className="mt-2 text-base">{a}</p>
//                 </details>
//               ))}
//             </div>

//             <H2>Conclusion</H2>
//             <p>Dubai offers a wide range of residential and commercial property opportunities for international buyers and investors. However, selecting the right property requires proper research, financial planning, and an understanding of the legal process.</p>
//             <p>Buyers should compare different locations, understand ownership regulations, review additional expenses, and verify all relevant documents before completing a transaction.</p>
//             <p>Ultimately, a well-planned property in Dubai purchase should match the buyer's financial capacity, intended use, and long-term objectives. By focusing on property quality, location, ownership costs, and realistic investment expectations, buyers can make more informed decisions in the real estate market.</p>
//           </div>

//           <div className="mt-8 flex flex-wrap gap-2">
//             {POST.tags.map((t) => (
//               <span key={t} className="rounded-full border bg-white px-3 py-1 text-sm text-gray-600">{t}</span>
//             ))}
//           </div>

//           <div className="mt-10 rounded-xl bg-white p-6 text-center shadow">
//             <p className="mb-3 font-semibold text-sippy-charcoal">Looking for your next property?</p>
//             <Link to="/" className="inline-block rounded-lg bg-sippy-gold px-6 py-2 font-semibold text-white hover:bg-sippy-gold/90">Explore properties</Link>
//           </div>

//           <Link to="/blog" className="mt-8 inline-flex items-center text-sippy-gold hover:text-sippy-charcoal">
//             <ArrowLeft className="mr-2 h-4 w-4" /> Back to all blogs
//           </Link>
//         </article>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default BlogPostPage;

// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";

// /* ------------------------------------------------------------------ */
// /*  STATIC BLOG DATA (no Supabase)                                     */
// /*  Put the image at:  public/images/blog/dubai-property-guide.png     */
// /* ------------------------------------------------------------------ */
// const POST = {
//   slug: "what-should-you-know-before-buying-property-in-dubai",
//   title: "What Should You Know Before Buying Property in Dubai? Complete Guide for Buyers & Investors (2026)",
//   category: "Dubai Real Estate",
//   author: "Sippy Housing",
//   published_at: "2026-11-02",
//   read_time: 9,
//   image: "/public/dubai-property-guide.png",
//   tags: ["Dubai Property", "Property Investment", "Off-Plan", "Buyer Guide", "2026"],
//   excerpt:
//     "Dubai has become a popular destination for international property buyers and real estate investors. Its modern infrastructure, business opportunities, premium residential communities, and international connectivity attract people looking to purchase homes or explore investment opportunities.",
// };

// // ---------- small reusable pieces ----------
// const slugify = (t: string) =>
//   t.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// const H2 = ({ children }: { children: string }) => (
//   <h2 id={slugify(children)} className="scroll-mt-28 pt-6 text-2xl font-bold text-sippy-charcoal">{children}</h2>
// );
// const H3 = ({ children }: { children: string }) => (
//   <h3 id={slugify(children)} className="scroll-mt-28 pt-2 text-xl font-bold text-sippy-charcoal">{children}</h3>
// );
// const UL = ({ items }: { items: React.ReactNode[] }) => (
//   <ul className="list-disc space-y-1 pl-6">
//     {items.map((t, i) => <li key={i}>{t}</li>)}
//   </ul>
// );
// const Table = ({ head, rows }: { head: string[]; rows: string[][] }) => (
//   <div className="overflow-x-auto rounded-lg border bg-white">
//     <table className="w-full text-left text-base">
//       <thead className="bg-sippy-charcoal text-white">
//         <tr>{head.map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr>
//       </thead>
//       <tbody>
//         {rows.map((r, i) => (
//           <tr key={i} className="border-t">
//             {r.map((c, j) => (
//               <td key={j} className={`px-4 py-3 align-top ${j === 0 ? "font-semibold text-sippy-charcoal" : ""}`}>{c}</td>
//             ))}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// );


// // Table of contents (labels must match the <H2> / <H3> text exactly)
// const TOC: { label: string; sub?: boolean }[] = [
//   { label: "Introduction" },
//   { label: "Key Factors to Understand About Dubai's Real Estate Market" },
//   { label: "1. Why Is Dubai a Popular Destination for Property Buyers?" },
//   { label: "2. Different Types of Properties Available in Dubai" },
//   { label: "3. Popular Locations to Explore in Dubai" },
//   { label: "4. Off-Plan vs Ready Properties: Which Option Is Better?" },
//   { label: "5. Additional Costs Involved in Buying Property" },
//   { label: "6. Legal Requirements for International Property Buyers" },
//   { label: "7. Important Factors to Evaluate Before Investing" },
//   { label: "8. Steps to Follow Before Purchasing a Property" },
//   { label: "Buyer's Checklist", sub: true },
//   { label: "9. Exploring Real Estate Opportunities with Sippy Housing" },
//   { label: "Methodology and Limitations" },
//   { label: "Frequently Asked Questions (FAQs)" },
//   { label: "Conclusion" },
// ];

// const TableOfContents = () => {
//   const [active, setActive] = useState(slugify(TOC[0].label));

//   useEffect(() => {
//     const els = TOC.map((t) => document.getElementById(slugify(t.label))).filter(Boolean) as HTMLElement[];
//     const obs = new IntersectionObserver(
//       (entries) => {
//         const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
//         if (visible[0]) setActive(visible[0].target.id);
//       },
//       { rootMargin: "-100px 0px -65% 0px" }
//     );
//     els.forEach((el) => obs.observe(el));
//     return () => obs.disconnect();
//   }, []);

//   const go = (id: string) => (e: React.MouseEvent) => {
//     e.preventDefault();
//     document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
//     setActive(id);
//   };

//   return (
//     <nav aria-label="Table of contents" className="sticky top-28">
//       <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-500">Table of Contents</p>
//       <ul className="max-h-[calc(100vh-10rem)] space-y-1 overflow-y-auto border-l border-gray-200 pr-2">
//         {TOC.map((t) => {
//           const id = slugify(t.label);
//           const on = active === id;
//           return (
//             <li key={id}>
//               <a
//                 href={`#${id}`}
//                 onClick={go(id)}
//                 className={`block py-1.5 pr-1 text-sm leading-snug transition-colors ${t.sub ? "pl-8" : "pl-4"} ${
//                   on ? "-ml-px border-l-2 border-sippy-gold font-semibold text-sippy-charcoal" : "text-gray-500 hover:text-sippy-charcoal"
//                 }`}
//               >
//                 {t.label}
//               </a>
//             </li>
//           );
//         })}
//       </ul>
//     </nav>
//   );
// };

// const FAQS = [
//   ["Can Foreigners Buy Property in Dubai?", "Yes. Foreign nationals can purchase freehold properties in designated areas of Dubai, subject to applicable ownership regulations."],
//   ["Which Property Type Is Suitable for First-Time Buyers?", "Apartments may be a suitable starting point for many first-time buyers because they are available in different sizes and configurations. The right choice depends on budget and personal requirements."],
//   ["Is Buying an Off-Plan Property a Good Option?", "Off-plan properties may offer different payment arrangements and access to new developments. However, buyers should carefully check the developer, project registration, construction progress, and delivery conditions."],
//   ["What Additional Expenses Should Buyers Consider?", "Additional expenses may include registration fees, agency commission, mortgage charges, service charges, maintenance, insurance, and other transaction-related costs."],
//   ["Can International Investors Rent Out Their Dubai Properties?", "Yes. Owners can generally rent out eligible properties, subject to applicable regulations, registration requirements, and community rules."],
//   ["What Should Buyers Check Before Investing in Dubai?", "Buyers should evaluate the location, property price, rental demand, developer reputation, documentation, service charges, and future development plans."],
//   ["How Can Buyers Choose Between Different Dubai Locations?", "Compare neighbourhoods based on your budget, daily travel requirements, nearby facilities, preferred lifestyle, and intended property use."],
// ];

// const formatDate = (d: string) =>
//   new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

// // Page: /blog/what-should-you-know-before-buying-property-in-dubai
// const BlogPostPage = () => {
//   useEffect(() => {
//     window.scrollTo(0, 0);
//     const oldTitle = document.title;
//     document.title = `${POST.title} | Sippy Housing`;
//     let meta = document.querySelector('meta[name="description"]');
//     if (!meta) {
//       meta = document.createElement("meta");
//       meta.setAttribute("name", "description");
//       document.head.appendChild(meta);
//     }
//     meta.setAttribute("content", POST.excerpt);
//     return () => { document.title = oldTitle; };
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
//       <main className="mx-auto mt-20 w-full max-w-[1400px] px-4 py-8 md:px-6 lg:px-8">
//         <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
//         <article className="min-w-0">
//           <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500" aria-label="Breadcrumb">
//             <Link to="/" className="hover:text-sippy-gold">Home</Link> <span>›</span>
//             <Link to="/blog" className="hover:text-sippy-gold">Blog</Link> <span>›</span>
//             <span className="text-gray-700">{POST.title}</span>
//           </nav>

//           <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-sippy-gold">{POST.category}</p>
//           <h1 className="mb-4 text-3xl font-bold leading-tight text-sippy-charcoal md:text-4xl">{POST.title}</h1>
//           <p className="mb-5 text-lg italic text-gray-600">{POST.excerpt}</p>

//           <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
//             <span className="inline-flex items-center gap-1"><User className="h-4 w-4" />{POST.author}</span>
//             <span className="inline-flex items-center gap-1"><Calendar className="h-4 w-4" />{formatDate(POST.published_at)}</span>
//             <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" />{POST.read_time} min read</span>
//           </div>

//           {/* IMAGE right after the top description */}
//           <img
//             src={POST.image}
//             alt="Property in Dubai: Complete Guide for Buyers & Investors (2026)"
//             className="mb-8 w-full rounded-xl object-cover shadow"
//           />

//           <div className="space-y-5 text-lg leading-relaxed text-gray-700">
//             <H2>Introduction</H2>
//             <p>Dubai has become a popular destination for international property buyers and real estate investors. Its modern infrastructure, business opportunities, premium residential communities, and international connectivity attract people looking to purchase homes or explore investment opportunities.</p>
//             <p>However, buying real estate in another country requires proper research and financial planning. Buyers need to understand ownership regulations, property types, payment plans, additional costs, rental demand, and legal requirements before making a decision.</p>
//             <p>This Dubai property guide explains the important factors to consider when exploring the Dubai real estate market in 2026. Whether you are a first-time buyer, an experienced investor, or someone planning to purchase a second home, understanding these details can help you make a more informed decision.</p>

//             <H2>Key Factors to Understand About Dubai's Real Estate Market</H2>
//             <p>Before exploring individual properties, buyers should understand the factors that influence the real estate market. Some important considerations include:</p>
//             <UL items={[
//               "International buyers can explore different residential and commercial property options.",
//               "Apartments, villas, townhouses, and commercial spaces offer different ownership opportunities.",
//               "Off-plan developments may provide payment structures that differ from completed properties.",
//               "Location, infrastructure, and rental demand influence property investment decisions.",
//               "Legal verification and additional ownership costs are important parts of the buying process.",
//             ]} />
//             <div className="rounded-lg border-l-4 border-sippy-gold bg-white p-4 shadow-sm">
//               <p><strong className="text-sippy-charcoal">Quick Insight:</strong> A property investment should not be based only on attractive photographs or promotional offers. Buyers should compare property prices, location, developer records, available facilities, and potential ownership expenses.</p>
//             </div>

//             {/* 1 */}
//             <H2>1. Why Is Dubai a Popular Destination for Property Buyers?</H2>
//             <p>Dubai offers several features that attract residential buyers and international investors.</p>
//             <H3>Growing Business Environment</H3>
//             <p>Dubai is an established centre for international trade, finance, tourism, and business activities. Its business environment attracts professionals, entrepreneurs, and companies from different countries.</p>
//             <H3>Modern Infrastructure</H3>
//             <p>The city offers developed road networks, public transportation, educational institutions, healthcare facilities, shopping centres, and entertainment destinations. These facilities contribute to the overall residential experience.</p>
//             <H3>International Connectivity</H3>
//             <p>Dubai's international airport and transport infrastructure make it convenient for residents, business owners, and international property investors.</p>
//             <H3>Different Property Options</H3>
//             <p>Buyers can explore studio apartments, family homes, luxury villas, townhouses, and commercial spaces according to their financial requirements.</p>
//             <H3>Investment Opportunities</H3>
//             <p>Different residential communities provide opportunities for long-term ownership and rental income. However, investment performance depends on the purchase price, location, expenses, rental demand, and wider market conditions. No property should be considered a guaranteed source of returns.</p>

//             {/* 2 */}
//             <H2>2. Different Types of Properties Available in Dubai</H2>
//             <p>Before purchasing a property, buyers should understand the major property categories available in the market.</p>
//             <Table
//               head={["Property Type", "Suitable For", "Important Factors to Check"]}
//               rows={[
//                 ["Apartments", "Individuals, couples, and families", "Size, facilities, service charges"],
//                 ["Luxury Villas", "Families looking for larger homes", "Location, maintenance, privacy"],
//                 ["Townhouses", "Families interested in community living", "Layout, shared facilities, connectivity"],
//                 ["Commercial Properties", "Business owners and investors", "Tenant demand, lease terms, business location"],
//               ]}
//             />
//             <H3>Apartments</H3>
//             <p>Apartments are available in different configurations, including studios, one-bedroom, two-bedroom, and larger units. They may suit individuals, couples, and families looking for residential properties with different facilities.</p>
//             <H3>Luxury Villas</H3>
//             <p>Villas offer private living spaces, multiple bedrooms, and additional outdoor areas. They are often considered by families looking for larger homes and greater privacy.</p>
//             <H3>Townhouses</H3>
//             <p>Townhouses combine features of apartment-style community living and independent residential homes. Many developments include shared facilities, landscaped areas, and recreational spaces.</p>
//             <H3>Commercial Properties</H3>
//             <p>Commercial properties include offices, retail spaces, and business premises. Investors should evaluate business activity, location, tenant requirements, and lease conditions before purchasing.</p>

//             {/* 3 */}
//             <H2>3. Popular Locations to Explore in Dubai</H2>
//             <p>Location plays an important role in property selection. Different areas offer different residential experiences, facilities, and investment considerations.</p>
//             <Table
//               head={["Location", "Key Features"]}
//               rows={[
//                 ["Downtown Dubai", "Central location, premium developments, shopping, and business access"],
//                 ["Dubai Marina", "Waterfront lifestyle, residential towers, restaurants, and entertainment"],
//                 ["Business Bay", "Commercial activity and residential developments"],
//                 ["Jumeirah Village Circle", "Apartments and townhouses in a residential community"],
//                 ["Dubai Hills Estate", "Planned community, green spaces, and lifestyle facilities"],
//               ]}
//             />
//             <H3>How to Choose the Right Location</H3>
//             <p>When comparing properties in Dubai, buyers should consider more than just the neighbourhood's popularity. Important factors include:</p>
//             <UL items={[
//               "Distance from workplaces and business areas.",
//               "Access to schools, hospitals, and daily facilities.",
//               "Public transportation and road connectivity.",
//               "Available amenities and community facilities.",
//               "Purchase budget and potential rental demand.",
//             ]} />
//             <p>The right location depends on personal requirements, financial capacity, and intended property use.</p>

//             {/* 4 */}
//             <H2>4. Off-Plan vs Ready Properties: Which Option Is Better?</H2>
//             <p>One important decision for buyers is whether to purchase an off-plan property or an already completed home.</p>
//             <Table
//               head={["Comparison", "Off-Plan Property", "Ready Property"]}
//               rows={[
//                 ["Construction", "Under development", "Completed"],
//                 ["Possession", "After construction and handover", "Usually available sooner"],
//                 ["Payment", "Developer-specific payment plans", "Based on purchase agreement"],
//                 ["Inspection", "Plans and specifications", "Physical inspection"],
//                 ["Rental Income", "Generally after completion", "Potentially available sooner"],
//                 ["Main Risk", "Construction and delivery delays", "Property condition and existing costs"],
//               ]}
//             />
//             <H3>Benefits and Considerations of Off-Plan Properties</H3>
//             <p>Some off-plan developments provide payment arrangements that differ from completed properties. However, buyers should verify the developer's reputation, project registration, escrow arrangements, payment schedule, and expected completion date.</p>
//             <H3>Benefits and Considerations of Ready Properties</H3>
//             <p>Ready properties allow buyers to inspect the actual unit, building facilities, and surrounding area before purchasing. Rental opportunities may also be available sooner, depending on the property's condition and applicable requirements.</p>
//             <p>The right option depends on the buyer's budget, financial planning, investment goals, risk tolerance, and preferred possession timeline.</p>

//             {/* 5 */}
//             <H2>5. Additional Costs Involved in Buying Property</H2>
//             <p>Is the listed property price the only amount buyers need to pay? No. Several additional expenses can influence the overall purchase budget. These may include:</p>
//             <UL items={[
//               "Dubai Land Department registration fees.",
//               "Real estate agency commission, where applicable.",
//               "Mortgage processing and valuation charges.",
//               "Property service charges.",
//               "Maintenance and repair expenses.",
//               "Insurance and utility costs.",
//               "Property management expenses for rented units.",
//             ]} />
//             <H3>How to Prepare a Realistic Property Budget</H3>
//             <p>Buyers should calculate the complete purchase and ownership budget before signing an agreement.</p>
//             <div className="rounded-lg bg-sippy-charcoal p-4 text-center font-semibold text-white">
//               Total Property Budget = Property Price + Registration Charges + Transaction Costs + Maintenance Reserve + Other Applicable Expenses
//             </div>
//             <p>Request a detailed cost breakdown from relevant professionals before completing the transaction. Registration and other charges should be verified through the appropriate authorities because applicable fees may vary.</p>

//             {/* 6 */}
//             <H2>6. Legal Requirements for International Property Buyers</H2>
//             <p>International buyers can purchase freehold properties in designated areas of Dubai, subject to applicable regulations. Before completing a transaction, buyers should:</p>
//             <UL items={[
//               "Confirm that the property is in an approved ownership area.",
//               "Verify the seller's ownership documents.",
//               "Review the sale and purchase agreement.",
//               "Check the project's registration and approvals.",
//               "Understand the payment schedule and transfer conditions.",
//               "Complete the required registration through authorised channels.",
//             ]} />
//             <p>The Dubai Land Department is responsible for registering and documenting real estate transactions. Buyers should ensure that the transaction is properly registered to protect their ownership rights.</p>

//             {/* 7 */}
//             <H2>7. Important Factors to Evaluate Before Investing</H2>
//             <p>A property purchase should be based on proper research rather than promotional offers alone.</p>
//             <UL items={[
//               <><strong>Location:</strong> Evaluate transport facilities, schools, hospitals, workplaces, and nearby amenities.</>,
//               <><strong>Developer Reputation:</strong> Review previous projects, construction quality, delivery history, and project approvals.</>,
//               <><strong>Rental Demand:</strong> Research the area's tenant profile, rental activity, and competition from similar properties.</>,
//               <><strong>Property Condition:</strong> Inspect the unit, building facilities, maintenance requirements, and available documentation.</>,
//               <><strong>Service Charges:</strong> Compare annual maintenance and service expenses because these affect ownership costs.</>,
//               <><strong>Future Development:</strong> Understand planned infrastructure and upcoming projects that could influence local property supply and demand.</>,
//             ]} />
//             <H3>Calculating Potential Rental Income</H3>
//             <p>Investors should not consider only the expected monthly rent. They should also account for vacancy periods, maintenance, service charges, property management, and other expenses.</p>
//             <p>A realistic calculation provides a clearer understanding of the property's potential financial performance.</p>

//             {/* 8 */}
//             <H2>8. Steps to Follow Before Purchasing a Property</H2>
//             <p>A structured buying process can help reduce confusion and support better decisions.</p>
//             <Table
//               head={["Step", "What Should You Do?"]}
//               rows={[
//                 ["1. Define Your Purpose", "Decide whether the property is for personal use, rental income, relocation, or long-term investment."],
//                 ["2. Set Your Budget", "Include the property price, registration charges, additional expenses, and an emergency reserve."],
//                 ["3. Research Locations", "Compare communities based on facilities, connectivity, and your requirements."],
//                 ["4. Shortlist Properties", "Evaluate multiple options instead of relying only on photographs or advertisements."],
//                 ["5. Verify Documents", "Check ownership details, project approvals, agreements, and payment schedules."],
//                 ["6. Complete the Purchase", "Follow the official transaction and registration process with authorised professionals."],
//               ]}
//             />
//             <H3>Buyer's Checklist</H3>
//             <ul className="space-y-2">
//               {[
//                 "Have you finalised your purchase budget?",
//                 "Have you compared different locations?",
//                 "Have you checked the developer's background?",
//                 "Have you reviewed all additional expenses?",
//                 "Have you verified ownership documents?",
//                 "Have you understood the payment and transfer conditions?",
//               ].map((t) => (
//                 <li key={t} className="flex items-start gap-2"><span className="text-sippy-gold">✔</span><span>{t}</span></li>
//               ))}
//             </ul>

//             {/* 9 */}
//             <H2>9. Exploring Real Estate Opportunities with Sippy Housing</H2>
//             <p>Along with researching international opportunities, buyers may also explore residential and investment options available in India. Comparing different real estate markets can help buyers understand property quality, location, documentation, and financial planning.</p>
//             <p>Sippy Housing offers real estate services and property opportunities across Mumbai and beyond. Its property-related expertise covers luxury homes, residential and commercial properties, redevelopment, joint ventures, and investment opportunities.</p>
//             <p>Buyers interested in reviewing selected property options can also visit the <Link to="/favorites" className="text-sippy-gold underline">property favourites section</Link> to keep track of their preferred choices.</p>
//             <p>Exploring different property markets helps buyers understand the importance of location, property facilities, documentation, and long-term financial planning before making a real estate decision.</p>

//             <H2>Methodology and Limitations</H2>
//             <p>This guide provides a general overview of property buying considerations in Dubai for 2026. It covers ownership regulations, property categories, popular locations, additional expenses, and investment evaluation factors.</p>
//             <p>The information is intended for educational purposes. Property prices, rental demand, regulations, and transaction charges can change over time. Buyers should verify current details through the Dubai Land Department, relevant government authorities, developers, and qualified real estate professionals before making a purchase.</p>

//             <H2>Frequently Asked Questions (FAQs)</H2>
//             <div className="space-y-3">
//               {FAQS.map(([q, a], i) => (
//                 <details key={q} className="group rounded-lg border bg-white p-4">
//                   <summary className="cursor-pointer font-semibold text-sippy-charcoal">{i + 1}. {q}</summary>
//                   <p className="mt-2 text-base">{a}</p>
//                 </details>
//               ))}
//             </div>

//             <H2>Conclusion</H2>
//             <p>Dubai offers a wide range of residential and commercial property opportunities for international buyers and investors. However, selecting the right property requires proper research, financial planning, and an understanding of the legal process.</p>
//             <p>Buyers should compare different locations, understand ownership regulations, review additional expenses, and verify all relevant documents before completing a transaction.</p>
//             <p>Ultimately, a well-planned property in Dubai purchase should match the buyer's financial capacity, intended use, and long-term objectives. By focusing on property quality, location, ownership costs, and realistic investment expectations, buyers can make more informed decisions in the real estate market.</p>
//           </div>

//           <div className="mt-8 flex flex-wrap gap-2">
//             {POST.tags.map((t) => (
//               <span key={t} className="rounded-full border bg-white px-3 py-1 text-sm text-gray-600">{t}</span>
//             ))}
//           </div>

//           <div className="mt-10 rounded-xl bg-white p-6 text-center shadow">
//             <p className="mb-3 font-semibold text-sippy-charcoal">Looking for your next property?</p>
//             <Link to="/" className="inline-block rounded-lg bg-sippy-gold px-6 py-2 font-semibold text-white hover:bg-sippy-gold/90">Explore properties</Link>
//           </div>

//           <Link to="/blog" className="mt-8 inline-flex items-center text-sippy-gold hover:text-sippy-charcoal">
//             <ArrowLeft className="mr-2 h-4 w-4" /> Back to all blogs
//           </Link>
//         </article>

//         <aside className="hidden lg:block">
//           <TableOfContents />
//         </aside>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default BlogPostPage;



// import { useEffect, useRef, useState } from "react";
// import { Link } from "react-router-dom";
// import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";

// /* ------------------------------------------------------------------ */
// /*  STATIC BLOG DATA (no Supabase)                                     */
// /*  Put the image at:  public/images/blog/dubai-property-guide.png     */
// /* ------------------------------------------------------------------ */
// const POST = {
//   slug: "what-should-you-know-before-buying-property-in-dubai",
//   title: "What Should You Know Before Buying Property in Dubai? Complete Guide for Buyers & Investors (2026)",
//   category: "Dubai Real Estate",
//   author: "Sippy Housing",
//   published_at: "2026-11-02",
//   read_time: 9,
//   image: "/dubai-property-guide.png",
//   tags: ["Dubai Property", "Property Investment", "Off-Plan", "Buyer Guide", "2026"],
//   excerpt:
//     "Dubai has become a popular destination for international property buyers and real estate investors. Its modern infrastructure, business opportunities, premium residential communities, and international connectivity attract people looking to purchase homes or explore investment opportunities.",
// };

// // ---------- small reusable pieces ----------
// const slugify = (t: string) =>
//   t.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// const H2 = ({ children }: { children: string }) => (
//   <h2 id={slugify(children)} className="scroll-mt-28 pt-6 text-2xl font-bold text-sippy-charcoal">{children}</h2>
// );
// const H3 = ({ children }: { children: string }) => (
//   <h3 id={slugify(children)} className="scroll-mt-28 pt-2 text-xl font-bold text-sippy-charcoal">{children}</h3>
// );
// const UL = ({ items }: { items: React.ReactNode[] }) => (
//   <ul className="list-disc space-y-1 pl-6">
//     {items.map((t, i) => <li key={i}>{t}</li>)}
//   </ul>
// );
// const Table = ({ head, rows }: { head: string[]; rows: string[][] }) => (
//   <div className="overflow-x-auto rounded-lg border bg-white">
//     <table className="w-full text-left text-base">
//       <thead className="bg-sippy-charcoal text-white">
//         <tr>{head.map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr>
//       </thead>
//       <tbody>
//         {rows.map((r, i) => (
//           <tr key={i} className="border-t">
//             {r.map((c, j) => (
//               <td key={j} className={`px-4 py-3 align-top ${j === 0 ? "font-semibold text-sippy-charcoal" : ""}`}>{c}</td>
//             ))}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// );

// // Table of contents (labels must match the <H2> / <H3> text exactly)
// const TOC: { label: string; sub?: boolean }[] = [
//   { label: "Introduction" },
//   { label: "Key Factors to Understand About Dubai's Real Estate Market" },
//   { label: "1. Why Is Dubai a Popular Destination for Property Buyers?" },
//   { label: "2. Different Types of Properties Available in Dubai" },
//   { label: "3. Popular Locations to Explore in Dubai" },
//   { label: "4. Off-Plan vs Ready Properties: Which Option Is Better?" },
//   { label: "5. Additional Costs Involved in Buying Property" },
//   { label: "6. Legal Requirements for International Property Buyers" },
//   { label: "7. Important Factors to Evaluate Before Investing" },
//   { label: "8. Steps to Follow Before Purchasing a Property" },
//   { label: "Buyer's Checklist", sub: true },
//   { label: "9. Exploring Real Estate Opportunities with Sippy Housing" },
//   { label: "Methodology and Limitations" },
//   { label: "Frequently Asked Questions (FAQs)" },
//   { label: "Conclusion" },
// ];

// const TableOfContents = () => {
//   const [active, setActive] = useState(slugify(TOC[0].label));
//   const holderRef = useRef<HTMLDivElement>(null);
//   const navRef = useRef<HTMLElement>(null);

//   // Keeps the table of contents on screen while scrolling.
//   // Uses position:fixed (not CSS sticky) so it still works if a parent has overflow hidden.
//   useEffect(() => {
//     const TOP = 112; // distance from top of screen (below navbar)
//     const update = () => {
//       const holder = holderRef.current, nav = navRef.current;
//       if (!holder || !nav) return;
//       const r = holder.getBoundingClientRect();
//       if (r.top >= TOP) {
//         nav.style.position = "static";
//         nav.style.width = "auto";
//         return;
//       }
//       nav.style.position = "fixed";
//       nav.style.left = `${r.left}px`;
//       nav.style.width = `${r.width}px`;
//       nav.style.top = `${Math.min(TOP, r.bottom - nav.offsetHeight)}px`; // stop at end of article
//     };
//     update();
//     window.addEventListener("scroll", update, { passive: true });
//     window.addEventListener("resize", update);
//     return () => {
//       window.removeEventListener("scroll", update);
//       window.removeEventListener("resize", update);
//     };
//   }, []);

//   useEffect(() => {
//     const els = TOC.map((t) => document.getElementById(slugify(t.label))).filter(Boolean) as HTMLElement[];
//     const obs = new IntersectionObserver(
//       (entries) => {
//         const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
//         if (visible[0]) setActive(visible[0].target.id);
//       },
//       { rootMargin: "-100px 0px -65% 0px" }
//     );
//     els.forEach((el) => obs.observe(el));
//     return () => obs.disconnect();
//   }, []);

//   const go = (id: string) => (e: React.MouseEvent) => {
//     e.preventDefault();
//     document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
//     setActive(id);
//   };

//   return (
//     <div ref={holderRef} className="h-full">
//     <nav ref={navRef} aria-label="Table of contents">
//       <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-500">Table of Contents</p>
//       <ul className="max-h-[calc(100vh-10rem)] space-y-1 overflow-y-auto border-l border-gray-200 pr-2">
//         {TOC.map((t) => {
//           const id = slugify(t.label);
//           const on = active === id;
//           return (
//             <li key={id}>
//               <a
//                 href={`#${id}`}
//                 onClick={go(id)}
//                 className={`block py-1.5 pr-1 text-sm leading-snug transition-colors ${t.sub ? "pl-8" : "pl-4"} ${
//                   on ? "-ml-px border-l-2 border-sippy-gold font-semibold text-sippy-charcoal" : "text-gray-500 hover:text-sippy-charcoal"
//                 }`}
//               >
//                 {t.label}
//               </a>
//             </li>
//           );
//         })}
//       </ul>
//     </nav>
//     </div>
//   );
// };

// // Stacked version for phones/tablets: sits above the article text, collapsible
// const MobileTableOfContents = () => (
//   <details className="mb-8 rounded-lg border bg-white p-4 lg:hidden">
//     <summary className="cursor-pointer text-sm font-semibold uppercase tracking-widest text-gray-600">Table of Contents</summary>
//     <ul className="mt-3 space-y-1 border-l border-gray-200">
//       {TOC.map((t) => {
//         const id = slugify(t.label);
//         return (
//           <li key={id}>
//             <a
//               href={`#${id}`}
//               onClick={(e) => {
//                 e.preventDefault();
//                 (e.currentTarget.closest("details") as HTMLDetailsElement | null)?.removeAttribute("open");
//                 document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
//               }}
//               className={`block py-1.5 pr-1 text-sm text-gray-600 hover:text-sippy-charcoal ${t.sub ? "pl-8" : "pl-4"}`}
//             >
//               {t.label}
//             </a>
//           </li>
//         );
//       })}
//     </ul>
//   </details>
// );

// const FAQS = [
//   ["Can Foreigners Buy Property in Dubai?", "Yes. Foreign nationals can purchase freehold properties in designated areas of Dubai, subject to applicable ownership regulations."],
//   ["Which Property Type Is Suitable for First-Time Buyers?", "Apartments may be a suitable starting point for many first-time buyers because they are available in different sizes and configurations. The right choice depends on budget and personal requirements."],
//   ["Is Buying an Off-Plan Property a Good Option?", "Off-plan properties may offer different payment arrangements and access to new developments. However, buyers should carefully check the developer, project registration, construction progress, and delivery conditions."],
//   ["What Additional Expenses Should Buyers Consider?", "Additional expenses may include registration fees, agency commission, mortgage charges, service charges, maintenance, insurance, and other transaction-related costs."],
//   ["Can International Investors Rent Out Their Dubai Properties?", "Yes. Owners can generally rent out eligible properties, subject to applicable regulations, registration requirements, and community rules."],
//   ["What Should Buyers Check Before Investing in Dubai?", "Buyers should evaluate the location, property price, rental demand, developer reputation, documentation, service charges, and future development plans."],
//   ["How Can Buyers Choose Between Different Dubai Locations?", "Compare neighbourhoods based on your budget, daily travel requirements, nearby facilities, preferred lifestyle, and intended property use."],
// ];

// const formatDate = (d: string) =>
//   new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

// // Page: /blog/what-should-you-know-before-buying-property-in-dubai
// const BlogPostPage = () => {
//   useEffect(() => {
//     window.scrollTo(0, 0);
//     const oldTitle = document.title;
//     document.title = `${POST.title} | Sippy Housing`;
//     let meta = document.querySelector('meta[name="description"]');
//     if (!meta) {
//       meta = document.createElement("meta");
//       meta.setAttribute("name", "description");
//       document.head.appendChild(meta);
//     }
//     meta.setAttribute("content", POST.excerpt);
//     return () => { document.title = oldTitle; };
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
//       <main className="mx-auto mt-20 w-full max-w-[1400px] px-4 py-8 md:px-6 lg:px-8">
//         <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
//         <article className="min-w-0">
//           <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500" aria-label="Breadcrumb">
//             <Link to="/" className="hover:text-sippy-gold">Home</Link> <span>›</span>
//             <Link to="/blog" className="hover:text-sippy-gold">Blog</Link> <span>›</span>
//             <span className="text-gray-700">{POST.title}</span>
//           </nav>

//           <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-sippy-gold">{POST.category}</p>
//           <h1 className="mb-4 text-3xl font-bold leading-tight text-sippy-charcoal md:text-4xl">{POST.title}</h1>
//           <p className="mb-5 text-lg italic text-gray-600">{POST.excerpt}</p>

//           <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
//             <span className="inline-flex items-center gap-1"><User className="h-4 w-4" />{POST.author}</span>
//             <span className="inline-flex items-center gap-1"><Calendar className="h-4 w-4" />{formatDate(POST.published_at)}</span>
//             <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" />{POST.read_time} min read</span>
//           </div>

//           {/* IMAGE right after the top description */}
//           <img
//             src={POST.image}
//             alt="Property in Dubai: Complete Guide for Buyers & Investors (2026)"
//             className="mb-8 w-full rounded-xl object-cover shadow"
//           />

//           <MobileTableOfContents />

//           <div className="space-y-5 text-lg leading-relaxed text-gray-700">
//             <H2>Introduction</H2>
//             <p>
//               <Link to="/properties" className="text-sippy-gold underline hover:text-sippy-charcoal">Dubai</Link> has become a popular destination for international property buyers and real estate investors. Its modern infrastructure, business opportunities, premium residential communities, and international connectivity attract people looking to purchase homes or explore investment opportunities.
//             </p>
//             <p>However, buying real estate in another country requires proper research and financial planning. Buyers need to understand ownership regulations, property types, payment plans, additional costs, rental demand, and legal requirements before making a decision.</p>
//             <p>
//               This <Link to="/properties" className="text-sippy-gold underline hover:text-sippy-charcoal">Dubai property</Link> guide explains the important factors to consider when exploring the <Link to="/properties" className="text-sippy-gold underline hover:text-sippy-charcoal">Dubai real estate</Link> market in 2026. Whether you are a first-time buyer, an experienced investor, or someone planning to purchase a second home, understanding these details can help you make a more informed decision.
//             </p>

//             <H2>Key Factors to Understand About Dubai's Real Estate Market</H2>
//             <p>Before exploring individual properties, buyers should understand the factors that influence the real estate market. Some important considerations include:</p>
//             <UL items={[
//               "International buyers can explore different residential and commercial property options.",
//               "Apartments, villas, townhouses, and commercial spaces offer different ownership opportunities.",
//               "Off-plan developments may provide payment structures that differ from completed properties.",
//               "Location, infrastructure, and rental demand influence property investment decisions.",
//               "Legal verification and additional ownership costs are important parts of the buying process.",
//             ]} />
//             <div className="rounded-lg border-l-4 border-sippy-gold bg-white p-4 shadow-sm">
//               <p><strong className="text-sippy-charcoal">Quick Insight:</strong> A property investment should not be based only on attractive photographs or promotional offers. Buyers should compare property prices, location, developer records, available facilities, and potential ownership expenses.</p>
//             </div>

//             {/* 1 */}
//             <H2>1. Why Is Dubai a Popular Destination for Property Buyers?</H2>
//             <p>Dubai offers several features that attract residential buyers and international investors.</p>
//             <H3>Growing Business Environment</H3>
//             <p>Dubai is an established centre for international trade, finance, tourism, and business activities. Its business environment attracts professionals, entrepreneurs, and companies from different countries.</p>
//             <H3>Modern Infrastructure</H3>
//             <p>The city offers developed road networks, public transportation, educational institutions, healthcare facilities, shopping centres, and entertainment destinations. These facilities contribute to the overall residential experience.</p>
//             <H3>International Connectivity</H3>
//             <p>Dubai's international airport and transport infrastructure make it convenient for residents, business owners, and international property investors.</p>
//             <H3>Different Property Options</H3>
//             <p>Buyers can explore studio apartments, family homes, luxury villas, townhouses, and commercial spaces according to their financial requirements.</p>
//             <H3>Investment Opportunities</H3>
//             <p>Different residential communities provide opportunities for long-term ownership and rental income. However, investment performance depends on the purchase price, location, expenses, rental demand, and wider market conditions. No property should be considered a guaranteed source of returns.</p>

//             {/* 2 */}
//             <H2>2. Different Types of Properties Available in Dubai</H2>
//             <p>Before purchasing a property, buyers should understand the major property categories available in the market.</p>
//             <Table
//               head={["Property Type", "Suitable For", "Important Factors to Check"]}
//               rows={[
//                 ["Apartments", "Individuals, couples, and families", "Size, facilities, service charges"],
//                 ["Luxury Villas", "Families looking for larger homes", "Location, maintenance, privacy"],
//                 ["Townhouses", "Families interested in community living", "Layout, shared facilities, connectivity"],
//                 ["Commercial Properties", "Business owners and investors", "Tenant demand, lease terms, business location"],
//               ]}
//             />
//             <H3>Apartments</H3>
//             <p>Apartments are available in different configurations, including studios, one-bedroom, two-bedroom, and larger units. They may suit individuals, couples, and families looking for residential properties with different facilities.</p>
//             <H3>Luxury Villas</H3>
//             <p>Villas offer private living spaces, multiple bedrooms, and additional outdoor areas. They are often considered by families looking for larger homes and greater privacy.</p>
//             <H3>Townhouses</H3>
//             <p>Townhouses combine features of apartment-style community living and independent residential homes. Many developments include shared facilities, landscaped areas, and recreational spaces.</p>
//             <H3>Commercial Properties</H3>
//             <p>Commercial properties include offices, retail spaces, and business premises. Investors should evaluate business activity, location, tenant requirements, and lease conditions before purchasing.</p>

//             {/* 3 */}
//             <H2>3. Popular Locations to Explore in Dubai</H2>
//             <p>Location plays an important role in property selection. Different areas offer different residential experiences, facilities, and investment considerations.</p>
//             <Table
//               head={["Location", "Key Features"]}
//               rows={[
//                 ["Downtown Dubai", "Central location, premium developments, shopping, and business access"],
//                 ["Dubai Marina", "Waterfront lifestyle, residential towers, restaurants, and entertainment"],
//                 ["Business Bay", "Commercial activity and residential developments"],
//                 ["Jumeirah Village Circle", "Apartments and townhouses in a residential community"],
//                 ["Dubai Hills Estate", "Planned community, green spaces, and lifestyle facilities"],
//               ]}
//             />
//             <H3>How to Choose the Right Location</H3>
//             <p>When comparing properties in Dubai, buyers should consider more than just the neighbourhood's popularity. Important factors include:</p>
//             <UL items={[
//               "Distance from workplaces and business areas.",
//               "Access to schools, hospitals, and daily facilities.",
//               "Public transportation and road connectivity.",
//               "Available amenities and community facilities.",
//               "Purchase budget and potential rental demand.",
//             ]} />
//             <p>The right location depends on personal requirements, financial capacity, and intended property use.</p>

//             {/* 4 */}
//             <H2>4. Off-Plan vs Ready Properties: Which Option Is Better?</H2>
//             <p>One important decision for buyers is whether to purchase an off-plan property or an already completed home.</p>
//             <Table
//               head={["Comparison", "Off-Plan Property", "Ready Property"]}
//               rows={[
//                 ["Construction", "Under development", "Completed"],
//                 ["Possession", "After construction and handover", "Usually available sooner"],
//                 ["Payment", "Developer-specific payment plans", "Based on purchase agreement"],
//                 ["Inspection", "Plans and specifications", "Physical inspection"],
//                 ["Rental Income", "Generally after completion", "Potentially available sooner"],
//                 ["Main Risk", "Construction and delivery delays", "Property condition and existing costs"],
//               ]}
//             />
//             <H3>Benefits and Considerations of Off-Plan Properties</H3>
//             <p>Some off-plan developments provide payment arrangements that differ from completed properties. However, buyers should verify the developer's reputation, project registration, escrow arrangements, payment schedule, and expected completion date.</p>
//             <H3>Benefits and Considerations of Ready Properties</H3>
//             <p>Ready properties allow buyers to inspect the actual unit, building facilities, and surrounding area before purchasing. Rental opportunities may also be available sooner, depending on the property's condition and applicable requirements.</p>
//             <p>The right option depends on the buyer's budget, financial planning, investment goals, risk tolerance, and preferred possession timeline.</p>

//             {/* 5 */}
//             <H2>5. Additional Costs Involved in Buying Property</H2>
//             <p>Is the listed property price the only amount buyers need to pay? No. Several additional expenses can influence the overall purchase budget. These may include:</p>
//             <UL items={[
//               "Dubai Land Department registration fees.",
//               "Real estate agency commission, where applicable.",
//               "Mortgage processing and valuation charges.",
//               "Property service charges.",
//               "Maintenance and repair expenses.",
//               "Insurance and utility costs.",
//               "Property management expenses for rented units.",
//             ]} />
//             <H3>How to Prepare a Realistic Property Budget</H3>
//             <p>Buyers should calculate the complete purchase and ownership budget before signing an agreement.</p>
//             <div className="rounded-lg bg-sippy-charcoal p-4 text-center font-semibold text-white">
//               Total Property Budget = Property Price + Registration Charges + Transaction Costs + Maintenance Reserve + Other Applicable Expenses
//             </div>
//             <p>Request a detailed cost breakdown from relevant professionals before completing the transaction. Registration and other charges should be verified through the appropriate authorities because applicable fees may vary.</p>

//             {/* 6 */}
//             <H2>6. Legal Requirements for International Property Buyers</H2>
//             <p>International buyers can purchase freehold properties in designated areas of Dubai, subject to applicable regulations. Before completing a transaction, buyers should:</p>
//             <UL items={[
//               "Confirm that the property is in an approved ownership area.",
//               "Verify the seller's ownership documents.",
//               "Review the sale and purchase agreement.",
//               "Check the project's registration and approvals.",
//               "Understand the payment schedule and transfer conditions.",
//               "Complete the required registration through authorised channels.",
//             ]} />
//             <p>The Dubai Land Department is responsible for registering and documenting real estate transactions. Buyers should ensure that the transaction is properly registered to protect their ownership rights.</p>

//             {/* 7 */}
//             <H2>7. Important Factors to Evaluate Before Investing</H2>
//             <p>A property purchase should be based on proper research rather than promotional offers alone.</p>
//             <UL items={[
//               <><strong>Location:</strong> Evaluate transport facilities, schools, hospitals, workplaces, and nearby amenities.</>,
//               <><strong>Developer Reputation:</strong> Review previous projects, construction quality, delivery history, and project approvals.</>,
//               <><strong>Rental Demand:</strong> Research the area's tenant profile, rental activity, and competition from similar properties.</>,
//               <><strong>Property Condition:</strong> Inspect the unit, building facilities, maintenance requirements, and available documentation.</>,
//               <><strong>Service Charges:</strong> Compare annual maintenance and service expenses because these affect ownership costs.</>,
//               <><strong>Future Development:</strong> Understand planned infrastructure and upcoming projects that could influence local property supply and demand.</>,
//             ]} />
//             <H3>Calculating Potential Rental Income</H3>
//             <p>Investors should not consider only the expected monthly rent. They should also account for vacancy periods, maintenance, service charges, property management, and other expenses.</p>
//             <p>A realistic calculation provides a clearer understanding of the property's potential financial performance.</p>

//             {/* 8 */}
//             <H2>8. Steps to Follow Before Purchasing a Property</H2>
//             <p>A structured buying process can help reduce confusion and support better decisions.</p>
//             <Table
//               head={["Step", "What Should You Do?"]}
//               rows={[
//                 ["1. Define Your Purpose", "Decide whether the property is for personal use, rental income, relocation, or long-term investment."],
//                 ["2. Set Your Budget", "Include the property price, registration charges, additional expenses, and an emergency reserve."],
//                 ["3. Research Locations", "Compare communities based on facilities, connectivity, and your requirements."],
//                 ["4. Shortlist Properties", "Evaluate multiple options instead of relying only on photographs or advertisements."],
//                 ["5. Verify Documents", "Check ownership details, project approvals, agreements, and payment schedules."],
//                 ["6. Complete the Purchase", "Follow the official transaction and registration process with authorised professionals."],
//               ]}
//             />
//             <H3>Buyer's Checklist</H3>
//             <ul className="space-y-2">
//               {[
//                 "Have you finalised your purchase budget?",
//                 "Have you compared different locations?",
//                 "Have you checked the developer's background?",
//                 "Have you reviewed all additional expenses?",
//                 "Have you verified ownership documents?",
//                 "Have you understood the payment and transfer conditions?",
//               ].map((t) => (
//                 <li key={t} className="flex items-start gap-2"><span className="text-sippy-gold">✔</span><span>{t}</span></li>
//               ))}
//             </ul>

//             {/* 9 */}
//             <H2>9. Exploring Real Estate Opportunities with Sippy Housing</H2>
//             <p>Along with researching international opportunities, buyers may also explore residential and investment options available in India. Comparing different real estate markets can help buyers understand property quality, location, documentation, and financial planning.</p>
//             <p>
//               <Link to="/" className="text-sippy-gold underline hover:text-sippy-charcoal">Sippy Housing</Link> offers real estate services and property opportunities across Mumbai and beyond. Its property-related expertise covers luxury homes, residential and commercial properties, redevelopment, joint ventures, and investment opportunities.
//             </p>
//             <p>Buyers interested in reviewing selected property options can also visit the <Link to="/favorites" className="text-sippy-gold underline">property favourites section</Link> to keep track of their preferred choices.</p>
//             <p>Exploring different property markets helps buyers understand the importance of location, property facilities, documentation, and long-term financial planning before making a real estate decision.</p>

//             <H2>Methodology and Limitations</H2>
//             <p>This guide provides a general overview of property buying considerations in Dubai for 2026. It covers ownership regulations, property categories, popular locations, additional expenses, and investment evaluation factors.</p>
//             <p>The information is intended for educational purposes. Property prices, rental demand, regulations, and transaction charges can change over time. Buyers should verify current details through the Dubai Land Department, relevant government authorities, developers, and qualified real estate professionals before making a purchase.</p>

//             <H2>Frequently Asked Questions (FAQs)</H2>
//             <div className="space-y-3">
//               {FAQS.map(([q, a], i) => (
//                 <details key={q} className="group rounded-lg border bg-white p-4">
//                   <summary className="cursor-pointer font-semibold text-sippy-charcoal">{i + 1}. {q}</summary>
//                   <p className="mt-2 text-base">{a}</p>
//                 </details>
//               ))}
//             </div>

//             <H2>Conclusion</H2>
//             <p>
//               <Link to="/properties" className="text-sippy-gold underline hover:text-sippy-charcoal">Dubai</Link> offers a wide range of residential and commercial property opportunities for international buyers and investors. However, selecting the right property requires proper research, financial planning, and an understanding of the legal process.
//             </p>
//             <p>Buyers should compare different locations, understand ownership regulations, review additional expenses, and verify all relevant documents before completing a transaction.</p>
//             <p>
//               Ultimately, a well-planned <Link to="/properties" className="text-sippy-gold underline hover:text-sippy-charcoal">property in Dubai</Link> purchase should match the buyer's financial capacity, intended use, and long-term objectives. By focusing on property quality, location, ownership costs, and realistic investment expectations, buyers can make more informed decisions in the real estate market.
//             </p>
//           </div>

//           <div className="mt-8 flex flex-wrap gap-2">
//             {POST.tags.map((t) => (
//               <span key={t} className="rounded-full border bg-white px-3 py-1 text-sm text-gray-600">{t}</span>
//             ))}
//           </div>

//           <div className="mt-10 rounded-xl bg-white p-6 text-center shadow">
//             <p className="mb-3 font-semibold text-sippy-charcoal">Looking for your next property?</p>
//             <Link to="/" className="inline-block rounded-lg bg-sippy-gold px-6 py-2 font-semibold text-white hover:bg-sippy-gold/90">Explore properties</Link>
//           </div>

//           <Link to="/blog" className="mt-8 inline-flex items-center text-sippy-gold hover:text-sippy-charcoal">
//             <ArrowLeft className="mr-2 h-4 w-4" /> Back to all blogs
//           </Link>
//         </article>

//         <aside className="hidden lg:block lg:self-stretch">
//           <TableOfContents />
//         </aside>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default BlogPostPage;



import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// 1. Import your blog components
import BlogPost1 from "@/pages/blogs/DubaiBlog1";
import BlogPost2 from "@/pages/blogs/DubaiBlog2";
import BlogPost3 from "@/pages/blogs/DubaiBlog3";
import BlogPost4 from "@/pages/blogs/DubaiBlog4";
import BlogPost5 from "@/pages/blogs/DubaiBlog5"; // <-- Blog 5 added
 import BlogPost6 from "@/pages/blogs/DubaiBlog6"; // <-- Blog 5 added
import BlogPost7 from "@/pages/blogs/DubaiBlog7"; // <-- Blog 5 added
import BlogPost8 from "@/pages/blogs/DubaiBlog8"; // <-- Blog 5 added
import BlogPost9 from "@/pages/blogs/DubaiBlog9"; // <-- Blog 5 added
import BlogPost10 from "@/pages/blogs/DubaiBlog10"; // <-- Blog 5 added
import BlogPost11 from "@/pages/blogs/DubaiBlog11"; // <-- Blog 5 added
// 2. Map each slug from your blog.ts to its component!
const BLOGS: Record<string, React.ComponentType> = {
  // Blog 1
  "what-should-you-know-before-buying-property-in-dubai-complete-guide-for-buyers-&-investors-(2026)": BlogPost1,
  "what-should-you-know-before-buying-property-in-dubai": BlogPost1,

  // Blog 2
  "what-does-dubai-real-estate-look-like-in-2026-market-trends-prices-&-investment-outlook": BlogPost2,
  //// Blog 3
  "how-can-you-buy-property-in-dubai-a-step-by-step-process-for-2026": BlogPost3,
   //// Blog 4
  "how-can-indians-buy-property-in-dubai-from-india-a-complete-guide-for-2026": BlogPost4,
    // Blog 5 (New)
  "off-plan-properties-in-dubai-is-it-worth-investing-in-2026": BlogPost5,
    // Blog 6 (New)
  "where-can-you-find-the-best-apartments-for-sale-in-dubai-a-guide-to-areas-prices-&-budgets": BlogPost6,

  "where-can-you-find-the-best-villas-for-sale-in-dubai-top-communities-for-families-and-investors": BlogPost7,
    // Blog 8 (New)
  "why-are-indian-investors-choosing-dubai-for-property-investment": BlogPost8,
   // Blog 9 (New)
  "rental-yield-in-dubai-which-areas-give-the-best-roi": BlogPost9,
  "where-can-you-find-the-best-studio-apartments-in-dubai-prices-areas-investment-potential": BlogPost10,

  "off-plan-vs-ready-property-in-dubai-which-is-better-for-you": BlogPost11,
};

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();

  // Find the matching blog
  const CurrentBlog = slug ? BLOGS[slug] : null;

  // If slug doesn't match
  if (!CurrentBlog) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
        <Navbar />
        <main className="mx-auto max-w-lg px-4 py-32 text-center">
          <h1 className="text-3xl font-bold text-sippy-charcoal mb-3">Blog Not Found</h1>
          <p className="text-gray-600 mb-6">The blog post you are looking for does not exist.</p>
          <Link
            to="/blog"
            className="inline-flex items-center rounded-lg bg-sippy-gold px-5 py-2.5 font-semibold text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to all blogs
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Display the matching blog!
  return <CurrentBlog />;
}