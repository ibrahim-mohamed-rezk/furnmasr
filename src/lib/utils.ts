import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to handle image loading with fallbacks
export function getImageUrl(imageUrl: string | null, fallbackUrl?: string): string {
  if (!imageUrl) {
    return fallbackUrl || '/placeholder-image.png';
  }
  
  // If the URL is already a full URL, return it
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If it's a relative URL, prepend the base URL
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://mediumseagreen-woodcock-810460.hostingersite.com';
  return `${baseUrl}${imageUrl}`;
}

// Utility function to handle image loading errors
export function handleImageError(event: React.SyntheticEvent<HTMLImageElement, Event>, fallbackUrl?: string) {
  const target = event.target as HTMLImageElement;
  if (fallbackUrl) {
    target.src = fallbackUrl;
  } else {
    target.style.display = 'none';
  }
}
