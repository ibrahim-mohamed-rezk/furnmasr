"use client";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { RefreshCw, Home, AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation();

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center px-4">
          <div className="max-w-2xl mx-auto text-center error-page-animate">
            {/* Error Icon */}
            <div className="mb-8">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 pulse-glow">
                <AlertTriangle className="w-12 h-12 text-red-600" />
              </div>
            </div>

            {/* Main Content */}
            <div className="space-y-6 mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-red-800">
                {t("global_error.title")}
              </h1>
              <p className="text-lg text-red-600 max-w-md mx-auto leading-relaxed">
                {t("global_error.description")}
              </p>
              {process.env.NODE_ENV === "development" && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
                  <p className="text-sm font-mono text-red-800 break-all">
                    {error.message}
                  </p>
                  {error.digest && (
                    <p className="text-xs text-red-600 mt-2">
                      Error ID: {error.digest}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button
                onClick={reset}
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg smooth-transition hover-lift shadow-lg hover:shadow-xl"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                {t("global_error.try_again")}
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-red-300 hover:border-red-500 text-red-700 hover:text-red-800 px-8 py-3 rounded-lg smooth-transition hover-lift"
              >
                <Link href="/" className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  {t("global_error.back_home")}
                </Link>
              </Button>
            </div>

            {/* Contact Support */}
            <div className="bg-background rounded-2xl p-6 shadow-lg border border-red-200 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-red-800 mb-4">
                {t("global_error.need_help")}
              </h3>
              <p className="text-red-600 mb-4">
                {t("global_error.contact_support")}
              </p>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-red-300 text-red-700 hover:bg-red-50 smooth-transition hover-lift"
              >
                <Link href="/contact">{t("global_error.contact_us")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
