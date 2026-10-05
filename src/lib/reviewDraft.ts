const DRAFT_KEY = "furnmasr_review_draft";

export type ReviewDraft = {
  productId: number;
  rating: number;
  review: string;
  name: string;
  email: string;
  imagePreview?: string | null;
  reopenDialog: boolean;
};

const readDraft = (): ReviewDraft | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ReviewDraft;
  } catch {
    return null;
  }
};

export const reviewDraft = {
  save: (draft: ReviewDraft): void => {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      // ignore storage errors (e.g. large image)
    }
  },

  peek: (productId: number): ReviewDraft | null => {
    const draft = readDraft();
    if (!draft || draft.productId !== productId) return null;
    return draft;
  },

  consume: (productId: number): ReviewDraft | null => {
    const draft = readDraft();
    if (!draft || draft.productId !== productId) return null;
    try {
      sessionStorage.removeItem(DRAFT_KEY);
    } catch {
      // ignore
    }
    return draft;
  },

  clear: (): void => {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.removeItem(DRAFT_KEY);
    } catch {
      // ignore
    }
  },
};

export function dataUrlToFile(dataUrl: string, filename: string): File {
  const [header, base64] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1] ?? "image/jpeg";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new File([bytes], filename, { type: mime });
}
