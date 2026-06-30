import { CalendarDays, Clock, Sun, UserCheck } from "lucide-react";

const cards = [
  {
    label: "Total Working Days",
    key: "totalWorkingDays",
    suffix: "Days",
    note: "(Includes all working days)",
    icon: CalendarDays,
    iconClass: "bg-[#eaf1ff] text-[#0454ff]",
  },
  {
    label: "Present Days",
    key: "presentDays",
    suffix: "Days",
    note: "(Includes Full & Half Days)",
    icon: UserCheck,
    iconClass: "bg-[#e5f8ee] text-[#08a34d]",
  },
  {
    label: "Full Days",
    key: "fullDays",
    suffix: "Days",
    note: "",
    icon: Clock,
    iconClass: "bg-[#f1e7ff] text-[#8a38f5]",
  },
  {
    label: "Half Days",
    key: "halfDays",
    suffix: "Days",
    note: "",
    icon: Sun,
    iconClass: "bg-[#fff0df] text-[#ff7a00]",
  },
];

export default function AttendanceCards({ summary }) {
  return (
    <section className="mb-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ label, key, suffix, note, icon: Icon, iconClass }) => (
        <div key={key} className="soft-shadow rounded-lg border border-[#dfe6f2] bg-white p-6">
          <div className="flex items-start gap-5">
            <div className={`grid h-16 w-16 shrink-0 place-items-center rounded-full ${iconClass}`}>
              <Icon className="h-7 w-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#17205e]">{label}</p>
              <p className="mt-2 text-3xl font-extrabold leading-none text-[#071154]">{formatNumber(summary?.[key])}</p>
              <p className="mt-2 text-sm font-semibold text-[#071154]">{suffix}</p>
              {note ? <p className="mt-4 text-sm font-medium text-[#51608f]">{note}</p> : null}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

function formatNumber(value) {
  const number = Number(value) || 0;
  return Number.isInteger(number) ? number : number.toFixed(1);
}
