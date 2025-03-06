import React from "react";
import "../css/pagination.css"; // CSS 파일 경로에 맞게 조정
import { useMemo } from "react";

function usePagination(totalCount, itemsPerPage) {
    return useMemo(() => Math.ceil(totalCount / itemsPerPage), [totalCount, itemsPerPage]);
  }
  
  const Pagination = ({ totalCount, itemsPerPage, currentPage, onPageChange }) => {
    const totalPages = usePagination(totalCount, itemsPerPage);
  
    return (
      <div className="pagination-container">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={currentPage === index + 1 ? "active" : ""}
            onClick={() => onPageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    );
  };
  

export default Pagination;
