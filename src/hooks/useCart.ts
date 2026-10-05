import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import { toast } from "sonner";
import { useState } from "react";
import { isAuthenticated } from "@/hooks/useAuth";
import { simpleSession } from "@/lib/simpleSession";
import { useCartSheetStore } from "@/store/cartSheet";
import { trackAddToCart } from "@/lib/tiktokPixel";

type UseCartOptions = {
  cityId?: string | null;
  addressId?: string | null;
};

export const useCart = (options?: UseCartOptions) => {
  const [removingItemId, setRemovingItemId] = useState<number | null>(null);
  const [addingToCartItemId, setAddingToCartItemId] = useState<number | null>(
    null
  );
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);
  const { language } = useLanguage();
  const { t } = useTranslation("shop");
  const queryClient = useQueryClient();
  const setCartSheetOpen = useCartSheetStore((s) => s.setOpen);

  // Get cart data
  const {
    data: cartData,
    isLoading: cartLoading,
    error: cartError,
    refetch: refetchCart,
  } = useQuery({
    queryKey: ["cart", language, options?.cityId ?? null, options?.addressId ?? null],
    queryFn: async () => {
      const shippingParams = {
        ...(options?.cityId ? { city_id: options.cityId } : {}),
        ...(options?.addressId ? { address_id: options.addressId } : {}),
      };

      if (isAuthenticated()) {
        // If the user just logged in and we still hold an anonymous session
        // id, forward it once so the backend can merge the anonymous cart
        // into the authenticated cart. Clear it after a successful response
        // so subsequent fetches go through the regular authenticated path.
        const pendingSessionId = simpleSession.getSessionId();
        if (pendingSessionId) {
          const sessionIdNumber = parseInt(
            pendingSessionId.replace("anon_", "")
          );
          const response = await api.getCart(language, {
            session_id: sessionIdNumber,
            ...shippingParams,
          });
          simpleSession.clearSession();
          return response;
        }
        return api.getCart(language, shippingParams);
      } else {
        // Anonymous user - pass session_id in URL param
        const sessionId = simpleSession.getOrCreateSessionId();
        const sessionIdNumber = parseInt(sessionId.replace("anon_", ""));
        return api.getCart(language, {
          session_id: sessionIdNumber,
          ...shippingParams,
        });
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

  // Best-effort lookup of a product's name/price for analytics. The
  // add-to-cart mutation only receives ids, and the cart refetch is async, so
  // we read from whatever is already cached: the current cart, then any cached
  // product list, then any cached single-product response.
  const findProductMeta = (
    productId: number,
  ): { name?: string; price?: number } => {
    const toPrice = (v: string | number | null | undefined) =>
      Number(v) || 0;

    const inCart = cartData?.data?.cart?.items?.find(
      (i: any) => i.product?.id === productId,
    );
    if (inCart?.product) {
      return {
        name: inCart.product.name,
        price: toPrice(
          inCart.price ??
            inCart.product.sale_price ??
            inCart.product.price,
        ),
      };
    }

    for (const [, resp] of queryClient.getQueriesData<any>({
      queryKey: ["home"],
    })) {
      const videos = resp?.data?.videos as Array<{
        product?: { id: number; name?: string | null; price?: string; sale_price?: string | null };
      }> | undefined;
      const fromVideo = videos?.find((v) => v.product?.id === productId)?.product;
      if (fromVideo) {
        return {
          name: fromVideo.name ?? undefined,
          price: toPrice(fromVideo.sale_price ?? fromVideo.price),
        };
      }
      const products = resp?.data?.products as Array<{
        id: number;
        name: string;
        price?: string;
        sale_price?: string | null;
      }> | undefined;
      const p = products?.find((x) => x.id === productId);
      if (p) return { name: p.name, price: toPrice(p.sale_price ?? p.price) };
    }

    for (const [, resp] of queryClient.getQueriesData<any>({
      queryKey: ["products"],
    })) {
      const p = resp?.data?.products?.find?.((x: any) => x.id === productId);
      if (p) return { name: p.name, price: toPrice(p.sale_price ?? p.price) };
    }

    for (const [, resp] of queryClient.getQueriesData<any>({
      queryKey: ["singleProduct"],
    })) {
      const p = resp?.data?.product;
      if (p?.id === productId) {
        return { name: p.name, price: toPrice(p.sale_price ?? p.price) };
      }
    }

    return {};
  };

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: ({
      productId,
      quantity,
      sizeId,
    }: {
      productId: number;
      quantity?: number;
      sizeId?: number;
    }) => {
      const extra: any = {};
      if (sizeId) extra.size_id = sizeId;
      if (isAuthenticated()) {
        return api.addToCart(productId, quantity || 1, language, extra);
      } else {
        // Anonymous user - pass session_id in body
        const sessionId = simpleSession.getOrCreateSessionId();
        const sessionIdNumber = parseInt(sessionId.replace("anon_", ""));
        return api.addToCart(productId, quantity || 1, language, {
          session_id: sessionIdNumber,
          ...extra,
        });
      }
    },
    onMutate: ({ productId }) => {
      setAddingToCartItemId(productId);
    },
    onSuccess: (
      _data,
      variables: { productId: number; quantity?: number; sizeId?: number },
    ) => {
      toast.success(t("added_to_cart_successfully"));
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      setAddingToCartItemId(null);
      // Pop the side cart open so the user can see what they just added.
      setCartSheetOpen(true);

      // TikTok AddToCart. Centralized here so every add-to-cart site (product
      // card, product detail, buy-now) is covered. The mutation only carries
      // ids, so look up name/price from whatever product data is already in
      // the React Query cache (best-effort; fires with price 0 if not found).
      const meta = findProductMeta(variables.productId);
      trackAddToCart({
        content_id: String(variables.productId),
        content_name: meta.name,
        quantity: variables.quantity ?? 1,
        price: meta.price ?? 0,
      });
    },
    onError: (error: any) => {
      toast.error(t("failed_to_add_to_cart"));
      setAddingToCartItemId(null);
    },
  });

  // Update cart item quantity
  const updateCartItemMutation = useMutation({
    mutationFn: ({
      itemId,
      quantity,
    }: {
      itemId: number;
      quantity: number;
    }) => {
      if (isAuthenticated()) {
        return api.updateCartItem(itemId, quantity, language);
      } else {
        // Anonymous user - pass session_id in body
        const sessionId = simpleSession.getOrCreateSessionId();
        const sessionIdNumber = parseInt(sessionId.replace("anon_", ""));
        return api.updateCartItem(itemId, quantity, language, {
          session_id: sessionIdNumber,
        });
      }
    },
    onMutate: ({ itemId }: { itemId: number; quantity: number }) => {
      setUpdatingItemId(itemId);
    },
    onSuccess: () => {
      toast.success(t("updated_cart_item_successfully"));
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      setUpdatingItemId(null);
    },
    onError: (error: any) => {
      toast.error(t("failed_to_update_cart"));
      setUpdatingItemId(null);
    },
  });

  // Remove from cart mutation
  const removeFromCartMutation = useMutation({
    mutationFn: (itemId: number) => {
      if (isAuthenticated()) {
        return api.removeFromCart(itemId, language);
      } else {
        // Anonymous user - pass session_id in body
        const sessionId = simpleSession.getOrCreateSessionId();
        const sessionIdNumber = parseInt(sessionId.replace("anon_", ""));
        return api.removeFromCart(itemId, language, {
          session_id: sessionIdNumber,
        });
      }
    },
    onMutate: (itemId: number) => {
      setRemovingItemId(itemId);
    },
    onSuccess: () => {
      toast.success(t("removed_from_cart_successfully"));
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      setRemovingItemId(null);
    },
    onError: (error: any) => {
      console.error("Remove from cart error:", error);
      toast.error(t("failed_to_remove_from_cart"));
      setRemovingItemId(null);
    },
  });

  // Helper function to check if a product is in cart
  const isProductInCart = (productId: number): boolean => {
    if (!cartData?.data?.cart?.items) return false;
    return cartData.data.cart.items.some(
      (item: any) => item.product?.id === productId
    );
  };

  // Helper function to get cart item quantity
  const getCartItemQuantity = (productId: number): number => {
    if (!cartData?.data?.cart?.items) return 0;
    const item = cartData.data.cart.items.find(
      (item: any) => item.product?.id === productId
    );
    return item ? item.quantity : 0;
  };

  return {
    cartData: cartData?.data,
    cartLoading,
    cartError,
    refetchCart,
    addToCart: addToCartMutation.mutate,
    addToCartAsync: addToCartMutation.mutateAsync,
    addToCartLoading: addToCartMutation.isPending,
    updateCartItem: updateCartItemMutation.mutate,
    updateCartItemLoading: updateCartItemMutation.isPending,
    removeFromCart: removeFromCartMutation.mutate,
    removeFromCartLoading: removeFromCartMutation.isPending,
    removingItemId,
    addingToCartItemId,
    updatingItemId,
    isProductInCart,
    getCartItemQuantity,
  };
};
