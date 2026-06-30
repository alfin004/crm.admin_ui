import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarDays, RefreshCcw } from "lucide-react";
import Button from "../components/common/Button";
import Select from "../components/common/Select";
import AttendanceCards from "../components/attendance/AttendanceCards";
import AttendanceHistoryTable from "../components/attendance/AttendanceHistoryTable";
import AttendanceStatus from "../components/attendance/AttendanceStatus";
import PunchButtons from "../components/attendance/PunchButtons";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import { attendanceApi } from "../lib/attendanceApi";
import {
  calculateAttendanceSummary,
  mapTodayAttendance,
  monthLabel,
  monthOptions,
  normalizeHistoryResponse,
  yearOptions,
} from "../lib/attendanceMapper";

const currentDate = new Date();

export default function Attendance() {
  const [today, setToday] = useState(null);
  const [history, setHistory] = useState([]);
  const [summaryRows, setSummaryRows] = useState([]);
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingToday, setLoadingToday] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState("");
  const [punching, setPunching] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const loadToday = useCallback(async () => {
    setLoadingToday(true);
    setError("");
    try {
      const response = await attendanceApi.today();
      setToday(mapTodayAttendance(response?.data || response || {}));
    } catch (err) {
      if (err.message !== "Unauthorized") setError(err.message);
    } finally {
      setLoadingToday(false);
    }
  }, [refreshKey]);

  const loadHistory = useCallback(async () => {
    setLoadingHistory(true);
    setError("");
    try {
      const response = await attendanceApi.history({ month, year, page, pageSize: perPage });
      const mapped = normalizeHistoryResponse(response);
      setHistory(mapped.rows);
      setTotalCount(mapped.totalCount);
      setTotalPages(mapped.totalPages || 1);
    } catch (err) {
      if (err.message !== "Unauthorized") setError(err.message);
    } finally {
      setLoadingHistory(false);
    }
  }, [month, page, perPage, refreshKey, year]);

  const loadSummaryRows = useCallback(async () => {
    try {
      const response = await attendanceApi.history({ month, year, page: 1, pageSize: 50 });
      const mapped = normalizeHistoryResponse(response);
      setSummaryRows(mapped.rows);
    } catch (err) {
      if (err.message !== "Unauthorized") setError(err.message);
    }
  }, [month, refreshKey, year]);

  useEffect(() => {
    loadToday();
  }, [loadToday]);

  useEffect(() => {
    loadHistory();
    loadSummaryRows();
  }, [loadHistory, loadSummaryRows]);

  const summary = useMemo(() => calculateAttendanceSummary(summaryRows, totalCount), [summaryRows, totalCount]);

  const handlePunchIn = async () => {
    setPunching("in");
    setError("");
    try {
      await attendanceApi.punchIn();
      setRefreshKey((current) => current + 1);
    } catch (err) {
      if (err.message !== "Unauthorized") setError(err.message);
    } finally {
      setPunching("");
    }
  };

  const handlePunchOut = async () => {
    setPunching("out");
    setError("");
    try {
      await attendanceApi.punchOut();
      setRefreshKey((current) => current + 1);
    } catch (err) {
      if (err.message !== "Unauthorized") setError(err.message);
    } finally {
      setPunching("");
    }
  };

  const resetFilters = () => {
    setMonth(currentDate.getMonth() + 1);
    setYear(currentDate.getFullYear());
    setPage(1);
  };

  return (
    <div className="app-shell min-h-screen bg-[#f8fbff]">
      <Sidebar />
      <Header />
      <main className="px-4 py-7 sm:px-6 lg:ml-[292px] lg:px-10">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-7 flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-[-0.01em] text-[#071154]">Attendance</h1>
              <p className="mt-3 text-sm font-medium text-[#17205e]">Track your attendance and manage your punch in/out.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-[180px_130px_auto]">
              <Select
                value={month}
                onChange={(event) => {
                  setMonth(Number(event.target.value));
                  setPage(1);
                }}
                options={monthOptions}
              />
              <Select
                value={year}
                onChange={(event) => {
                  setYear(Number(event.target.value));
                  setPage(1);
                }}
                options={yearOptions()}
              />
              <Button variant="secondary" icon={RefreshCcw} onClick={resetFilters}>
                Reset
              </Button>
            </div>
          </div>

          {error ? <p className="mb-5 rounded-md bg-[#ffe7e7] px-4 py-3 text-sm font-semibold text-[#d50d0d]">{error}</p> : null}
          {loadingToday ? <p className="mb-5 rounded-md bg-white px-4 py-3 text-sm font-semibold text-[#071154] table-shadow">Loading today's attendance...</p> : null}

          <AttendanceCards summary={summary} />

          <section className="soft-shadow mb-6 rounded-lg border border-[#dfe6f2] bg-white p-6">
            <div className="grid gap-8 xl:grid-cols-[1fr_420px] xl:items-center">
              <AttendanceStatus today={today} />
              <PunchButtons today={today} onPunchIn={handlePunchIn} onPunchOut={handlePunchOut} punching={punching} />
            </div>
          </section>

          <div className="mb-4 flex items-center gap-2 text-sm font-bold text-[#51608f]">
            <CalendarDays className="h-4 w-4 text-[#0454ff]" />
            <span>{monthLabel(month)} {year}</span>
          </div>

          <AttendanceHistoryTable
            rows={history}
            loading={loadingHistory}
            page={page}
            perPage={perPage}
            totalCount={totalCount}
            totalPages={totalPages}
            onPageChange={setPage}
            onPerPageChange={(value) => {
              setPerPage(value);
              setPage(1);
            }}
          />
        </div>
      </main>
    </div>
  );
}
