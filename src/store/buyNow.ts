import { create } from "zustand";

export interface BuyNowProduct {
  id: number;
  name: string;
  price: number;
  image: string[];
  quantity: number;
  size_id?: number;
}

interface BuyNowState {
  /** The single product being checked out via "buy now", bypassing the cart. */
  product: BuyNowProduct | null;
  setProduct: (product: BuyNowProduct | null) => void;
}

export const useBuyNowStore = create<BuyNowState>((set) => ({
  product: null,
  setProduct: (product) => set({ product }),
}));
