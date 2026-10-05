import Image from "next/image";
import { useState } from "react";
import { getImageUrl, handleImageError } from "@/lib/utils";

interface SafeImageProps {
  src: string | null;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackSrc?: string;
  priority?: boolean;
}

export function SafeImage({
  src,
  alt,
  width = 300,
  height = 300,
  className = "",
  fallbackSrc = "/placeholder-image.png",
  priority = false,
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(getImageUrl(src, fallbackSrc));
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      onError={handleError}
      // Add error handling props
      unoptimized={true} // Disable optimization for external images that might fail
    />
  );
}
