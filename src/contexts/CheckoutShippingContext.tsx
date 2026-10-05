"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CheckoutShippingLocation = {
  cityId?: string | null;
  addressId?: string | null;
};

type CheckoutShippingContextValue = {
  shippingLocation: CheckoutShippingLocation;
  setShippingLocation: (location: CheckoutShippingLocation) => void;
};

const CheckoutShippingContext =
  createContext<CheckoutShippingContextValue | null>(null);

export function CheckoutShippingProvider({ children }: { children: ReactNode }) {
  const [shippingLocation, setShippingLocation] =
    useState<CheckoutShippingLocation>({});

  const value = useMemo(
    () => ({ shippingLocation, setShippingLocation }),
    [shippingLocation],
  );

  return (
    <CheckoutShippingContext.Provider value={value}>
      {children}
    </CheckoutShippingContext.Provider>
  );
}

export function useCheckoutShipping() {
  const context = useContext(CheckoutShippingContext);
  if (!context) {
    throw new Error(
      "useCheckoutShipping must be used within CheckoutShippingProvider",
    );
  }
  return context;
}
