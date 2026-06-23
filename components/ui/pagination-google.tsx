"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface GooglePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function GooglePagination({
  currentPage,
  totalPages,
  onPageChange,
}: GooglePaginationProps) {
  if (totalPages <= 1) return null;

  // Google displays up to 10 pages in the sliding window
  const maxVisiblePages = 10;
  let startPage = Math.max(1, currentPage - 5);
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  // Helper to alternate Google colors for the "o" pages
  const getOColor = (page: number, isCurrent: boolean) => {
    if (isCurrent) {
      return "text-red-500 dark:text-red-400 font-bold scale-110";
    }
    const colors = [
      "text-amber-500 dark:text-amber-400",
      "text-red-500 dark:text-red-400",
      "text-blue-500 dark:text-blue-400",
      "text-emerald-500 dark:text-emerald-400",
    ];
    return colors[page % colors.length];
  };

  return (
    <div className="flex flex-col items-center gap-6 mt-16 pt-10 border-t border-border/20">
      {/* Google styled logo pagination */}
      <div className="flex items-center gap-1.5 md:gap-3 select-none">
        
        {/* Previous page link */}
        <button
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            "flex flex-col items-center justify-end h-16 pb-0.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 transition-all hover:text-foreground active:scale-95 disabled:pointer-events-none disabled:opacity-30 mr-2 md:mr-4",
          )}
        >
          <ChevronLeft className="w-5 h-5 mb-1 mx-auto" />
          <span>Trước</span>
        </button>

        {/* The 'G' letter */}
        <span className="text-3xl md:text-5xl font-serif font-bold text-blue-500 dark:text-blue-400 self-end pb-3 md:pb-5">
          G
        </span>

        {/* The 'o' pages */}
        <div className="flex items-end h-16 gap-1 md:gap-2">
          {pages.map((page) => {
            const isCurrent = page === currentPage;
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className="flex flex-col items-center group relative w-5 md:w-8 transition-transform duration-300 active:scale-95"
              >
                {/* Visual 'o' letter */}
                <span
                  className={cn(
                    "text-2xl md:text-4xl font-serif transition-all duration-300 font-bold group-hover:scale-115",
                    getOColor(page, isCurrent)
                  )}
                >
                  o
                </span>
                
                {/* Page number below */}
                <span
                  className={cn(
                    "text-[10px] md:text-xs font-medium mt-1 transition-colors",
                    isCurrent
                      ? "text-foreground font-bold"
                      : "text-muted-foreground/60 group-hover:text-foreground"
                  )}
                >
                  {page}
                </span>
              </button>
            );
          })}
        </div>

        {/* The 'gle' ending letters */}
        <div className="flex items-end self-end pb-3 md:pb-5 font-serif font-bold text-3xl md:text-5xl select-none">
          <span className="text-blue-500 dark:text-blue-400">g</span>
          <span className="text-emerald-500 dark:text-emerald-400">l</span>
          <span className="text-red-500 dark:text-red-400">e</span>
        </div>

        {/* Next page link */}
        <button
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            "flex flex-col items-center justify-end h-16 pb-0.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 transition-all hover:text-foreground active:scale-95 disabled:pointer-events-none disabled:opacity-30 ml-2 md:mr-4",
          )}
        >
          <ChevronRight className="w-5 h-5 mb-1 mx-auto" />
          <span>Sau</span>
        </button>

      </div>
    </div>
  );
}
