import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import Select from "./Select";

export default function Pagination({ page, totalPages, perPage, onPageChange, onPerPageChange, showingFrom, showingTo, total }) {
  const startPage = Math.max(1, Math.min(page - 1, totalPages - 2));
  const pages = Array.from({ length: Math.min(3, totalPages) }, (_, index) => startPage + index);

  return (
    <div className="flex flex-col gap-4 border-t border-[#e1e7f2] px-6 py-4 text-sm text-[#44518b] lg:flex-row lg:items-center lg:justify-between">
      <p className="font-medium">Showing {showingFrom} to {showingTo} of {total} users</p>
      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={perPage}
          onChange={(event) => onPerPageChange(Number(event.target.value))}
          options={[
            { label: "7 per page", value: 7 },
            { label: "10 per page", value: 10 },
            { label: "20 per page", value: 20 },
          ]}
          className="w-36"
        />
        <button className="grid h-10 w-10 place-items-center rounded-md border border-[#d8e0f0] bg-white text-[#071154]" onClick={() => onPageChange(1)} aria-label="First page" disabled={page === 1}>
          <ChevronsLeft className="h-4 w-4" />
        </button>
        <button className="grid h-10 w-10 place-items-center rounded-md border border-[#d8e0f0] bg-white text-[#071154]" onClick={() => onPageChange(Math.max(1, page - 1))} aria-label="Previous page" disabled={page === 1}>
          <ChevronLeft className="h-4 w-4" />
        </button>
        {pages.map((item) => (
          <button
            key={item}
            className={`h-10 w-10 rounded-md border text-sm font-semibold ${page === item ? "border-[#0454ff] bg-[#0454ff] text-white" : "border-[#d8e0f0] bg-white text-[#071154]"}`}
            onClick={() => onPageChange(item)}
          >
            {item}
          </button>
        ))}
        <button className="grid h-10 w-10 place-items-center rounded-md border border-[#d8e0f0] bg-white text-[#071154]" onClick={() => onPageChange(Math.min(totalPages, page + 1))} aria-label="Next page" disabled={page === totalPages}>
          <ChevronRight className="h-4 w-4" />
        </button>
        <button className="grid h-10 w-10 place-items-center rounded-md border border-[#d8e0f0] bg-white text-[#071154]" onClick={() => onPageChange(totalPages)} aria-label="Last page" disabled={page === totalPages}>
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
