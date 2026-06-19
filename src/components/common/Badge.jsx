const roleStyles = {
  "Super Admin": "bg-[#efe6ff] text-[#6223c7]",
  Manager: "bg-[#e3efff] text-[#0454ff]",
  Staff: "bg-[#dcf8e9] text-[#098c45]",
};

const statusStyles = {
  Active: "bg-[#e1f8ec] text-[#087b3d]",
  Inactive: "bg-[#ffe7e7] text-[#d50d0d]",
};

export default function Badge({ children, type = "role" }) {
  const styles = type === "status" ? statusStyles : roleStyles;
  const hasDot = type === "status";

  return (
    <span className={`inline-flex items-center gap-2 rounded-md px-3 py-1 text-xs font-semibold ${styles[children] || "bg-[#edf2ff] text-[#0454ff]"}`}>
      {hasDot ? <span className="h-1.5 w-1.5 rounded-full bg-current" /> : null}
      {children}
    </span>
  );
}
