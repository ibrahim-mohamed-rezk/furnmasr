import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ProductsResponse } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";

interface UseProductsOptions {
  category_id?: number;
  price?: 'asc' | 'desc';
  created?: 'asc' | 'desc';
  search?: string;
  page?: number;
  enabled?: boolean;
  mode?: 'products' | 'flash-sale';
  offer?: number;
}

export const useProducts = (filters?: UseProductsOptions) => {
  const { language } = useLanguage();
  const { category_id, price, created, search, page = 1, enabled = true, offer } = filters || {};

  // Create query key that includes all filters
  const queryKey = [
    "products",
    language,
    category_id,
    price,
    created,
    search,
    page,
    offer
  ];

  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const response = await api.getProducts(
          { category_id, price, created, search, page, offer },
          language
        );
        return response;
      } catch (error) {
        console.error('useProducts - API Error:', error);
        toast.error("Failed to load products");
        throw error;
      }
    },
    enabled,
    staleTime: 0, // Force refetch when filters change
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
}; 

export const useSingleProduct = (slug: string, language?: string) => {
  const { language: contextLanguage } = useLanguage();
  const currentLanguage = language || contextLanguage;

  return useQuery({
    queryKey: ["singleProduct", slug, currentLanguage],
    queryFn: async () => {
      try {
        const response = await api.getSingleProduct(slug, currentLanguage);
        return response;
      } catch (error) {
        console.error("useSingleProduct - API Error:", error);
        toast.error("Failed to load product");
        throw error;
      }
    },
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
}; 