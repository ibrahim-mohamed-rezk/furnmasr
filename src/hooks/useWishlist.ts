import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import { toast } from "sonner";
import { useState } from "react";
import { isAuthenticated } from "@/hooks/useAuth";
import { simpleSession } from "@/lib/simpleSession";

export const useWishlist = () => {
  const [removingItemId, setRemovingItemId] = useState<number | null>(null);
  const { language } = useLanguage();
  const { t } = useTranslation("shop");
  const queryClient = useQueryClient();

  // Get wishlist data
  const {
    data: wishlistData,
    isLoading: wishlistLoading,
    error: wishlistError,
    refetch: refetchWishlist,
  } = useQuery({
    queryKey: ["wishlist", language],
    queryFn: () => {
      if (isAuthenticated()) {
        return api.getWishlist(language);
      } else {
        // Anonymous user - pass session_id in URL param
        const sessionId = simpleSession.getOrCreateSessionId();
        const sessionIdNumber = parseInt(sessionId.replace("anon_", ""));
        return api.getWishlist(language, { session_id: sessionIdNumber });
      }
    },
    staleTime: 0,
    refetchOnMount: true,
    refetchOnReconnect: true,
    retry: (failureCount, error: any) => {
      // Don't retry on 401/unauthorized errors
      if (
        error.message?.includes("401") ||
        error.message?.includes("unauthorized") ||
        error.message?.includes("Unauthorized")
      ) {
        return false;
      }
      return failureCount < 3;
    },
  });

  // Add to wishlist mutation
  const addToWishlistMutation = useMutation({
    mutationFn: (productId: number) => {
      if (isAuthenticated()) {
        return api.addToWishlist(productId, language);
      } else {
        // Anonymous user - pass session_id in body
        const sessionId = simpleSession.getOrCreateSessionId();
        const sessionIdNumber = parseInt(sessionId.replace("anon_", ""));
        return api.addToWishlist(productId, language, {
          session_id: sessionIdNumber,
        });
      }
    },
    onSuccess: () => {
      toast.success(t("added_to_wishlist_successfully"));
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (error: any) => {
      toast.error(t("failed_to_add_to_wishlist"));
    },
  });

  // Remove from wishlist mutation
  const removeFromWishlistMutation = useMutation({
    mutationFn: (itemId: number) => {
      if (isAuthenticated()) {
        return api.removeFromWishlist(itemId, language);
      } else {
        // Anonymous user - pass session_id in body
        const sessionId = simpleSession.getOrCreateSessionId();
        const sessionIdNumber = parseInt(sessionId.replace("anon_", ""));
        return api.removeFromWishlist(itemId, language, {
          session_id: sessionIdNumber,
        });
      }
    },
    onMutate: (itemId: number) => {
      setRemovingItemId(itemId);
    },
    onSuccess: () => {
      toast.success(t("removed_from_wishlist_successfully"));
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      setRemovingItemId(null);
    },
    onError: (error: any) => {
      toast.error(t("failed_to_remove_from_wishlist"));
      setRemovingItemId(null);
    },
  });

  // Helper function to check if a product is in wishlist
  const isProductInWishlist = (productId: number): boolean => {
    if (!wishlistData?.data) return false;
    return wishlistData.data.some((item: any) => item.product_id === productId);
  };

  // Helper function to get wishlist item id
  const getWishlistItemId = (productId: number): number | null => {
    if (!wishlistData?.data) return null;
    const item = wishlistData.data.find(
      (item: any) => item.product_id === productId
    );
    return item ? (item as any).id : null;
  };

  return {
    wishlistData: wishlistData?.data,
    wishlistLoading,
    wishlistError,
    refetchWishlist,
    addToWishlist: addToWishlistMutation.mutate,
    addToWishlistLoading: addToWishlistMutation.isPending,
    removeFromWishlist: removeFromWishlistMutation.mutate,
    removeFromWishlistLoading: removeFromWishlistMutation.isPending,
    removingItemId,
    isProductInWishlist,
    getWishlistItemId,
  };
};
