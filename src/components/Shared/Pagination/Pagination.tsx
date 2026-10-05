"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CustomPaginationProps {
  totalPages: number;
  currentPage: number;
  className?: string;
}

export function CustomPagination({
  totalPages,
  currentPage,
  className,
}: CustomPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
    const { direction } = useLanguage();


  // Function to create URL with page parameter
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }
    const queryString = params.toString();
    return `${pathname}${queryString ? `?${queryString}` : ""}`;
  };

  // Function to handle page navigation
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    const url = createPageUrl(page);
    router.push(url);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);

      if (currentPage <= 3) {
        // Show pages 2, 3, 4, 5
        for (let i = 2; i <= Math.min(5, totalPages - 1); i++) {
          pages.push(i);
        }
        if (totalPages > 5) {
          pages.push("...");
        }
      } else if (currentPage >= totalPages - 2) {
        // Show pages near the end
        if (totalPages > 5) {
          pages.push("...");
        }
        for (let i = Math.max(2, totalPages - 4); i < totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show pages around current page
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
      }

      // Show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className={`flex justify-center items-center ${className || ""}`}>
      <PaginationContent className="flex justify-center items-center gap-2">
        {/* Previous Button - Icon Only */}
        <PaginationItem>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-[10px] rounded-md transition-all duration-300 ${
              currentPage === 1
                ? "opacity-50 cursor-not-allowed bg-accent"
                : "bg-black text-white hover:bg-primary cursor-pointer"
            }`}
            aria-label="Previous page"
          >
            {direction === "rtl" ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </PaginationItem>

        {/* Page Numbers */}
        {getPageNumbers().map((page, index) => (
          <PaginationItem key={index} className="">
            {page === "..." ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href={createPageUrl(page as number)}
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(page as number);
                }}
                isActive={currentPage === page}
                className={`border border-black ${
                  currentPage === page
                    ? "bg-black border-primary text-white hover:bg-primary hover:text-white"
                    : "hover:bg-accent hover:border-border"
                } transition-all duration-300`}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        {/* Next Button - Icon Only */}
        <PaginationItem>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-[10px] rounded-md transition-all duration-300 ${
              currentPage === totalPages
                ? "opacity-50 cursor-not-allowed bg-accent"
                : "bg-black text-white hover:bg-primary cursor-pointer"
            }`}
            aria-label="Next page"
          >
            {direction === "rtl" ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </PaginationItem>
      </PaginationContent>
    </div>
  );
}

// Hook to get current page from URL
export function usePagination() {
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  return {
    currentPage: isNaN(currentPage) ? 1 : currentPage,
  };
}

// Simple pagination component for basic use cases
export function SimplePagination({
  totalPages,
  currentPage,
  onPageChange,
  className,
}: {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}) {
  if (totalPages <= 1) return null;

  return (
    <div
      className={`flex justify-center items-center gap-2 ${className || ""}`}
    >
      {/* Previous Button - Icon Only */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-md transition-all duration-300 ${
          currentPage === 1
            ? "opacity-50 cursor-not-allowed bg-accent"
            : "bg-black text-white hover:bg-primary"
        }`}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Page Numbers */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 rounded-md transition-all duration-300 ${
            currentPage === page
              ? "bg-black text-white"
              : "bg-muted hover:bg-accent"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next Button - Icon Only */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-md transition-all duration-300 ${
          currentPage === totalPages
            ? "opacity-50 cursor-not-allowed bg-accent"
            : "bg-black text-white hover:bg-primary"
        }`}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
