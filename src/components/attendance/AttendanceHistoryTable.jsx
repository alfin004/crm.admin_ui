import Pagination from "../common/Pagination";
import { statusBadge } from "../../lib/attendanceMapper";

export default function AttendanceHistoryTable({ rows, loading, page, perPage, totalCount, totalPages, onPageChange, onPerPageChange }) {
  const pages = Math.max(1, totalPages || Math.ceil(totalCount / perPage));
  const from = totalCount === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, totalCount);

  return (
    <section className="table-shadow overflow-hidden rounded-lg border border-[#dfe6f2] bg-white">
      <div className="px-6 py-5">
        <h2 className="text-xl font-extrabold text-[#071154]">Attendance History</h2>
      </div>
      <div className="mobile-scrollbar overflow-x-auto px-6 pb-5">
        <table className="w-full min-w-[1080px] border-collapse overflow-hidden rounded-md text-left text-[#071154]">
          <thead>
            <tr className="border border-[#e1e7f2] bg-white text-sm font-extrabold">
              <th className="px-4 py-4">Date</th>
              <th className="px-4 py-4">Day</th>
              <th className="px-4 py-4">Punch In</th>
              <th className="px-4 py-4">Punch Out</th>
              <th className="px-4 py-4">Working Hours</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">Remarks</th>
            </tr>
          </thead>
          <tbody className="border-x border-[#e1e7f2]">
            {loading ? (
              <tr>
                <td className="px-4 py-12 text-center text-sm font-semibold text-[#6572a7]" colSpan={7}>
                  Loading attendance history...
                </td>
              </tr>
            ) : null}
            {!loading && rows.map((row) => (
              <tr key={row.id} className="border-t border-[#e1e7f2] text-sm font-semibold">
                <td className="px-4 py-4">{row.displayDate}</td>
                <td className="px-4 py-4">{row.day}</td>
                <td className="px-4 py-4">{row.displayPunchIn}</td>
                <td className="px-4 py-4">{row.displayPunchOut}</td>
                <td className="px-4 py-4">{row.displayWorkingDuration}</td>
                <td className={`px-4 py-4 font-extrabold ${statusBadge(row.status)}`}>{row.status}</td>
                <td className="px-4 py-4">{row.remarks}</td>
              </tr>
            ))}
            {!loading && rows.length === 0 ? (
              <tr>
                <td className="border-t border-[#e1e7f2] px-4 py-12 text-center text-sm font-semibold text-[#6572a7]" colSpan={7}>
                  No attendance records found for the selected month.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <Pagination
        page={page}
        totalPages={pages}
        perPage={perPage}
        onPageChange={onPageChange}
        onPerPageChange={onPerPageChange}
        showingFrom={from}
        showingTo={to}
        total={totalCount}
        itemLabel="records"
      />
    </section>
  );
}
