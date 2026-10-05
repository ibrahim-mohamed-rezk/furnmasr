"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useState, lazy, Suspense } from "react";

// Devtools are dev-only: lazy-loaded so the ~60KB bundle never ships to production.
const ReactQueryDevtools =
  process.env.NODE_ENV === "production"
    ? () => null
    : lazy(() =>
        import("@tanstack/react-query-devtools").then((m) => ({
          default: m.ReactQueryDevtools,
        }))
      );

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  // Default to LTR if not inside LanguageProvider
  const direction =
    typeof window !== "undefined" && window.localStorage
      ? (localStorage.getItem("language") === "ar" ? "rtl" : "ltr")
      : "ltr";

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV !== "production" && (
        <Suspense fallback={null}>
          <ReactQueryDevtools initialIsOpen={false} />
        </Suspense>
      )}
      <Toaster position={direction === "ltr" ? "top-left" : "top-right"} richColors closeButton duration={4000} />
    </QueryClientProvider>
  );
}
