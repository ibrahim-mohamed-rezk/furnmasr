"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { localeHref } from "@/lib/locale";
import { API_BASE_URL } from "@/constant/Base_Url";
import { authCookies } from "@/lib/auth";
import { consumePurchase, trackPurchaseFromStash } from "@/lib/tiktokPixel";

type PaymentStatus = "loading" | "success" | "failed" | "timeout";

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t, language } = useTranslation("checkout");

  const [status, setStatus] = useState<PaymentStatus>("loading");
  // Guard against the 2s poll firing Purchase more than once.
  const purchaseFired = useRef(false);

  useEffect(() => {
    const orderId = searchParams.get("order_id");

    if (!orderId) {
      setStatus("failed");
      setTimeout(() => router.push(localeHref("/cart", language)), 3000);
      return;
    }

    let attempts = 0;
    const maxAttempts = 10; // 10 × 2s = 20 seconds max
    let timeoutId: ReturnType<typeof setTimeout>;

    const poll = async () => {
      try {
        const token = authCookies.getToken();
        const headers: Record<string, string> = {
          Accept: "application/json",
          "Content-Type": "application/json",
        };
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(
          `${API_BASE_URL}/payment/status/${orderId}`,
          { headers },
        );

        const data = await res.json();
        const paymentStatus = data?.data?.payment_status;

        if (paymentStatus === "paid") {
          // TikTok Purchase — read+clear the payload stashed at order creation.
          // Ref guard + read-and-clear together prevent any double-fire.
          if (!purchaseFired.current) {
            purchaseFired.current = true;
            const stashed = consumePurchase();
            if (stashed) trackPurchaseFromStash(stashed);
          }
          setStatus("success");
          setTimeout(() => router.push(localeHref("/account?tab=orders", language)), 3000);
          return;
        }

        if (paymentStatus === "failed") {
          setStatus("failed");
          setTimeout(() => router.push(localeHref("/cart", language)), 3000);
          return;
        }

        // Still pending — retry
        attempts++;
        if (attempts >= maxAttempts) {
          setStatus("timeout");
          return;
        }

        timeoutId = setTimeout(poll, 2000);
      } catch {
        attempts++;
        if (attempts >= maxAttempts) {
          setStatus("timeout");
          return;
        }
        timeoutId = setTimeout(poll, 2000);
      }
    };

    poll();

    return () => clearTimeout(timeoutId);
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-primary/[0.04] z-[-1]" />

      <div className="flex flex-col items-center justify-center gap-8 text-center max-w-md w-full">
        {status === "loading" && (
          <>
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
              <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">
                {t("payment_callback_verifying")}
              </h2>
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <Image
              src="/success.png"
              alt="success"
              width={200}
              height={200}
              quality={100}
              className="object-contain"
            />
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-primary">
                {t("payment_successfully")}
              </h2>
              <p className="text-muted-foreground">
                {t("payment_callback_success")}
              </p>
            </div>
          </>
        )}

        {status === "failed" && (
          <>
            <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center">
              <span className="text-5xl">❌</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-destructive">
                {t("payment_callback_failed")}
              </h2>
            </div>
          </>
        )}

        {status === "timeout" && (
          <>
            <div className="w-24 h-24 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
              <span className="text-5xl">⚠️</span>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">
                {t("payment_callback_timeout")}
              </h2>
              <Button
                size="lg"
                className="bg-black text-white rounded-sm font-semibold capitalize transition-all duration-300"
                onClick={() => router.push(localeHref("/account?tab=orders", language))}
              >
                {t("payment_callback_go_to_orders")}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentCallback() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-4 border-t-primary animate-spin" />
        </div>
      }
    >
      <PaymentCallbackContent />
    </Suspense>
  );
}
