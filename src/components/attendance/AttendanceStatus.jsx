import { statusBadge } from "../../lib/attendanceMapper";

export default function AttendanceStatus({ today }) {
  const status = today?.status || "Not Punched In";

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="border-[#e1e7f2] lg:border-r lg:pr-8">
        <p className="text-sm font-bold text-[#071154]">Today's Status</p>
        <span className={`mt-4 inline-flex rounded-full bg-[#e1f8ec] px-4 py-2 text-sm font-bold ${statusBadge(status)}`}>{status}</span>
        <p className="mt-4 text-sm font-semibold text-[#071154]">Date: {today?.displayDate || "-"}</p>
        <p className="mt-2 text-sm font-medium text-[#51608f]">Remarks: {today?.remarks || "-"}</p>
      </div>

      <div className="border-[#e1e7f2] lg:border-r lg:px-8">
        <p className="text-sm font-bold text-[#17205e]">Punch In</p>
        <p className="mt-4 text-3xl font-extrabold text-[#071154]">{today?.displayPunchIn || "-:-- --"}</p>
        <p className="mt-3 text-sm font-medium text-[#51608f]">{today?.displayPunchIn && today.displayPunchIn !== "-" ? "Today" : "--"}</p>
      </div>

      <div className="lg:px-8">
        <p className="text-sm font-bold text-[#17205e]">Punch Out</p>
        <p className="mt-4 text-3xl font-extrabold text-[#071154]">{today?.displayPunchOut || "-:-- --"}</p>
        <p className="mt-3 text-sm font-medium text-[#51608f]">Duration: {today?.displayWorkingDuration || "-"}</p>
      </div>
    </div>
  );
}
