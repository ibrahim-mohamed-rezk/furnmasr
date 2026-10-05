import Image from "next/image";
import { LocalizedLink as Link } from "@/components/Shared/LocalizedLink";
import React from "react";
import { Calendar } from "lucide-react";
import { Blog } from "@/lib/api";

function BlogCard({ blog }: { blog: Blog }) {
  // Handle null values gracefully
  const title = blog.title || "Untitled Blog";
  const description = blog.description || "No description available";
  const image = blog.cover || "/placeholder-image.png"; // Fallback image

  return (
    <div className="blog">
      <div className="card">
        <div className="group img relative">
          <Image
            src={image}
            alt={title}
            width={1000}
            height={1000}
            className="w-full h-96 object-cover bg-muted"
          />
          <Link href={`/blogs/${blog.id}`}>
            <div className="absolute inset-0 bottom-0 invisible group-hover:visible opacity-0 group-hover:opacity-100 bg-black/50 flex justify-center items-center p-4 transition-all duration-300 z-0">
              <div className="w-[200px] bg-background h-[2px] z-10  transition-all duration-300 group-hover:w-[25px] opacity-0 group-hover:opacity-100"></div>
              <div className="w-[2px] h-[200px] bg-background z-10 absolute top-1/2 -translate-y-1/2 right-1/2 transition-all duration-300 group-hover:h-[25px] opacity-0 group-hover:opacity-100"></div>
            </div>
          </Link>
        </div>
        <div className="content mt-5 px-6 space-y-4 text-center">
          <Link
            href={`/blogs/${blog.id}`}
            className="text-md font-bold mb-2 capitalize hover:text-primary transition-all duration-300"
          >
            <h4 className="line-clamp-2">{title}</h4>
          </Link>
          <p
            className="text-[14px] text-muted-foreground line-clamp-3"
            dangerouslySetInnerHTML={{ __html: description }}
          />

          {/* Show creation date if available */}
          {blog.created_at && (
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>{new Date(blog.created_at).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BlogCard;
