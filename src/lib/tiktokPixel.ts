// TikTok Pixel event helpers.
//
// The base pixel is loaded once (lazyOnload) in src/app/layout.tsx and exposes
// a global `window.ttq`. Everything here is a thin, SAFE wrapper around it:
// every call no-ops on the server and before the lazy script has loaded, and
// nothing ever throws into the UI. Components/hooks import these typed helpers
// instead of touching `window.ttq` directly.

// Minimal shape of the global ttq object we actually call.
interface Ttq {
  page: (...args: unknown[]) => void;
  track: (event: string, params?: Record<string, unknown>) => void;
  identify: (params: Record<string, string>) => void;
}

declare global {
  interface Window {
    ttq?: Ttq;
  }
}

const CURRENCY = "EGP" as const;

// localStorage key used to carry the Purchase payload across the payment
// redirect (and to hand it to the COD success path). See stashPurchase /
// consumePurchase below.
export const PURCHASE_STASH_KEY = "ttq_purchase";
const PURCHASE_FIRED_ORDER_KEY = "ttq_purchase_fired_order";

export interface TrackedItem {
  content_id: string; // String(product id) — TikTok expects string ids
  content_name?: string;
  quantity?: number;
  price?: number; // unit price
}

export interface IdentifyInput {
  email?: string | null;
  phone_number?: string | null;
  external_id?: string | number | null;
}

export interface PurchaseStash {
  orderId?: string | number;
  items: TrackedItem[];
  value: number;
  currency: typeof CURRENCY;
  ts: number;
}

function getTtq(): Ttq | undefined {
  if (typeof window === "undefined") return undefined;
  return window.ttq;
}

function toNumber(v: string | number | null | undefined): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

// Never let analytics throw into the calling component.
function safeTrack(event: string, params: Record<string, unknown>): void {
  const ttq = getTtq();
  if (!ttq) return;
  try {
    ttq.track(event, params);
  } catch {
    /* swallow */
  }
}

function buildContentPayload(items: TrackedItem[], value: number) {
  return {
    contents: items.map((i) => ({
      content_id: i.content_id,
      content_type: "product" as const,
      content_name: i.content_name,
      quantity: i.quantity,
      price: i.price,
    })),
    value: Number.isFinite(value) ? value : 0,
    currency: CURRENCY,
  };
}

// SHA-256 hex of a normalized string. Returns undefined for empty input or when
// Web Crypto is unavailable (so we never send an empty/garbage hash).
async function sha256(value?: string | null): Promise<string | undefined> {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return undefined;
  if (typeof window === "undefined" || !window.crypto?.subtle) return undefined;
  try {
    const bytes = new TextEncoder().encode(normalized);
    const digest = await window.crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return undefined;
  }
}

// Reduce a phone number to digits and a leading +, before hashing.
function normalizePhone(phone?: string | null): string | undefined {
  if (!phone) return undefined;
  const cleaned = phone.replace(/[^\d+]/g, "");
  return cleaned || undefined;
}

export function trackViewContent(item: TrackedItem): void {
  safeTrack(
    "ViewContent",
    buildContentPayload([item], (item.price ?? 0) * (item.quantity ?? 1)),
  );
}

export function trackAddToCart(item: TrackedItem): void {
  safeTrack(
    "AddToCart",
    buildContentPayload([item], (item.price ?? 0) * (item.quantity ?? 1)),
  );
}

export function trackAddToWishlist(item: TrackedItem): void {
  safeTrack(
    "AddToWishlist",
    buildContentPayload([item], (item.price ?? 0) * (item.quantity ?? 1)),
  );
}

export function trackSearch(query: string): void {
  const search = query?.trim();
  if (!search) return;
  safeTrack("Search", { search_string: search, currency: CURRENCY });
}

export function trackInitiateCheckout(
  items: TrackedItem[],
  value: number,
): void {
  safeTrack("InitiateCheckout", buildContentPayload(items, value));
}

export function trackAddPaymentInfo(items: TrackedItem[], value: number): void {
  safeTrack("AddPaymentInfo", buildContentPayload(items, value));
}

export function trackPlaceAnOrder(items: TrackedItem[], value: number): void {
  safeTrack("PlaceAnOrder", buildContentPayload(items, value));
}

export function trackPurchase(items: TrackedItem[], value: number): void {
  safeTrack("Purchase", buildContentPayload(items, value));
}

// Fire Purchase from a stashed payload, skipping if this orderId already fired
// (guards back-button revisits of the payment callback page).
export function trackPurchaseFromStash(stash: PurchaseStash | null): void {
  if (!stash) return;
  if (stash.orderId != null && typeof window !== "undefined") {
    try {
      const key = String(stash.orderId);
      if (localStorage.getItem(PURCHASE_FIRED_ORDER_KEY) === key) return;
      localStorage.setItem(PURCHASE_FIRED_ORDER_KEY, key);
    } catch {
      /* swallow */
    }
  }
  trackPurchase(stash.items, stash.value);
}

export function trackCompleteRegistration(): void {
  safeTrack("CompleteRegistration", {});
}

// Hash PII and call ttq.identify. If the lazy pixel script has not loaded yet
// (common on first paint / app-load identify), retry once after a short delay
// so this path self-heals without looping.
export async function identifyUser(input: IdentifyInput): Promise<void> {
  const [email, phone, externalId] = await Promise.all([
    sha256(input.email),
    sha256(normalizePhone(input.phone_number)),
    sha256(
      input.external_id !== undefined && input.external_id !== null
        ? String(input.external_id)
        : undefined,
    ),
  ]);

  const payload: Record<string, string> = {};
  if (email) payload.email = email;
  if (phone) payload.phone_number = phone;
  if (externalId) payload.external_id = externalId;
  if (Object.keys(payload).length === 0) return;

  const send = () => {
    const ttq = getTtq();
    if (!ttq) return false;
    try {
      ttq.identify(payload);
    } catch {
      /* swallow */
    }
    return true;
  };

  if (!send() && typeof window !== "undefined") {
    setTimeout(send, 1500);
  }
}

// Persist the Purchase payload so it survives the payment redirect (or can be
// read by the COD success path).
export function stashPurchase(d: {
  orderId?: string | number;
  items: TrackedItem[];
  value: number;
}): void {
  if (typeof window === "undefined") return;
  try {
    const stash: PurchaseStash = {
      orderId: d.orderId,
      items: d.items,
      value: toNumber(d.value),
      currency: CURRENCY,
      ts: Date.now(),
    };
    localStorage.setItem(PURCHASE_STASH_KEY, JSON.stringify(stash));
  } catch {
    /* swallow */
  }
}

// Read-and-clear the stashed Purchase payload. Clearing on read is the primary
// guard against double-firing Purchase (e.g. the callback page's poll loop).
export function consumePurchase(): PurchaseStash | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PURCHASE_STASH_KEY);
    if (!raw) return null;
    localStorage.removeItem(PURCHASE_STASH_KEY);
    return JSON.parse(raw) as PurchaseStash;
  } catch {
    return null;
  }
}
