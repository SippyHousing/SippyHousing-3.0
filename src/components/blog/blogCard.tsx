import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";
import { BlogPost, formatBlogDate } from "@/lib/blogs";

// One blog card. The whole card is a link to /blog/<slug>.
export default function BlogCard({ post }: { post: BlogPost }) {
    
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-sippy-beige">
        {post.cover_image && (
          <img
            src={post.cover_image}
            alt={post.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {post.category && (
          <span className="absolute left-3 top-3 rounded-md bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sippy-gold">
            {post.category}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 line-clamp-2 text-xl font-bold text-sippy-charcoal transition-colors group-hover:text-sippy-gold">
          {post.title}
        </h3>
        <p className="mb-4 line-clamp-3 text-sm text-gray-600">{post.excerpt}</p>

        <div className="mb-3 flex items-center gap-4 text-xs text-gray-500">
          <span className="inline-flex items-center gap-1"><User className="h-3.5 w-3.5" />{post.author || "Sippy Housing"}</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{post.read_time ?? 1} min</span>
        </div>

        <div className="mt-auto flex items-center justify-between border-t pt-3 text-sm">
          <span className="inline-flex items-center gap-1 text-gray-500">
            <Calendar className="h-4 w-4" />{formatBlogDate(post.published_at)}
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-sippy-gold">
            Read <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
