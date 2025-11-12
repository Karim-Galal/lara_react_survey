import React from "react";

const Pagination = ({ meta, onPageChange = () => {} }) => {
  if (!meta || meta.last_page <= 1) return null;

  const currentPage = meta.current_page;
  const lastPage = meta.last_page;

  // Helper to create page buttons
  const createPage = (page) => ({
    label: page,
    url: `${meta.path}?page=${page}`,
    active: page === currentPage,
  });

  // Define the window of pages to show around the current one
  const pageNumbers = [];
  const delta = 2; // how many pages before/after current
  const start = Math.max(1, currentPage - delta); 
  const end = Math.min(lastPage, currentPage + delta);

  for (let i = start; i <= end; i++) {
    pageNumbers.push(createPage(i));
  }

  // Navigation buttons
  const first = createPage(1);
  const last = createPage(lastPage);
  const prev = currentPage > 1 ? createPage(currentPage - 1) : null;
  const next = currentPage < lastPage ? createPage(currentPage + 1) : null;

  const baseClasses =
    "flex items-center justify-center px-3 h-8 leading-tight border text-sm transition-colors duration-150";
  const normalClasses =
    "text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white";
  const activeClasses =
    "text-blue-600 border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-500 dark:bg-gray-700 dark:text-white";

  return (
    <nav aria-label="Page navigation" className="flex justify-center mt-6">
      <ul className="inline-flex flex-wrap -space-x-px">
        {/* Previous */}
        {prev && (
          <li>
            <button
              onClick={() => onPageChange(prev.url)}
              className={`${baseClasses} ${normalClasses} rounded-s-lg`}
            >
              Prev
            </button>
          </li>
        )}

        {/* First Page */}
        {currentPage > delta + 1 && (
          <>
            <li>
              <button
                onClick={() => onPageChange(first.url)}
                className={`${baseClasses} ${normalClasses}`}
              >
                1
              </button>
            </li>
            {currentPage > delta + 2 && (
              <li>
                <span className={`${baseClasses} ${normalClasses}`}>...</span>
              </li>
            )}
          </>
        )}

        {/* Page Numbers */}
        {pageNumbers.map((p) => (
          <li key={p.label}>
            <button
              onClick={() => onPageChange(p.url)}
              className={`${baseClasses} ${
                p.active ? activeClasses : normalClasses
              }`}
            >
              {p.label}
            </button>
          </li>
        ))}

        {/* Last Page */}
        {currentPage < lastPage - delta && (
          <>
            {currentPage < lastPage - delta - 1 && (
              <li>
                <span className={`${baseClasses} ${normalClasses}`}>...</span>
              </li>
            )}
            <li>
              <button
                onClick={() => onPageChange(last.url)}
                className={`${baseClasses} ${normalClasses}`}
              >
                {lastPage}
              </button>
            </li>
          </>
        )}

        {/* Next */}
        {next && (
          <li>
            <button
              onClick={() => onPageChange(next.url)}
              className={`${baseClasses} ${normalClasses} rounded-e-lg`}
            >
              Next
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Pagination;
