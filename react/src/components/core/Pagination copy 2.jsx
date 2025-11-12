import React from "react";

const Pagination = ({ meta, onPageChange = () => {} }) => {
  if (!meta || meta.last_page <= 1) return null;

  return (
    <nav aria-label="Page navigation" className="flex justify-center mt-6">
      <ul className="inline-flex -space-x-px text-sm">
        {meta.links.map((link, index) => {
          // Clean label (Laravel adds &laquo; and &raquo;)
          const label = link.label
            .replace("&laquo; Previous", "Previous")
            .replace("Next &raquo;", "Next");

          // Style for active/inactive pages
          const baseClasses =
            "flex items-center justify-center px-3 h-8 leading-tight border";
          const normalClasses =
            "text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white";
          const activeClasses =
            "text-blue-600 border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-500 dark:bg-gray-700 dark:text-white";

          return (
            <li key={index}>
              <button
                disabled={!link.url}
                onClick={() => link.url && onPageChange(link.url)}
                className={`${baseClasses} ${
                  link.active ? activeClasses : normalClasses
                } ${index === 0 ? "rounded-s-lg" : ""} ${
                  index === meta.links.length - 1 ? "rounded-e-lg" : ""
                }`}
                dangerouslySetInnerHTML={{ __html: label }}
              />
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Pagination;
