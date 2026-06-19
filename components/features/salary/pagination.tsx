import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
  searchParams: Record<string, string | string[] | undefined>;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalRecords,
  limit,
  searchParams,
}: PaginationProps) {
  // Helper to build URL for page links
  const getPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams();
    
    // Copy existing search params
    Object.entries(searchParams).forEach(([key, val]) => {
      if (val !== undefined && key !== "page") {
        params.set(key, String(val));
      }
    });
    
    params.set("page", String(pageNumber));
    return `/salaries?${params.toString()}`;
  };

  // Calculate range numbers
  const fromRecord = totalRecords === 0 ? 0 : (currentPage - 1) * limit + 1;
  const toRecord = Math.min(currentPage * limit, totalRecords);

  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-6 bg-surface-bg border-t border-light-border select-none">
      {/* Range text */}
      <div className="text-sm text-soft-dark-gray">
        Showing{" "}
        <span className="font-bold text-airbnb-black">{fromRecord}</span>–
        <span className="font-bold text-airbnb-black">{toRecord}</span> of{" "}
        <span className="font-bold text-airbnb-black">{totalRecords}</span> records
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        {hasPrevious ? (
          <Link
            href={getPageUrl(currentPage - 1)}
            className="flex items-center justify-center h-9 px-4 rounded-lg border border-light-border bg-surface-bg text-sm font-semibold text-soft-dark-gray hover:bg-hover-gray hover:text-airbnb-black transition-colors"
          >
            Previous
          </Link>
        ) : (
          <span className="flex items-center justify-center h-9 px-4 rounded-lg border border-light-border bg-hover-gray/40 text-sm font-semibold text-neutral-gray cursor-not-allowed">
            Previous
          </span>
        )}

        {/* Page indicators (simple pagination list for visual premium feel) */}
        <div className="hidden md:flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
            const isCurrent = pageNum === currentPage;
            return isCurrent ? (
              <span
                key={pageNum}
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-coral text-white text-sm font-bold shadow-sm"
              >
                {pageNum}
              </span>
            ) : (
              <Link
                key={pageNum}
                href={getPageUrl(pageNum)}
                className="flex items-center justify-center w-9 h-9 rounded-lg border border-light-border bg-surface-bg text-sm font-semibold text-soft-dark-gray hover:bg-hover-gray hover:text-airbnb-black transition-colors"
              >
                {pageNum}
              </Link>
            );
          })}
        </div>

        {/* Next Button */}
        {hasNext ? (
          <Link
            href={getPageUrl(currentPage + 1)}
            className="flex items-center justify-center h-9 px-4 rounded-lg border border-light-border bg-surface-bg text-sm font-semibold text-soft-dark-gray hover:bg-hover-gray hover:text-airbnb-black transition-colors"
          >
            Next
          </Link>
        ) : (
          <span className="flex items-center justify-center h-9 px-4 rounded-lg border border-light-border bg-hover-gray/40 text-sm font-semibold text-neutral-gray cursor-not-allowed">
            Next
          </span>
        )}
      </div>
    </div>
  );
}
