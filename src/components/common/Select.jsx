import { ChevronDown } from "lucide-react";

export default function Select({ label, required, options = [], className = "", ...props }) {
  return (
    <label className={`block ${className}`}>
      {label ? (
        <span className="mb-3 block text-sm font-bold text-[#071154]">
          {label} {required ? <span className="text-red-500">*</span> : null}
        </span>
      ) : null}
      <span className="relative block">
        <select
          className="h-12 w-full appearance-none rounded-md border border-[#cfd8eb] bg-white px-4 pr-11 text-sm font-medium text-[#071154] outline-none transition focus:border-[#0454ff] focus:ring-4 focus:ring-[#0454ff]/10"
          required={required}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value ?? option} value={option.value ?? option}>
              {option.label ?? option}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#071154]" />
      </span>
    </label>
  );
}
