import React from "react";

const PaginationComponent = ({ totalItems, perPage, setPerPage, currentPage, setCurrentPage }) => {
  const totalPages = Math.ceil(totalItems / perPage);
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pageNumbers.push(i);
    } else if (pageNumbers[pageNumbers.length - 1] !== "...") {
      pageNumbers.push("...");
    }
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-y-4 md:gap-y-0 md:space-x-6">
      {/* Left Side: Page Size & Results Info */}
      <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 text-center">
        {/* <label className="text-sm font-medium">Show:</label> */}
        <div className="flex space-x-2">
          {[25, 50, 100].map((size) => (
            <button
              key={size}
              onClick={() => setPerPage(size)}
              className={`px-3 py-1 border rounded-md transition-all ${
                perPage === size ? "bg-gray-600 text-white" : "bg-gray-300 hover:bg-gray-400"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
        <span className="text-sm">
          Showing {Math.min(perPage, totalItems - (currentPage - 1) * perPage)} of ~{totalItems} results
        </span>
      </div>

      {/* Right Side: Pagination */}
      <div className="flex flex-wrap justify-center items-center gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded-md disabled:opacity-50 bg-gray-300 hover:bg-gray-400"
        >
          {'<'}
        </button>

        {pageNumbers.map((num, index) => (
          <button
            key={index}
            onClick={() => num !== "..." && setCurrentPage(num)}
            className={`px-3 py-1 border rounded-md transition-all ${
              currentPage === num ? "bg-gray-600 text-white" : "bg-gray-300 hover:bg-gray-400"
            }`}
            disabled={num === "..."}
          >
            {num}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded-md disabled:opacity-50 bg-gray-300 hover:bg-gray-400"
        >
         {'>'}
        </button>
      </div>
    </div>
  );
};

export default PaginationComponent;
