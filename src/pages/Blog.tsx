import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BlogCard from "@/components/blog/blogCard";
import { BlogPost, getBlogs } from "@/lib/blogs";

// Page: /blog  (list of all published blogs)
const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[] | null>(null); // null = loading
  const [category, setCategory] = useState("All");

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Blog | Sippy Housing";
    getBlogs().then(setPosts);
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set((posts ?? []).map((p) => p.category).filter(Boolean) as string[]))],
    [posts]
  );
  const shown = (posts ?? []).filter((p) => category === "All" || p.category === category);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8 mt-20">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h1 className="mb-3 text-4xl font-bold text-sippy-charcoal">Our Blog</h1>
          <p className="text-gray-600">Guides, market insights and tips for buying, renting and investing in property.</p>
        </div>

        {categories.length > 2 && (
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  category === c ? "border-sippy-gold bg-sippy-gold text-white" : "bg-white text-gray-600 hover:border-sippy-gold hover:text-sippy-gold"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {posts === null ? (
          <p className="py-20 text-center text-gray-500">Loading blogs...</p>
        ) : shown.length === 0 ? (
          <p className="py-20 text-center text-gray-500">No blogs yet. Please check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {shown.map((p) => <BlogCard key={p.id} post={p} />)}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
