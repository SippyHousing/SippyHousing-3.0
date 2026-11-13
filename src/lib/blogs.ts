// import { supabase } from "@/lib/supabase"; // <- the same Supabase client your property pages use

// export interface BlogPost {
//   id: string;
//   slug: string;              // shown in the URL: /blog/<slug>
//   title: string;
//   excerpt: string | null;
//   content?: string | null;   // only loaded on the single blog page
//   cover_image: string | null;
//   category: string | null;
//   author: string | null;
//   tags: string[] | null;
//   read_time: number | null;  // minutes, calculated by the database
//   published_at: string;
//   updated_at: string | null;
// }

// const LIST_COLUMNS = "id, slug, title, excerpt, cover_image, category, author, tags, read_time, published_at, updated_at";

// export const formatBlogDate = (iso?: string | null) =>
//   iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";

// export async function getBlogs(): Promise<BlogPost[]> {
//   const { data, error } = await supabase
//     .from("blogs")
//     .select(LIST_COLUMNS)
//     .eq("published", true)
//     .order("published_at", { ascending: false });
//   if (error) { console.error("Could not load blogs:", error.message); return []; }
//   return (data ?? []) as BlogPost[];
// }

// export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
//   const { data, error } = await supabase
//     .from("blogs")
//     .select(`${LIST_COLUMNS}, content`)
//     .eq("slug", slug)
//     .eq("published", true)
//     .maybeSingle();
//   if (error) { console.error("Could not load blog:", error.message); return null; }
//   return (data as BlogPost) ?? null;
// }



export interface BlogPost {
  id: string;
  slug: string;              // shown in the URL: /blog/<slug>
  title: string;
  excerpt: string | null;
  content?: string | null;   // only loaded on the single blog page
  cover_image: string | null;
  category: string | null;
  author: string | null;
  tags: string[] | null;
  read_time: number | null;  // minutes
  published_at: string;
  updated_at: string | null;
}

export const formatBlogDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";

