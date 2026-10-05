import { API_BASE_URL } from "@/constant/Base_Url";
import { authCookies } from "./auth";

// Fallback language for the rare call that doesn't pass one explicitly.
// The locale now lives in the URL (/ar/... or /en/...), so derive it from the
// pathname; default to Arabic (the site default) when unavailable. Most callers
// go through useGetData, which always passes the active language explicitly.
const getCurrentLanguage = (): string => {
  try {
    if (typeof window !== "undefined") {
      const seg = window.location.pathname.split("/").filter(Boolean)[0];
      if (seg === "en" || seg === "ar") {
        return seg;
      }
    }
  } catch (error) {
    console.warn("Failed to derive language from URL:", error);
  }
  return "ar";
};

// Get authentication token
const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    return authCookies.getToken();
  } catch (error) {
    console.warn("Failed to get token from localStorage:", error);
    return null;
  }
};

// Default headers for all requests
const getDefaultHeaders = (language?: string) => {
  const currentLanguage = language || getCurrentLanguage();
  const token = getAuthToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "Accept-Language": currentLanguage,
    "X-Language": currentLanguage,
    lang: currentLanguage,
  };

  // Add authorization header if token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

// Request interceptor
const requestInterceptor = (config: RequestInit, language?: string) => {
  const headers = {
    ...getDefaultHeaders(language),
    ...config.headers,
  };

  return {
    ...config,
    headers,
  };
};

