import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";

interface UseBlogsOptions {
  category_id?: number;
  page?: number;
  search?: string;
  language?: string;
}

export const useBlogs = (options: UseBlogsOptions = {}) => {
  const { category_id, page = 1, search, language } = options;
  const { language: contextLanguage } = useLanguage();

  // Use the language from options or fall back to context
  const currentLanguage = language || contextLanguage;

  // Build query key with proper filtering of undefined values
  const queryKey = ["blogs"];
  if (category_id !== undefined) queryKey.push(category_id.toString());
  if (page !== undefined) queryKey.push(page.toString());
  if (search !== undefined) queryKey.push(search);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [...queryKey, currentLanguage],
    queryFn: async () => {
      const filters = { category_id, page, search };
      return await api.getBlogs(filters, currentLanguage);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  const blogs = data?.data?.blogs || [];
  const pagination = data?.data?.pagination || null;
  // @ts-expect-error: 'banner' may not exist on BlogsResponse, but we want to handle it gracefully
  const banner = data?.data?.banner || [];
  const loading = isLoading;
  const errorMessage = error
    ? error instanceof Error
      ? error.message
      : "An error occurred"
    : null;

  const goToPage = (newPage: number) => {
    if (pagination && newPage >= 1 && newPage <= pagination.last_page) {
      // The hook will automatically refetch with new page due to query key change
      // This function is called by the parent component to update the page state
      // The parent component should update its currentPage state which will change the query key
    }
  };

  return {
    blogs,
    pagination,
    banner,
    loading,
    error: errorMessage,
    refetch,
    goToPage,
    data: data?.data,
  };
};

export const useSingleBlog = (id: number, language?: string) => {
  const { language: contextLanguage } = useLanguage();

  // Use the language from options or fall back to context
  const currentLanguage = language || contextLanguage;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["blog", id, currentLanguage],
    queryFn: async () => {
      return await api.getBlog(id, currentLanguage);
    },
    staleTime: 10 * 60 * 1000, // 10 minutes for single blog
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
    enabled: !!id, // Only fetch if ID is provided
  });

  const blog = data?.data?.blog || null;
  const relatedBlogs = data?.data?.related_blogs || [];
  const loading = isLoading;
  const errorMessage = error
    ? error instanceof Error
      ? error.message
      : "An error occurred"
    : null;

  return {
    blog,
    relatedBlogs,
    loading,
    error: errorMessage,
    refetch,
  };
};

export const useBlogCategories = (language?: string) => {
  const { language: contextLanguage } = useLanguage();

  // Use the language from options or fall back to context
  const currentLanguage = language || contextLanguage;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["blog-categories", currentLanguage],
    queryFn: async () => {
      return await api.getBlogCategories(currentLanguage);
    },
    staleTime: 10 * 60 * 1000, // 10 minutes for categories
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  const categories = data?.data?.category || [];
  const loading = isLoading;
  const errorMessage = error
    ? error instanceof Error
      ? error.message
      : "An error occurred"
    : null;

  return {
    categories,
    loading,
    error: errorMessage,
    refetch,
  };
};
