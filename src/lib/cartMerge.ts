import { api } from "@/lib/api";
import { simpleSession } from "@/lib/simpleSession";

// Snapshot of an anonymous cart item, normalized for replay.
export type CapturedCartItem = {
  product_id: number;
  count: number;
  size_id?: number;
};

// Read the current anonymous cart so it can be re-added after the user
// authenticates. The backend does not reliably merge guest carts on login (and
// may even drop the guest cart when a session_id is presented), so we capture
// the items here — while still keyed by the anonymous session_id — and replay
// them as authenticated add-to-cart calls afterwards.
//
// IMPORTANT: for email/password login and register, call this BEFORE the login
// request, because the backend can clear the guest cart during that request.
export const captureAnonymousCart = async (
  language: string
): Promise<CapturedCartItem[]> => {
  const sessionId = simpleSession.getSessionId();
  if (!sessionId) return [];
  try {
    const sessionIdNumber = parseInt(sessionId.replace("anon_", ""));
    const response = await api.getCart(language, {
      session_id: sessionIdNumber,
    });
    const items = response?.data?.cart?.items ?? [];
    return items
      .filter((item) => Boolean(item?.product?.id))
      .map((item) => ({
        product_id: item.product.id,
        count: item.quantity,
        size_id: item.product_size_id ?? undefined,
      }));
  } catch (error) {
    console.error("Failed to capture anonymous cart before login:", error);
    return [];
  }
};

// Replay the captured guest cart into the now-authenticated cart. Requires the
// auth token to already be set so the add-to-cart calls run as the user. After
// replaying, drop the anonymous session so later fetches use the regular
// authenticated path.
export const replayCartAfterLogin = async (
  language: string,
  items: CapturedCartItem[]
): Promise<void> => {
  for (const item of items) {
    try {
      await api.addToCart(
        item.product_id,
        item.count,
        language,
        item.size_id ? { size_id: item.size_id } : undefined
      );
    } catch (error) {
      // Don't let one failed item block the rest of the merge.
      console.error(
        "Failed to merge guest cart item after login:",
        item,
        error
      );
    }
  }
  simpleSession.clearSession();
};
