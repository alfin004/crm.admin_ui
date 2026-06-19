export default function Input({ label, required, className = "", hint, icon: Icon, ...props }) {
  return (
    <label className={`block ${className}`}>
      {label ? (
        <span className="mb-3 block text-sm font-bold text-[#071154]">
          {label} {required ? <span className="text-red-500">*</span> : null}
        </span>
      ) : null}
      <span className="relative block">
        <input
          className="h-12 w-full rounded-md border border-[#cfd8eb] bg-white px-4 text-sm font-medium text-[#071154] outline-none transition placeholder:text-[#6f78a5] focus:border-[#0454ff] focus:ring-4 focus:ring-[#0454ff]/10 disabled:bg-[#f7f9fd] disabled:text-[#56618c]"
          required={required}
          {...props}
        />
        {Icon ? <Icon className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#071154]" /> : null}
      </span>
      {hint ? <span className="mt-2 block text-xs font-medium text-[#56618c]">{hint}</span> : null}
    </label>
  );
}