// ==========================================
// YAHAN APNE SAARE BLOGS APNE HISAB SE MANAGE KAREIN
// ==========================================
const LOCAL_BLOGS: BlogPost[] = [
  {
    id: "1",
    slug: "what-should-you-know-before-buying-property-in-dubai-complete-guide-for-buyers-&-investors-(2026)",
    title: "What Should You Know Before Buying Property in Dubai? Complete Guide for Buyers & Investors (2026)",
    excerpt: "A complete guide to buying property in Dubai, understanding the market, and exploring investment opportunities for 2026.",
    content: "Dubai has become a premier destination for international property buyers and real estate investors. Its state-of-the-art infrastructure, tax-free returns on rental income, and luxurious communities make it an ideal choice. Before investing, make sure to research developer reputation, payment plans, and location advantages thoroughly.",
    cover_image: "/dubai-property-guide.png",
    category: "Dubai Real Estate",
    author: "Sippy Housing",
    tags: ["Dubai", "Real Estate", "Investment", "Villas"],
    read_time: 9,
    published_at: "2026-11-02T10:00:00Z",
    updated_at: null,
  },
  {
    id: "2",
    slug: "what-does-dubai-real-estate-look-like-in-2026-market-trends-prices-&-investment-outlook",
    title: "What Does Dubai Real Estate Look Like in 2026? Market Trends, Prices & Investment Outlook",
    excerpt: "Comparing two of Dubai's most prestigious neighborhoods to help you choose the right luxury property.",
    content: "When it comes to luxury living in Dubai, Dubai Marina and Palm Jumeirah are two of the most sought-after locations. While Marina offers a vibrant city-skyline waterfront lifestyle, Palm Jumeirah provides exclusive beachfront privacy and iconic resort-style villas.",
    cover_image: "/blogimg2.jpeg", // Aap yahan dusri image bhi de sakte hain
    category: "Dubai Real Estate",
    author: "Sippy Housing",
    tags: ["Dubai Marina", "Palm Jumeirah", "Luxury"],
    read_time: 6,
    published_at: "2026-11-03T12:00:00Z",
    updated_at: null,
  },
  // Blog 3 (New)
  {
    id: "3",
    slug: "how-can-you-buy-property-in-dubai-a-step-by-step-process-for-2026",
    title: "How Can You Buy Property in Dubai? A Step-by-Step Process for 2026",
    excerpt: "A complete step-by-step guide to buying property in Dubai, covering budget planning, legal requirements, ownership options, and DLD registration for 2026.",
    cover_image: "/blogimg3.jpeg",
    category: "Dubai Real Estate",
    author: "Sippy Housing",
    tags: ["Dubai Property", "Step-by-Step", "Buyer Guide", "DLD Registration", "2026"],
    read_time: 7,
    published_at: "2026-11-04T10:00:00Z",
    updated_at: null,
  },
  // Blog 4 (New)
  {
    id: "4",
    slug: "how-can-indians-buy-property-in-dubai-from-india-a-complete-guide-for-2026",
    title: "How Can Indians Buy Property in Dubai from India? A Complete Guide for 2026",
    excerpt: "Buying a property in Dubai is an exciting opportunity for Indian buyers. Learn how Indian residents and NRIs can purchase property in Dubai, LRS remittance rules, documentation, and the complete buying process for 2026.",
    cover_image: "/blogimg4.png",
    category: "Dubai Real Estate",
    author: "Sippy Housing",
    tags: ["Dubai Property", "Indian Investors", "LRS Remittance", "NRI Real Estate", "Buyer Guide", "2026"],
    read_time: 9,
    published_at: "2026-11-05T10:00:00Z",
    updated_at: null,
  },
   // Blog 5 (New)
  {
    id: "5",
    slug: "off-plan-properties-in-dubai-is-it-worth-investing-in-2026",
    title: "Off-Plan Properties in Dubai: Is It Worth Investing in 2026?",
    excerpt: "Dubai's real estate market continues to attract buyers looking for modern homes and flexible payment plans. Discover whether investing in off-plan properties in Dubai is worth it in 2026, including payment structures, risks, and developer due diligence.",
    cover_image: "/blogimg5.jpeg",
    category: "Dubai Real Estate",
    author: "Sippy Housing",
    tags: ["Dubai Property", "Off-Plan", "Property Investment", "Payment Plans", "Buyer Guide", "2026"],
    read_time: 7,
    published_at: "2026-11-06T10:00:00Z",
    updated_at: null,
  },
   // Blog 6 (New)
  {
    id: "6",
    slug: "where-can-you-find-the-best-apartments-for-sale-in-dubai-a-guide-to-areas-prices-&-budgets",
    title: "Where Can You Find the Best Apartments for Sale in Dubai? A Guide to Areas, Prices & Budgets",
    excerpt: "Planning to purchase an apartment in Dubai? Explore top residential areas including Dubai Marina, Downtown, and JVC, price factors, budget planning, apartment types, and essential buyer tips.",
    cover_image: "/blogimg6.jpeg",
    category: "Dubai Real Estate",
    author: "Sippy Housing",
    tags: ["Dubai Apartments", "Apartments for Sale", "Dubai Marina", "Downtown Dubai", "JVC", "Buyer Guide", "2026"],
    read_time: 8,
    published_at: "2026-11-07T12:00:00Z",
    updated_at: null,
  },
   // Blog 7 (New)
  {
    id: "7",
    slug: "where-can-you-find-the-best-villas-for-sale-in-dubai-top-communities-for-families-and-investors",
    title: "Where Can You Find the Best Villas for Sale in Dubai? Top Communities for Families & Investors",
    excerpt: "Planning to purchase an Villas in Dubai? Explore top residential areas including Dubai Marina, Downtown, and JVC, price factors, budget planning, apartment types, and essential buyer tips.",
    cover_image: "/blogimg7.jpeg",
    category: "Dubai Real Estate",
    author: "Sippy Housing",
    tags: ["Dubai Villas", "Villas for Sale", "Dubai Hills Estate", "Arabian Ranches", "MBR City", "Buyer Guide", "2026"],
    read_time: 8,
    published_at: "2026-11-09T12:00:00Z",
    updated_at: null,
  },
  
   // Blog 8 (New)
   {
    id: "8",
    slug: "why-are-indian-investors-choosing-dubai-for-property-investment",
    title: "Why Are Indian Investors Choosing Dubai for Property Investment?",
    excerpt: "Discover why Indian investors are actively choosing Dubai real estate. Explore portfolio diversification, high rental yields, top investment communities, LRS rules, and key buyer tips.",
    cover_image: "/blogimg8.jpeg",
    category: "Dubai Real Estate",
    author: "Sippy Housing",
    tags: ["Dubai Property", "Indian Investors", "Property Investment", "Dubai Real Estate", "LRS", "2026"],
    read_time: 8,
    published_at: "2026-11-10T10:00:00Z",
    updated_at: null,
  },
    // Blog 9 (New)
  {
    id: "9",
    slug: "rental-yield-in-dubai-which-areas-give-the-best-roi",
    title: "Rental Yield in Dubai: Which Areas Give the Best ROI?",
    excerpt: "Looking for the highest rental returns in Dubai real estate? Explore apartment and villa rental yields by community, gross vs net yield calculations, and essential investor ROI tips.",
    cover_image: "/blogimg9.jpeg",
    category: "Dubai Real Estate",
    author: "Sippy Housing",
    tags: ["Dubai Property", "Rental Yield", "Dubai ROI", "Property Investment", "JVC", "Dubai Marina", "2026"],
    read_time: 8,
    published_at: "2026-11-11T10:00:00Z",
    updated_at: null,
  },
  
   // Blog 10 (New)
    {
    id: "10",
    slug: "where-can-you-find-the-best-studio-apartments-in-dubai-prices-areas-investment-potential",
    title: "Where Can You Find the Best Studio Apartments in Dubai? Prices, Areas & Investment Potential",
    excerpt: "Looking for the best studio apartments for sale in Dubai? Explore top areas from affordable to premium, average prices, rental yield potential, and essential checklists for buyers.",
    cover_image: "/blogimg10.jpeg",
    category: "Dubai Real Estate",
    author: "Sippy Housing",
    tags: ["Dubai Real Estate", "Studio Apartments", "Dubai Studios", "Affordable Housing", "JVC", "Dubai Silicon Oasis", "2026"],
    read_time: 8,
    published_at: "2026-11-12T10:00:00Z",
    updated_at: null,
  },
  
   // Blog 11 (New)
    {
    id: "11",
    slug: "off-plan-vs-ready-property-in-dubai-which-is-better-for-you",
    title: "Off-Plan vs Ready Property in Dubai: Which Is Better for You?",
    excerpt: "Comparing off-plan vs ready property in Dubai? Discover differences in payment plans, possession timelines, rental returns, secondary market pros, cost breakdowns, and checklists.",
    cover_image: "/blogimg11.jpeg",
    category: "Dubai Real Estate",
    author: "Sippy Housing",
    tags: ["Off-Plan Property", "Ready Property", "Dubai Real Estate", "Secondary Market", "Property Investment", "Payment Plans", "2026"],
    read_time: 8,
    published_at: "2026-11-13T10:00:00Z",
    updated_at: null,
  },
  // Naya blog jodna ho toh bas yahan niche ek aur object copy-paste kar dein!
];

// Saare blogs return karega (Blog list page ke liye)
export async function getBlogs(): Promise<BlogPost[]> {
  return LOCAL_BLOGS;
}

// Single blog slug se dhoond kar laayega (Detail page ke liye)
export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  const blog = LOCAL_BLOGS.find((b) => b.slug === slug);
  return blog || null;
}