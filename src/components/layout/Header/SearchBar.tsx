import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import { localeHref } from "@/lib/locale";
import { XIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { trackSearch } from "@/lib/tiktokPixel";

function SearchBar({
  setOpenSearch,
}: {
  setOpenSearch: (open: boolean) => void;
}) {
  const { t } = useTranslation("shop");
  const { direction, language } = useLanguage();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  // Handle search input change with debouncing
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim()) {
        // TikTok Search — debounced (500ms) so it doesn't fire per keystroke.
        trackSearch(searchTerm.trim());
        // Navigate to shop page with search parameter
        router.push(
          localeHref(
            `/shop?search=${encodeURIComponent(searchTerm.trim())}`,
            language
          )
        );
      } else if (searchTerm === "") {
        // If search is cleared, go to shop without search parameter
        router.push(localeHref("/shop", language));
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm, router, language]);

  // Handle clear search
  const handleClearSearch = () => {
    setSearchTerm("");
  };

  // Handle close search bar
  const handleCloseSearch = () => {
    setSearchTerm("");
    setOpenSearch(false);
  };

  return (
    <section className="w-full h-20 bg-background z-10 shadow-sm select-none relative">
      <div className="cover">
        <Input
          type="text"
          placeholder={t("search")}
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full h-20 px-5 border-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-transparent"
          autoFocus
        />
        <div
          className={cn(
            "search-btn absolute top-1/2 -translate-y-1/2 flex items-center gap-2",
            direction === "ltr" ? "right-5" : "left-5"
          )}
        >
          {searchTerm && (
            <Button
              type="button"
              size="icon"
              className="w-8 h-8 bg-accent text-muted-foreground hover:bg-gray-300"
              onClick={handleClearSearch}
            >
              <XIcon className="w-4 h-4" />
            </Button>
          )}

          <Button
            type="button"
            size="icon"
            className="w-10 h-10 bg-black text-white"
            onClick={handleCloseSearch}
          >
            <XIcon className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}

export default SearchBar;
