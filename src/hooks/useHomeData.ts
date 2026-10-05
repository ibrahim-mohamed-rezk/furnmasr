import { useGetData } from "./useGetData";
import { ApiResponse, HomeData } from "@/lib/api";

export const useHomeData = (initialData?: ApiResponse<HomeData>) => {
  return useGetData<HomeData>({
    endpoint: "/home",
    queryKey: ["homeData"],
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    showErrorToast: true,
    errorMessage: "Failed to load home data",
    initialData,
  });
}; 