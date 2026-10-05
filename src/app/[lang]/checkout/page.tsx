import React, { Suspense } from "react";
import BillingDetails from "./Components/BillingDetails";
import OrderDetails from "./Components/OrderDetails";
import { CheckoutShippingProvider } from "@/contexts/CheckoutShippingContext";

function CheckoutContent() {
  return (
    <CheckoutShippingProvider>
      <section className="max-w-7xl mx-auto py-20 px-6">
        <div className="cover flex flex-col md:flex-row xl:gap-16 gap-10">
          <div className="billing w-full order-2 md:order-1">
            <BillingDetails />
          </div>
          <div className="order w-full order-1 md:order-2">
            <OrderDetails />
          </div>
        </div>
      </section>
    </CheckoutShippingProvider>
  );
}

function page() {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-muted animate-pulse"></div>}
    >
      <CheckoutContent />
    </Suspense>
  );
}

export default page;
