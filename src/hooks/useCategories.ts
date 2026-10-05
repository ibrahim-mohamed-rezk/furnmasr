import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, CategoriesResponse } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";

export const useCategories = () => {
  const { language } = useLanguage();

  return useQuery({
    queryKey: ["categories", language],
    queryFn: async () => {
      try {
        const response = await api.getCategories(language);
        return response;
      } catch (error) {
        toast.error("Failed to load categories");
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
}; 