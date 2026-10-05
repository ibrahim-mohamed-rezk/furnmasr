import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { PlayIcon } from "lucide-react";
import { useState } from "react";
import { VideoProduct } from "@/lib/api";
import { VideoProductOverlay } from "../VideoProductOverlay";

// Function to convert Facebook video URL to embed format (plugins endpoint)
const convertToEmbedUrl = (url: string): string => {
  // Clean the URL first
  const cleanUrl = url.trim();
  
  // If it's already a Facebook plugins embed URL, return as is
  if (cleanUrl.includes("facebook.com/plugins/video.php")) {
    return cleanUrl;
  }

  // Normalize various Facebook video URL patterns to the plugins embed URL
  if (cleanUrl.includes("facebook.com")) {
    // Common patterns:
    // - https://www.facebook.com/watch/?v=VIDEO_ID
    // - https://www.facebook.com/{page}/videos/{VIDEO_ID}/
    // - https://fb.watch/{shortId}/

    // Try to resolve fb.watch short links: just pass through to plugins href
    const encodedHref = encodeURIComponent(cleanUrl);
    const params = new URLSearchParams({ href: cleanUrl, show_text: "false", width: "400" });
    return `https://www.facebook.com/plugins/video.php?${params.toString()}`;
  }

  // Fallback: return as-is if not a Facebook URL
  return cleanUrl;
};

export function VideoDialouge({
  videoUrl,
  product,
  videoTitle,
}: {
  videoUrl: string;
  product?: VideoProduct | null;
  videoTitle?: string;
}) {
  const [open, setOpen] = useState(false);
  const embedUrl = convertToEmbedUrl(videoUrl);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="cover bg-background text-foreground rounded-full p-4 sm:p-6 select-none cursor-pointer hover:scale-105 transition-all duration-300 hover:bg-primary">
          <PlayIcon className="w-8 h-8 sm:w-10 sm:h-10 fill-black" />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg md:max-w-2xl lg:max-w-5xl px-1 py-1 rounded-sm sm:p-4 md:p-6 sm:mx-4 max-h-[85vh] sm:max-h-none overflow-hidden [&>button]:top-3 [&>button]:left-1/2 [&>button]:right-auto [&>button]:start-auto [&>button]:end-auto [&>button]:-translate-x-1/2 md:[&>button]:top-4">
        <div className="video-container relative w-full flex justify-center items-center">
          <div className="relative w-full max-w-[400px] aspect-[9/16]">
            {open && (
              <>
                <iframe
                  src={embedUrl}
                  title="Facebook video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  scrolling="no"
                  style={{
                    border: "none",
                    borderRadius: "12px",
                  }}
                  sandbox="allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox allow-forms"
                  loading="eager"
                  className="absolute inset-0 h-full w-full rounded-xl"
                />

                {product && (
                  <VideoProductOverlay
                    product={product}
                    videoTitle={videoTitle}
                    className="p-2 sm:p-3"
                  />
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
