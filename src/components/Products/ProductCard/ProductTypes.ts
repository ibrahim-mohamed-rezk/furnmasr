export interface ProductCardProps {
  product: {
    id: number;
    slug: string;
    sku: string;
    price: string;
    category: string | { name: string } | null;
    sale_price: string | null;
    stock: number;
    min_stock: number;
    manage_stock: boolean;
    stock_status: string;
    status: string;
    image?: string | string[];
    hoverImage?: string;
    rating: number;
    gallery?: Array<string | { url: string; type?: string; id?: number }>;
    weight: string;
    dimensions: any[];
    featured: boolean;
    attributes: any[];
    category_id: number;
    name: string;
    description: string;
    short_description: string;
    meta_title: string;
    meta_description: string;
    product_offers: any[];
    reviews: Array<{
      id: number;
      user_id: number;
      product_id: number;
      rating: number;
      title: string | null;
      comment: string;
      approved: boolean;
      images: string[];
      verified_purchase: boolean;
      approved_at: string | null;
      created_at: string;
    }>;
    default_size?: {
      id: number;
      name: string;
      price: string;
      sale_price: string | null;
      final_price: number;
      image?: string | null;
    } | null;
    sizes?: Array<{
      id: number;
      name: string;
      price: string;
      sale_price: string | null;
      stock: number;
      sku: string;
      is_default?: boolean;
      image?: string | null;
    }>;
    product_size?: Array<{
      id: number;
      name: string;
      price: string;
      sale_price: string | null;
      stock: number;
      sku: string;
      is_default?: boolean;
      image?: string | null;
    }>;
  };
  isWishlist?: boolean;
  cardSlug?: string;
  isSpecial?: boolean;
}