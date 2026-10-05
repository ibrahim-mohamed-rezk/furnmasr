import { useState } from "react";
import { ImageIcon } from "lucide-react";

interface PlaceholderImageProps {
  src: string | null;
  alt: string;
  width?: string;
  height?: string;
  className?: string;
  fallbackSrc?: string;
  priority?: boolean;
}

export function PlaceholderImage({
  src,
  alt,
  width = "100%",
  height = "100%",
  className = "",
  fallbackSrc,
  priority = false,
}: PlaceholderImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (hasError || !src) {
    return (
      <div
        className={`flex items-center justify-center bg-accent text-muted-foreground ${className}`}
        style={{ width: width || "100%", height: height || "100%" }}
      >
        <div className="text-center">
          <ImageIcon className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">Image not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-muted" style={{ width: width || "100%", height: height || "100%" }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-accent">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoading ? "opacity-0" : "opacity-100"} bg-muted object-cover`}
        style={{ width: width || "100%", height: height || "100%" }}
        onError={handleError}
        onLoad={handleLoad}
        loading={priority ? "eager" : "lazy"}
      />
    </div>
  );
}
