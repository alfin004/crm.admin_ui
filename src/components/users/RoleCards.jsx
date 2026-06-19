import { ShieldCheck, UserRound, UsersRound } from "lucide-react";

const cards = [
  {
    title: "Super Admin",
    text: "Full access to all modules, settings and user management.",
    icon: ShieldCheck,
    className: "bg-[#efe7ff] text-[#6b37d8]",
  },
  {
    title: "Manager",
    text: "Manage customers, reports and staff within assigned scope.",
    icon: UsersRound,
    className: "bg-[#e6f0ff] text-[#0454ff]",
  },
  {
    title: "Staff",
    text: "Access assigned tasks, follow-ups and view related data.",
    icon: UserRound,
    className: "bg-[#ddf8e9] text-[#08934a]",
  },
];

export default function RoleCards() {
  return (
    <section className="table-shadow grid gap-5 rounded-lg border border-[#dfe6f2] bg-white p-6 lg:grid-cols-3">
      {cards.map(({ title, text, icon: Icon, className }, index) => (
        <article key={title} className={`flex gap-5 ${index < cards.length - 1 ? "lg:border-r lg:border-[#dbe3f1]" : ""}`}>
          <span className={`grid h-16 w-16 shrink-0 place-items-center rounded-md ${className}`}>
            <Icon className="h-8 w-8" />
          </span>
          <div>
            <h3 className="text-base font-extrabold text-[#071154]">{title}</h3>
            <p className="mt-2 max-w-xs text-sm font-medium leading-6 text-[#344078]">{text}</p>
          </div>
        </article>
      ))}
    </section>
  );
}
