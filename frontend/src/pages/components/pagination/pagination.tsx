import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <ul className="flex space-x-5 justify-center font-[sans-serif]">
      {/* Previous Button */}
      <li
        className={`flex items-center justify-center shrink-0 bg-gray-100 w-9 h-9 rounded-md cursor-pointer ${
          currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 fill-gray-400" viewBox="0 0 55.753 55.753">
          <path d="M12.745 23.915c.283-.282.59-.52.913-.727L35.266 1.581a5.4 5.4 0 0 1 7.637 7.638L24.294 27.828l18.705 18.706a5.4 5.4 0 0 1-7.636 7.637L13.658 32.464a5.367 5.367 0 0 1-.913-.727 5.367 5.367 0 0 1-1.572-3.911 5.369 5.369 0 0 1 1.572-3.911z" />
        </svg>
      </li>

      {/* Page Numbers */}
      {pages.map((page) => (
        <li
          key={page}
          className={`flex items-center justify-center shrink-0 border hover:border-blue-500 cursor-pointer text-base font-bold px-[13px] h-9 rounded-md ${
            page === currentPage
              ? "bg-blue-500 text-white border-blue-500"
              : "text-gray-800"
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </li>
      ))}

      {/* Next Button */}
      <li
        className={`flex items-center justify-center shrink-0 border hover:border-blue-500 cursor-pointer w-9 h-9 rounded-md ${
          currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 fill-gray-400 rotate-180" viewBox="0 0 55.753 55.753">
          <path d="M12.745 23.915c.283-.282.59-.52.913-.727L35.266 1.581a5.4 5.4 0 0 1 7.637 7.638L24.294 27.828l18.705 18.706a5.4 5.4 0 0 1-7.636 7.637L13.658 32.464a5.367 5.367 0 0 1-.913-.727 5.367 5.367 0 0 1-1.572-3.911 5.369 5.369 0 0 1 1.572-3.911z" />
        </svg>
      </li>
    </ul>
  );
};

export default Pagination;