// Response interceptor
const responseInterceptor = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`,
    );
  }
  return response;
};

// Generic fetch wrapper with interceptors
const apiFetch = async (
  url: string,
  options: RequestInit = {},
  language?: string,
) => {
  const config = requestInterceptor(options, language);
  const response = await fetch(url, config);
  return responseInterceptor(response);
};

export interface HomeSlider {
  id: number;
  name: string;
  content: string;
  title: string;
  image: string;
}

export interface Category {
  id: number;
  slug: string;
  status: boolean;
  sort_order: number;
  name: string;
  image: string;
  description: string;
  /** The parent category object when this is a subcategory, otherwise null. */
  parent: Category | null;
  products: Product[];
}

export interface ProductReview {
  id: number;
  user_id: number;
  product_id: number;
  rating: number;
  title: string;
  comment: string;
  approved: boolean;
  images: string[];
  verified_purchase: boolean;
  created_at: string | null;
}

export interface ProductSize {
  id: number;
  name: string;
  name_en: string;
  name_ar: string;
  price: string;
  sale_price: string | null;
  final_price: number;
  sku: string;
  stock: number;
  sort_order: number;
  is_default: boolean;
  image: string | null;
}

export interface Product {
  id: number;
  slug: string;
  slug_ar?: string;
  slug_en?: string;
  sku: string;
  price: string;
  sale_price: string | null;
  stock: number;
  min_stock: number;
  manage_stock: boolean;
  stock_status: string;
  status: string;
  image: string | string[] | null;
  gallery: Array<string | { url: string; type?: string; id?: number }>;
  weight: string | null;
  dimensions: string[];
  featured: boolean;
  attributes: string[];
  category_id: number;
  name: string;
  description: string | null;
  short_description: string | null;
  meta_title: string | null;
  meta_description: string | null;
  category: Category;
  product_offers: any[];
  reviews: ProductReview[];
  sizes?: ProductSize[];
  product_size?: ProductSize[];
  default_size?: ProductSize | null;
  faqs?: FAQItem[];
  extra_sections?: ProductExtraSection[];
  videos: {
    id: number;
    title: string;
    url: string;
    image: string;
  }[];
  video_reviews?: VideoReview[];
  user_reviews:UserReview[];
}

export interface BannerImage {
  id: number;
  image: string;
  content: string;
  title: string;
}

export interface FlashSaleItem {
  id: number;
  product_id: number;
  discount_type: "percent" | "fixed";
  value: string;
  title: string;
  valid_from: string;
  valid_to: string;
  status: boolean;
  category:
    | {
        name: string;
      }
    | string;
  product: {
    reviews: any;
    category: any;
    id: number;
    name: string;
    slug: string;
    sku: string;
    price: string;
    sale_price: string | null;
    description: string | null;
    short_description: string;
    image: string;
    gallery: string[];
    stock: number;
    stock_status: string;
    status: string;
    featured: boolean;
    category_id: number;
    meta_title: string;
    meta_description: string;
    weight: string;
    manage_stock: boolean;
    min_stock: number;
    dimensions: any[];
    attributes: any[];
  };
}

export interface VideoProduct {
  id: number;
  name: string | null;
  slug: string | null;
  slug_ar?: string | null;
  slug_en?: string | null;
  price: string;
  sale_price: string | null;
  image: string;
  stock?: number;
  status?: string;
}

export interface Video {
  id: number;
  title: string;
  url: string;
  image: string;
  product?: VideoProduct | null;
}

export interface VideoReview {
  id: number;
  title: string;
  url: string;
}

export interface UserReview {
  id: number;
  title: string;
  image: string;
}

export interface HomeData {
  slider: HomeSlider[];
  categories: Category[];
  best_seller: Product[];
  flash_sale: FlashSaleItem[];
  products: Product[];
  top_rated: Product[];
  videos: Video[];
  user_reviews: UserReview[];
  banner_main: BannerImage;
  banner_one: BannerImage;
  banner_two: BannerImage;
  banner_three: BannerImage;
  banner_four: BannerImage;
}

export interface ApiResponse<T = any> {
  status: boolean;
  msg: string;
  data: T;
}

export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

export interface ProductExtraSection {
  title: string;
  description: string;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  question_en: string;
  question_ar: string;
  answer_en: string;
  answer_ar: string;
  sort_order: number;
}

// Auth interfaces
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  postal_code: string;
  date_of_birth: string;
  gender: string;
  avatar: string | null;
  status: boolean;
}

export interface AuthResponse {
  status: boolean;
  token: string;
  msg: string;
  data: {
    user_data: UserData;
  };
}

export interface ProductsResponse {
  products: Product[];
  pagination?: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
}

export interface CategoriesResponse {
  category: Category[];
}

export interface CartItem {
  id: number;
  quantity: number;
  price: string;
  total?: number;
  product: Product;
  product_size_id?: number | null;
  product_size?: ProductSize | null;
}

export interface WishlistItem {
  id: number;
  product_id: number;
  product: Product;
  created_at: string;
}

export interface CartResponse {
  cart: {
    id: number;
    session_id: string | null;
    total_amount: number;
    total_items: number;
    items: CartItem[];
  };
  total_cart: number;
  shipping_cost?: number;
}

export type CartFetchParams = {
  session_id?: number;
  city_id?: number | string;
  address_id?: number | string;
};

export interface WishlistResponse {
  some(arg0: (item: any) => boolean): boolean;
  find(arg0: (item: any) => boolean): unknown;
  message: string;
  data: WishlistItem[];
}

export interface Blog {
  id: number;
  cover: string;
  image: string;
  title: string | null;
  description: string | null;
  keywords: string | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  created_at: string | null;
}

export interface BlogCategory {
  image: string;
  id: number;
  slug: string;
  status: boolean;
  sort_order: number;
  name: string;
  description: string;
  parent_id: number | null;
}

export interface BlogsResponse {
  blogs: Blog[];
  banner_one: {
    image: string;
    id: number;
  };
  banner_two: {
    image: string;
    id: number;
  };
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
  };
}

export interface BlogCategoriesResponse {
  category: BlogCategory[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
  };
}

export interface SingleBlogResponse {
  blog: Blog;
  related_blogs: Blog[];
}

export interface SingleProductResponse {
  product: Product;
  related_products: Product[];
}

export interface ProductOffer {
  id: number;
  product_id: number;
  discount_type: "percent" | "fixed";
  value: string;
  valid_from: string;
  valid_to: string;
  status: boolean;
  title: string;
}

export interface ReviewSubmissionData {
  rate: string;
  review: string;
  product_id: string;
  name: string;
  email: string;
  image?: File;
}

// API methods
export const api = {
  // GET request
  async get<T>(
    endpoint: string,
    options?: RequestInit,
    language?: string,
  ): Promise<ApiResponse<T>> {
    const response = await apiFetch(
      `${API_BASE_URL}${endpoint}`,
      {
        method: "GET",
        ...options,
      },
      language,
    );
    return response.json();
  },

  // POST request
  async post<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit,
    language?: string,
  ): Promise<ApiResponse<T>> {
    let body: string | FormData | undefined;

    if (data) {
      if (data instanceof FormData) {
        body = data;
      } else {
        body = JSON.stringify(data);
      }
    }

    const response = await apiFetch(
      `${API_BASE_URL}${endpoint}`,
      {
        method: "POST",
        body,
        ...options,
      },
      language,
    );
    return response.json();
  },

  // PUT request
  async put<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit,
    language?: string,
  ): Promise<ApiResponse<T>> {
    let body: string | FormData | undefined;

    if (data) {
      if (data instanceof FormData) {
        body = data;
      } else {
        body = JSON.stringify(data);
      }
    }

    const response = await apiFetch(
      `${API_BASE_URL}${endpoint}`,
      {
        method: "PUT",
        body,
        ...options,
      },
      language,
    );
    return response.json();
  },

  // DELETE request
  async delete<T>(
    endpoint: string,
    options?: RequestInit,
    language?: string,
  ): Promise<ApiResponse<T>> {
    const response = await apiFetch(
      `${API_BASE_URL}${endpoint}`,
      {
        method: "DELETE",
        ...options,
      },
      language,
    );
    return response.json();
  },

  // Auth endpoints
  async login(
    data: LoginData,
    language?: string,
    additionalData?: any,
  ): Promise<AuthResponse> {
    const loginBody = {
      ...data,
      ...additionalData,
    };

    const response = await this.post<AuthResponse["data"]>(
      "/login",
      loginBody,
      undefined,
      language,
    );

    return response as AuthResponse;
  },

  async register(
    data: RegisterData,
    language?: string,
    additionalData?: { session_id: number } | undefined,
  ): Promise<AuthResponse> {
    const registerBody = {
      ...data,
      ...additionalData,
    };

    return this.post<AuthResponse["data"]>(
      "/register",
      registerBody,
      undefined,
      language,
    ) as Promise<AuthResponse>;
  },

  async logout(language?: string): Promise<ApiResponse<any>> {
    return this.post("/logout", {}, undefined, language);
  },

  // Home data
  async getHomeData(language?: string): Promise<ApiResponse<HomeData>> {
    return this.get<HomeData>("/home", undefined, language);
  },

  // Products with filters
  async getProducts(
    filters?: {
      category_id?: number;
      price?: "asc" | "desc";
      created?: "asc" | "desc";
      search?: string;
      page?: number;
      offer?: number;
    },
    language?: string,
  ): Promise<ApiResponse<ProductsResponse>> {
    const params = new URLSearchParams();

    if (filters?.category_id) {
      params.append("category_id", filters.category_id.toString());
    }
    if (filters?.price) {
      params.append("price", filters.price);
    }
    if (filters?.created) {
      params.append("created", filters.created);
    }
    if (filters?.search) {
      params.append("search", filters.search);
    }
    if (filters?.page && filters.page > 1) {
      params.append("page", filters.page.toString());
    }
    if (filters?.offer) {
      params.append("offer", filters.offer.toString());
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/products?${queryString}` : "/products";

    return this.get<ProductsResponse>(endpoint, undefined, language);
  },

  // Categories
  async getCategories(
    language?: string,
  ): Promise<ApiResponse<CategoriesResponse>> {
    return this.get<CategoriesResponse>("/categories", undefined, language);
  },

  // Cart endpoints
  async getCart(
    language?: string,
    additionalData?: CartFetchParams,
  ): Promise<ApiResponse<CartResponse>> {
    const params = new URLSearchParams();

    if (additionalData?.session_id) {
      params.set("session_id", String(additionalData.session_id));
    }
    if (additionalData?.city_id) {
      params.set("city_id", String(additionalData.city_id));
    }
    if (additionalData?.address_id) {
      params.set("address_id", String(additionalData.address_id));
    }

    const query = params.toString();
    const endpoint = query ? `/carts?${query}` : "/carts";
    return this.get<CartResponse>(endpoint, undefined, language);
  },

  async addToCart(
    productId: number,
    quantity: number = 1,
    language?: string,
    additionalData?: any,
  ): Promise<ApiResponse<any>> {
    const body = {
      product_id: productId,
      count: quantity,
      ...additionalData,
    };

    return this.post("/carts", body, undefined, language);
  },

  async updateCartItem(
    itemId: number,
    quantity: number,
    language?: string,
    additionalData?: any,
  ): Promise<ApiResponse<any>> {
    const body = {
      product_id: itemId,
      count: quantity,
      ...additionalData,
    };

    return this.post(`/carts`, body, undefined, language);
  },

  async removeFromCart(
    itemId: number,
    language?: string,
    additionalData?: any,
  ): Promise<ApiResponse<any>> {
    if (additionalData?.session_id) {
      // For anonymous users, send session_id in body
      return this.delete(
        `/carts/${itemId}?session_id=${additionalData?.session_id}`,
        undefined,
        language,
      );
    }
    return this.delete(`/carts/${itemId}`, undefined, language);
  },

  // Wishlist endpoints
  async getWishlist(
    language?: string,
    additionalData?: any,
  ): Promise<ApiResponse<WishlistResponse>> {
    if (additionalData?.session_id) {
      // For anonymous users, pass session_id in URL
      return this.get<WishlistResponse>(
        `/wishlist?session_id=${additionalData.session_id}`,
        undefined,
        language,
      );
    }
    return this.get<WishlistResponse>("/wishlist", undefined, language);
  },

  async addToWishlist(
    productId: number,
    language?: string,
    additionalData?: any,
  ): Promise<ApiResponse<any>> {
    // Try sending as JSON
    const body = {
      product_id: productId,
      ...additionalData,
    };

    return this.post("/wishlist", body, undefined, language);
  },

  async removeFromWishlist(
    itemId: number,
    language?: string,
    additionalData?: any,
  ): Promise<ApiResponse<any>> {
    if (additionalData?.session_id) {
      // For anonymous users, send session_id in body
      return this.delete(
        `/wishlist/${itemId}?session_id=${additionalData?.session_id}`,
        undefined,
        language,
      );
    }
    return this.delete(`/wishlist/${itemId}`, undefined, language);
  },

  // Contact form submission
  async submitContact(
    data: {
      name: string;
      phone: string;
      content: string;
    },
    language?: string,
  ): Promise<ApiResponse<any>> {
    return this.post("/contact", data, undefined, language);
  },

  async getBlogs(
    filters?: {
      category_id?: number;
      page?: number;
      search?: string;
    },
    language?: string,
  ): Promise<ApiResponse<BlogsResponse>> {
    const params = new URLSearchParams();

    if (filters?.category_id) {
      params.append("category_id", filters.category_id.toString());
    }

    if (filters?.page) {
      params.append("page", filters.page.toString());
    }

    if (filters?.search) {
      params.append("search", filters.search);
    }

    const queryString = params.toString();
    const endpoint = `/blogs${queryString ? `?${queryString}` : ""}`;

    return this.get<BlogsResponse>(endpoint, {}, language);
  },

  async getBlog(
    id: number,
    language?: string,
  ): Promise<ApiResponse<SingleBlogResponse>> {
    return this.get<SingleBlogResponse>(`/blogs/${id}`, undefined, language);
  },

  async getBlogCategories(
    language?: string,
  ): Promise<ApiResponse<BlogCategoriesResponse>> {
    return this.get<BlogCategoriesResponse>("/categories", {}, language);
  },

  async getSingleProduct(
    slug: string,
    language?: string,
  ): Promise<ApiResponse<SingleProductResponse>> {
    return this.get<SingleProductResponse>(`/products/${slug}`, {}, language);
  },

  async submitReview(
    data: ReviewSubmissionData,
    language?: string,
  ): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append("rate", data.rate);
    formData.append("review", data.review);
    formData.append("product_id", data.product_id);
    // formData.append('name', data.name);
    // formData.append('email', data.email);

    if (data.image) {
      formData.append("image", data.image);
    }

    return this.post(
      "/review",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
      language,
    );
  },
};
