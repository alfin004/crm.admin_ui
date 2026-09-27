import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarDays, Download, FileSpreadsheet, RefreshCcw } from "lucide-react";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import Button from "../components/common/Button";
import Select from "../components/common/Select";
import { attendanceApi } from "../lib/attendanceApi";

const now = new Date();
const months = Array.from({ length: 12 }, (_, index) => ({ value: index + 1, label: new Intl.DateTimeFormat("en", { month: "long" }).format(new Date(2026, index, 1)) }));
// Include the current year so the current-date default is always selectable.
const years = Array.from({ length: now.getFullYear() - 2000 + 1 }, (_, index) => ({ value: now.getFullYear() - index, label: String(now.getFullYear() - index) }));
const reportRows = (response) => Array.isArray(response) ? response : response?.data?.items || response?.data || response?.items || [];
const number = (value) => Number(value || 0);

export default function AttendanceReport() {
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const periodLabel = useMemo(() => `${months[month - 1]?.label || ""} ${year}`, [month, year]);
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const response = await attendanceApi.monthlyReport({ month: Number(month), year: Number(year) });
      const items = reportRows(response);
      setRows(Array.isArray(items) ? items : []);
    } catch (err) {
      setRows([]);
      setError(err.status === 403 ? "You are forbidden from viewing this attendance report." : err.message || "Unable to load the attendance report.");
    } finally { setLoading(false); }
  }, [month, year]);

  useEffect(() => { load(); }, [load]);

  const exportReport = () => {
    const columns = ["Staff Name", "Email Address", "Mobile Number", "Working Days", "Full Days", "Half Days", "Absent Days", "Total Minutes"];
    const safe = (value) => String(value ?? "—").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
    const body = rows.map((row) => `<tr><td>${safe(row.username || "—")}</td><td>${safe(row.email || "—")}</td><td>${safe(row.mobile_number || "—")}</td><td>${number(row.total_days)}</td><td>${number(row.full_days)}</td><td>${number(row.half_days)}</td><td>${number(row.absent_days)}</td><td>${number(row.minutes)}</td></tr>`).join("");
    const excel = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body><table><thead><tr>${columns.map((column) => `<th>${column}</th>`).join("")}</tr></thead><tbody>${body}</tbody></table></body></html>`;
    const blob = new Blob([excel], { type: "application/vnd.ms-excel;charset=utf-8" });
    const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = `attendance-report-${year}-${String(month).padStart(2, "0")}.xls`; link.click(); URL.revokeObjectURL(link.href);
  };

  return <div className="app-shell min-h-screen bg-[#f8fbff]"><Sidebar /><Header /><main className="min-w-0 px-4 py-7 sm:px-6 lg:ml-[292px] lg:px-10"><div className="mx-auto max-w-[1500px]">
    <div className="mb-7 flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between"><div><h1 className="text-3xl font-extrabold tracking-[-0.01em] text-[#071154]">Attendance Report</h1><p className="mt-2 text-sm font-medium text-[#4b5783]">Review monthly staff attendance and working time.</p></div><div className="flex flex-col gap-3 sm:flex-row"><Button className="bg-[#00a869] text-white shadow-[0_8px_18px_rgba(0,168,105,0.2)] hover:bg-[#008a56]" icon={Download} onClick={exportReport} disabled={loading || !rows.length}>Export to Excel</Button></div></div>
    <section className="soft-shadow mb-6 rounded-xl border border-[#dfe6f2] bg-white p-5 sm:p-6"><div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div className="grid gap-5 sm:grid-cols-2"><Select label="Month" value={month} onChange={(event) => setMonth(Number(event.target.value))} options={months} className="min-w-[190px]" /><Select label="Year" value={year} onChange={(event) => setYear(Number(event.target.value))} options={years} className="min-w-[150px]" /></div><Button variant="secondary" icon={RefreshCcw} onClick={load} loading={loading}>Refresh Report</Button></div></section>
    {error ? <p className="mb-5 rounded-md bg-[#ffe7e7] px-4 py-3 text-sm font-semibold text-[#c62020]">{error}</p> : null}
    <section className="table-shadow overflow-hidden rounded-xl border border-[#dfe6f2] bg-white"><div className="flex items-center gap-2 border-b border-[#e1e7f2] px-5 py-4 sm:px-6"><span className="grid h-9 w-9 place-items-center rounded-md bg-[#e9f1ff] text-[#0454ff]"><FileSpreadsheet className="h-4 w-4" /></span><div><h2 className="font-extrabold text-[#071154]">Monthly Staff Attendance</h2><p className="text-xs font-medium text-[#65719b]"><CalendarDays className="mr-1 inline h-3.5 w-3.5" />{periodLabel}</p></div></div><div className="mobile-scrollbar overflow-x-auto"><table className="w-full min-w-[1040px] text-left text-sm"><thead className="bg-[#fbfcff]"><tr>{["#", "Staff Name", "Email Address", "Mobile Number", "Working Days", "Full Days", "Half Days", "Absent Days", "Total Minutes"].map((heading) => <th key={heading} className="whitespace-nowrap px-5 py-4 text-xs font-bold text-[#27325d]">{heading}</th>)}</tr></thead><tbody>{loading ? <tr><td colSpan="9" className="px-5 py-12 text-center text-sm font-medium text-[#65719b]">Loading attendance report…</td></tr> : rows.length ? rows.map((row, index) => <tr key={`${row.username || "staff"}-${index}`} className="border-t border-[#edf0f6] hover:bg-[#fbfcff]"><td className="px-5 py-5 font-bold text-[#65719b]">{index + 1}</td><td className="px-5 py-5 font-bold text-[#17205e]">{row.username || "—"}</td><td className="px-5 py-5 text-[#17205e]">{row.email || "—"}</td><td className="px-5 py-5 text-[#17205e]">{row.mobile_number || "—"}</td><td className="px-5 py-5 font-semibold text-[#17205e]">{number(row.total_days)}</td><td className="px-5 py-5 text-[#17205e]">{number(row.full_days)}</td><td className="px-5 py-5 text-[#17205e]">{number(row.half_days)}</td><td className="px-5 py-5 text-[#17205e]">{number(row.absent_days)}</td><td className="px-5 py-5 font-semibold text-[#17205e]">{number(row.minutes)}</td></tr>) : <tr><td colSpan="9" className="px-5 py-12 text-center text-sm font-medium text-[#65719b]">No attendance records found for {periodLabel}.</td></tr>}</tbody></table></div></section>
  </div></main></div>;
}
