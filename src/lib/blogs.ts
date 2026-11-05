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