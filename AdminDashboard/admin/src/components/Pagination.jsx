const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex flex-wrap items-center justify-end gap-2">
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
        <button
          key={page}
          className={`rounded-xl border px-3 py-2 text-sm transition ${
            page === currentPage
              ? "border-slate-900 bg-slate-900 text-white"
              : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
          }`}
          onClick={() => onPageChange(page)}
          type="button"
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
