"use client";

import { useState } from "react";
import {
  CustomPagination,
  usePagination,
  SimplePagination,
} from "./Pagination";

interface PaginationExampleProps {
  totalItems: number;
  itemsPerPage: number;
  className?: string;
}

export function PaginationExample({
  totalItems,
  itemsPerPage,
  className,
}: PaginationExampleProps) {
  const { currentPage } = usePagination();
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Calculate the items to show for current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return (
    <div className={className}>
      {/* Example content showing current page info */}
      <div className="mb-4 text-center">
        <p className="text-muted-foreground">
          Showing items {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
          {totalItems} items
        </p>
        <p className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </p>
      </div>

      {/* Custom Pagination with URL params */}
      <CustomPagination
        totalPages={totalPages}
        currentPage={currentPage}
        className="mt-6"
      />
    </div>
  );
}

// Example with state-based pagination (no URL params)
export function StatePaginationExample({
  totalItems,
  itemsPerPage,
  className,
}: PaginationExampleProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Calculate the items to show for current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className={className}>
      {/* Example content showing current page info */}
      <div className="mb-4 text-center">
        <p className="text-muted-foreground">
          Showing items {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
          {totalItems} items
        </p>
        <p className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </p>
      </div>

      {/* Simple Pagination with state */}
      <SimplePagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        className="mt-6"
      />
    </div>
  );
}
