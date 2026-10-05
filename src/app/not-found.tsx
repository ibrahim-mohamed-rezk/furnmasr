"use client";
import { LocalizedLink as Link } from "@/components/Shared/LocalizedLink";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, ShoppingBag } from "lucide-react";
import Image from "next/image";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center error-page-animate">
        {/* 404 Number with Animation */}
        <div className="flex items-center justify-center mb-5">
          <Image
            src="/404-Error.gif"
            alt="404"
            width={500}
            height={500}
            className="w-80 h-80"
          />
        </div>

        {/* Main Content */}
        <div className="space-y-6 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            {t("not_found.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
            {t("not_found.description")}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg smooth-transition hover-lift shadow-lg hover:shadow-xl"
          >
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              {t("not_found.back_home")}
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-2 border-border hover:border-primary text-foreground hover:text-primary px-8 py-3 rounded-lg smooth-transition hover-lift"
          >
            <Link href="/shop" className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              {t("not_found.browse_shop")}
            </Link>
          </Button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 opacity-10">
          <div className="w-20 h-20 bg-primary rounded-full floating-element"></div>
        </div>
        <div className="absolute bottom-10 right-10 opacity-10">
          <div
            className="w-16 h-16 bg-primary rounded-full floating-element"
            style={{ animationDelay: "0.5s" }}
          ></div>
        </div>
        <div className="absolute top-1/2 left-5 opacity-10">
          <div
            className="w-12 h-12 bg-primary rounded-full floating-element"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>
        <div className="absolute top-1/2 right-5 opacity-10">
          <div
            className="w-10 h-10 bg-primary rounded-full floating-element"
            style={{ animationDelay: "1.5s" }}
          ></div>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground smooth-transition"
            onClick={() => window.history.back()}
          >
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              {t("not_found.go_back")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
