import { useGetData } from "./useGetData";
import { FAQItem } from "@/lib/api";

export const useFaqs = () => {
  return useGetData<FAQItem[]>({
    endpoint: "/faqs",
    queryKey: ["faqs"],
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    showErrorToast: false,
  });
};
