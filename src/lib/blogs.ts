import { supabase } from "@/lib/supabase"; // <- the same Supabase client your property pages use

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
  read_time: number | null;  // minutes, calculated by the database
  published_at: string;
  updated_at: string | null;
}

const LIST_COLUMNS = "id, slug, title, excerpt, cover_image, category, author, tags, read_time, published_at, updated_at";

export const formatBlogDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";

export async function getBlogs(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("blogs")
    .select(LIST_COLUMNS)
    .eq("published", true)
    .order("published_at", { ascending: false });
  if (error) { console.error("Could not load blogs:", error.message); return []; }
  return (data ?? []) as BlogPost[];
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from("blogs")
    .select(`${LIST_COLUMNS}, content`)
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) { console.error("Could not load blog:", error.message); return null; }
  return (data as BlogPost) ?? null;
}
