import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiResponse } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";

interface UseGetDataOptions<T> {
  endpoint: string;
  queryKey: (string | number)[];
  staleTime?: number;
  refetchOnWindowFocus?: boolean;
  enabled?: boolean;
  showErrorToast?: boolean;
  errorMessage?: string;
  showSuccessToast?: boolean;
  successMessage?: string;
  /**
   * Optional server-fetched response used to seed the cache so the first client
   * render already has data (e.g. for SSR'ing the homepage hero to improve LCP).
   */
  initialData?: ApiResponse<T>;
}

export const useGetData = <T>({
  endpoint,
  queryKey,
  staleTime = 5 * 60 * 1000, // 5 minutes default
  refetchOnWindowFocus = false,
  enabled = true,
  showErrorToast = true,
  errorMessage = "Failed to load data",
  showSuccessToast = false,
  successMessage = "Data loaded successfully",
  initialData,
}: UseGetDataOptions<T>) => {
  const { language } = useLanguage();

  // Debug: Log when language changes
  // console.log(`useGetData - Language: ${language}, Endpoint: ${endpoint}`);

  return useQuery({
    queryKey: [...queryKey, language], // Include language in query key
    queryFn: async () => {
      try {
        const response = await api.get<T>(endpoint, undefined, language);
        
        if (showSuccessToast) {
          toast.success(successMessage);
        }
        
        return response;
      } catch (error) {
        if (showErrorToast) {
          toast.error(errorMessage);
        }
        throw error;
      }
    },
    enabled,
    staleTime: 0, // Force refetch when language changes
    refetchOnWindowFocus,
    refetchOnMount: true, // Always refetch on mount
    refetchOnReconnect: true, // Refetch when reconnecting
    initialData,
  });
}; 