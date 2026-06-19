import { Loader2 } from "lucide-react";

const variants = {
  primary: "bg-[#0454ff] text-white shadow-[0_8px_18px_rgba(4,84,255,0.22)] hover:bg-[#0147df]",
  secondary: "border border-[#d8e0f0] bg-white text-[#071154] hover:bg-[#f7faff]",
  ghost: "text-[#071154] hover:bg-[#eef4ff]",
  icon: "border border-[#d8e0f0] bg-white text-[#0454ff] hover:bg-[#f7faff]",
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  icon: Icon,
  loading = false,
  disabled = false,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex h-12 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : Icon ? <Icon className="h-4 w-4" /> : null}
      {children}
    </button>
  );
}
