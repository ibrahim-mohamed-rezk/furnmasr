export type ProductImageLike =
  | string
  | { url?: string; type?: string }
  | null
  | undefined;

export function toProductImageUrl(value: ProductImageLike): string {
  if (!value) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "object" && value.url) return String(value.url).trim();
  return "";
}

/** Compare URLs ignoring trailing slashes and query strings when possible. */
export function isSameImageUrl(a: string, b: string): boolean {
  if (!a || !b) return false;
  if (a === b) return true;

  const normalize = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.pathname.replace(/\/$/, "").toLowerCase();
    } catch {
      return url.split("?")[0].replace(/\/$/, "").toLowerCase();
    }
  };

  return normalize(a) === normalize(b);
}

function isDisplayableGalleryItem(item: ProductImageLike): boolean {
  if (!item) return false;
  if (typeof item === "string") return Boolean(item.trim());
  const type = item.type?.toLowerCase();
  if (type && type !== "image" && type !== "gif") return false;
  return Boolean(item.url?.trim());
}

export function getProductMainImage(product: {
  image?: string | string[] | ProductImageLike[] | null;
  gallery?: ProductImageLike[] | null;
  default_size?: { image?: string | null } | null;
}): string {
  const fromSize = product.default_size?.image;
  if (fromSize) return toProductImageUrl(fromSize);

  if (Array.isArray(product.image) && product.image.length > 0) {
    return toProductImageUrl(product.image[0] as ProductImageLike);
  }
  if (typeof product.image === "string" && product.image) {
    return product.image;
  }
  if (product.gallery?.length) {
    return toProductImageUrl(product.gallery[0]);
  }
  return "";
}

export function getProductHoverImage(
  product: {
    image?: string | string[] | ProductImageLike[] | null;
    gallery?: ProductImageLike[] | null;
    hoverImage?: string | null;
  },
  mainImage: string,
): string {
  const candidates: ProductImageLike[] = [];

  if (product.hoverImage) {
    candidates.push(product.hoverImage);
  }

  if (product.gallery?.length) {
    for (const item of product.gallery) {
      if (isDisplayableGalleryItem(item)) {
        candidates.push(item);
      }
    }
  }

  if (Array.isArray(product.image) && product.image.length > 1) {
    for (let i = 1; i < product.image.length; i++) {
      candidates.push(product.image[i] as ProductImageLike);
    }
  }

  for (const candidate of candidates) {
    const url = toProductImageUrl(candidate);
    if (url && !isSameImageUrl(url, mainImage)) {
      return url;
    }
  }

  return "";
}
