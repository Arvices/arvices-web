import React from "react";
import { ChevronLeft, ChevronRight } from "feather-icons-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const generatePages = (): (number | "...")[] => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1); // always show first page

    if (currentPage > 3) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      // Avoid pushing duplicates (like 1 or totalPages again)
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    if (!pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const paginationItems = generatePages();

  return (
    <div className="flex items-center gap-2 mt-6 flex-wrap">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="border rounded p-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={18} />
      </button>

      {paginationItems.map((item, index) => {
        const key =
          typeof item === "number" ? `page-${item}` : `ellipsis-${index}`;

        return item === "..." ? (
          <span key={key} className="px-2 text-gray-500 select-none">
            ...
          </span>
        ) : (
          <button
            key={key}
            onClick={() => onPageChange(item)}
            className={`px-3 py-1 rounded border text-sm font-medium ${
              item === currentPage
                ? "bg-blue-600 text-white border-blue-600"
                : "text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {item}
          </button>
        );
      })}

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="border rounded p-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};
