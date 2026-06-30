export const monthOptions = [
  { label: "January", value: 1 },
  { label: "February", value: 2 },
  { label: "March", value: 3 },
  { label: "April", value: 4 },
  { label: "May", value: 5 },
  { label: "June", value: 6 },
  { label: "July", value: 7 },
  { label: "August", value: 8 },
  { label: "September", value: 9 },
  { label: "October", value: 10 },
  { label: "November", value: 11 },
  { label: "December", value: 12 },
];

export function yearOptions(range = 4) {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: range + 1 }, (_, index) => {
    const year = currentYear - index;
    return { label: String(year), value: year };
  });
}

export function monthLabel(month) {
  return monthOptions.find((option) => Number(option.value) === Number(month))?.label || "";
}

export function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatTime(value) {
  if (!value) return "-";
  const normalized = String(value).trim();
  if (!normalized || normalized === "-") return "-";

  const date = normalized.includes("T") ? new Date(normalized) : new Date(`2000-01-01T${normalized}`);
  if (!Number.isNaN(date.getTime())) {
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  }

  return normalized;
}

export function dayName(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-US", { weekday: "long" });
}

export function formatWorkingDuration(value, punchIn, punchOut) {
  if (value === null || value === undefined || value === "") {
    return durationFromPunches(punchIn, punchOut);
  }

  if (typeof value === "number") return minutesToDuration(value);

  const normalized = String(value).trim();
  if (!normalized || normalized === "-") return durationFromPunches(punchIn, punchOut);
  if (/^\d+(\.\d+)?$/.test(normalized)) return minutesToDuration(Number(normalized));
  if (normalized.includes(":")) {
    const [hours = "0", minutes = "0"] = normalized.split(":");
    return minutesToDuration(Number(hours) * 60 + Number(minutes));
  }
  return normalized;
}

export function statusBadge(status = "") {
  const normalized = String(status || "").toLowerCase();
  if (normalized.includes("full")) return "text-[#08a34d]";
  if (normalized.includes("half")) return "text-[#ff7a00]";
  if (normalized.includes("present")) return "text-[#08a34d]";
  if (normalized.includes("absent")) return "text-[#d50d0d]";
  if (normalized.includes("week") || normalized.includes("off") || normalized.includes("holiday")) return "text-[#7180ad]";
  return "text-[#071154]";
}

export function mapAttendanceRecord(record = {}) {
  const date = record.attendance_date || record.date || record.created_at || "";
  const punchIn = record.punch_in || record.punch_in_time || record.check_in || "";
  const punchOut = record.punch_out || record.punch_out_time || record.check_out || "";
  const status = record.status || record.attendance_status || record.day_status || "-";
  const dayType = record.day_type || record.type || inferDayType(status);

  return {
    id: record.id || `${date}-${punchIn || "in"}-${punchOut || "out"}`,
    date,
    displayDate: formatDate(date),
    day: record.day || dayName(date),
    punchIn,
    punchOut,
    displayPunchIn: formatTime(punchIn),
    displayPunchOut: formatTime(punchOut),
    workingDuration: record.working_duration || record.total_duration || record.working_hours || record.total_hours || record.duration,
    displayWorkingDuration: formatWorkingDuration(record.working_duration || record.total_duration || record.working_hours || record.total_hours || record.duration, punchIn, punchOut),
    status,
    dayType,
    remarks: record.remarks || record.remark || "-",
  };
}

export function mapTodayAttendance(record = {}) {
  return mapAttendanceRecord(record);
}

export function calculateAttendanceSummary(records = [], totalCount) {
  return records.reduce(
    (summary, record) => {
      const status = String(record.status || "").toLowerCase();
      const dayType = String(record.dayType || "").toLowerCase();
      const isWeeklyOff = status.includes("week") || dayType.includes("week") || status.includes("holiday");
      const isHalfDay = status.includes("half") || dayType.includes("half");
      const isFullDay = status.includes("full") || dayType.includes("full");
      const isPresent = status.includes("present") || isHalfDay || isFullDay;

      return {
        totalWorkingDays: summary.totalWorkingDays + (isWeeklyOff ? 0 : 1),
        presentDays: summary.presentDays + (isPresent ? (isHalfDay ? 0.5 : 1) : 0),
        fullDays: summary.fullDays + (isFullDay ? 1 : 0),
        halfDays: summary.halfDays + (isHalfDay ? 1 : 0),
      };
    },
    { totalWorkingDays: records.length ? 0 : Number(totalCount) || 0, presentDays: 0, fullDays: 0, halfDays: 0 },
  );
}

export function normalizeHistoryResponse(response) {
  const payload = Array.isArray(response) ? response : response?.data || response;
  const items = Array.isArray(payload) ? payload : payload?.items || payload?.results || payload?.records || [];
  const totalCount = response?.total_count ?? response?.totalCount ?? response?.count ?? items.length;
  const totalPages = response?.total_pages ?? response?.totalPages ?? Math.max(1, Math.ceil(totalCount / Math.max(items.length, 1)));

  return {
    rows: items.map(mapAttendanceRecord),
    totalCount,
    totalPages,
  };
}

function durationFromPunches(punchIn, punchOut) {
  if (!punchIn || !punchOut) return "-";
  const start = new Date(String(punchIn).includes("T") ? punchIn : `2000-01-01T${punchIn}`);
  const end = new Date(String(punchOut).includes("T") ? punchOut : `2000-01-01T${punchOut}`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) return "-";
  return minutesToDuration(Math.round((end - start) / 60000));
}

function minutesToDuration(value) {
  if (!Number.isFinite(value) || value <= 0) return "-";
  const hours = Math.floor(value / 60);
  const minutes = Math.round(value % 60);
  if (!hours) return `${minutes}m`;
  return minutes ? `${hours}h ${minutes}m` : `${hours}h`;
}

function inferDayType(status = "") {
  const normalized = String(status).toLowerCase();
  if (normalized.includes("half")) return "Half Day";
  if (normalized.includes("full")) return "Full Day";
  if (normalized.includes("week")) return "Weekly Off";
  return "-";
}
