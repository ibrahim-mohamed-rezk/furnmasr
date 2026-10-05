import { create } from "zustand";

interface CartSheetState {
  /**
   * Whether the side cart Sheet is open. Lifted out of SideCart's local state
   * so any component (e.g. the add-to-cart button on product cards) can pop the
   * cart open after a successful add.
   */
  isOpen: boolean;
  setOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
}

export const useCartSheetStore = create<CartSheetState>((set) => ({
  isOpen: false,
  setOpen: (open) =>
    set((state) => ({
      isOpen: typeof open === "function" ? open(state.isOpen) : open,
    })),
}));
