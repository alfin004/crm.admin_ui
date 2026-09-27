import { useCallback, useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Clock3, Mail, Phone, RefreshCw, ShieldCheck, Trophy, UserRound } from "lucide-react";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import { useAuth } from "../context/AuthContext";
import { dashboardApi } from "../lib/api";

const rowsFrom = (response) => {
  const rows = response?.data?.items || response?.data || response?.items || response;
  return Array.isArray(rows) ? rows : [];
};

const formatLastLogin = (value) => {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(date);
};

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [sortBy, setSortBy] = useState("customer");
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLeaderboard = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await dashboardApi.staffPerformance(sortBy);
      setStaff(rowsFrom(response));
    } catch (err) {
      if (err.message !== "Unauthorized") setError(err.message || "Unable to load the leaderboard.");
      setStaff([]);
    } finally {
      setLoading(false);
    }
  }, [sortBy]);

  useEffect(() => { loadLeaderboard(); }, [loadLeaderboard]);

  const changeSort = (value) => {
    if (value !== sortBy) setSortBy(value);
  };

  return (
    <div className="app-shell min-h-screen bg-[#f8fbff]">
      <Sidebar />
      <Header />
      <main className="min-w-0 px-4 py-7 sm:px-6 lg:ml-[292px] lg:px-10">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-7">
            <p className="mb-2 text-sm font-bold text-[#0454ff]">OVERVIEW</p>
            <h1 className="text-3xl font-extrabold tracking-[-0.01em] text-[#071154]">Dashboard</h1>
            <p className="mt-2 text-sm font-medium text-[#4b5783]">Your account details and team performance at a glance.</p>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <PersonalDetails user={currentUser} />
            <Leaderboard staff={staff} sortBy={sortBy} onSort={changeSort} onRefresh={loadLeaderboard} loading={loading} error={error} />
          </div>
        </div>
      </main>
    </div>
  );
}

function PersonalDetails({ user }) {
  const details = [
    { label: "Email Address", value: user?.email || "Not available", icon: Mail },
    { label: "Phone Number", value: user?.mobile_number || "Not available", icon: Phone },
    { label: "Role", value: readableRole(user?.role), icon: ShieldCheck },
    { label: "Last Sign-In", value: formatLastLogin(user?.last_login_at), icon: Clock3 },
  ];
  const active = user?.is_active;
  const online = user?.current_login_status;
  return (
    <section className="soft-shadow min-w-0 rounded-xl border border-[#dfe6f2] bg-white p-5 sm:p-7">
      <div className="flex items-start gap-4 border-b border-[#e8edf5] pb-6">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#e9f1ff] text-[#0454ff]"><UserRound className="h-7 w-7" /></div>
        <div className="min-w-0">
          <p className="text-xs font-extrabold tracking-wide text-[#65719b]">PERSONAL DETAILS</p>
          <h2 className="mt-1 truncate text-xl font-extrabold text-[#071154]">{user?.username || "Your profile"}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <StatusBadge label={active ? "Active Account" : "Inactive Account"} success={Boolean(active)} />
            <StatusBadge label={online ? "Currently Signed In" : "Signed Out"} success={Boolean(online)} />
          </div>
        </div>
      </div>
      <dl className="mt-2 divide-y divide-[#edf0f6]">
        {details.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex items-center gap-4 py-4">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-[#f2f6ff] text-[#0454ff]"><Icon className="h-4 w-4" /></span>
            <div className="min-w-0"><dt className="text-xs font-bold text-[#65719b]">{label}</dt><dd className="mt-1 break-words text-sm font-semibold text-[#17205e]">{value}</dd></div>
          </div>
        ))}
      </dl>
    </section>
  );
}

function Leaderboard({ staff, sortBy, onSort, onRefresh, loading, error }) {
  return (
    <section className="soft-shadow min-w-0 overflow-hidden rounded-xl border border-[#dfe6f2] bg-white">
      <div className="flex flex-col gap-4 border-b border-[#e8edf5] p-5 sm:flex-row sm:items-start sm:justify-between sm:p-7">
        <div><div className="flex items-center gap-2 text-[#0454ff]"><Trophy className="h-5 w-5" /><p className="text-xs font-extrabold tracking-wide">LEADERBOARD</p></div><h2 className="mt-2 text-xl font-extrabold text-[#071154]">Staff Performance</h2><p className="mt-1 text-sm font-medium text-[#4b5783]">Ranked by {sortBy === "customer" ? "customers managed" : "follow-ups completed"}.</p></div>
        <button type="button" onClick={onRefresh} disabled={loading} className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#d8e0f0] px-3 text-sm font-bold text-[#0454ff] transition hover:bg-[#f2f6ff] disabled:cursor-not-allowed disabled:opacity-60"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />Refresh</button>
      </div>
      {error ? <p className="mx-5 mt-5 rounded-md bg-[#fff0f0] px-4 py-3 text-sm font-semibold text-[#c62020] sm:mx-7">{error}</p> : null}
      <div className="mobile-scrollbar overflow-x-auto"><table className="w-full min-w-[530px] text-left text-sm"><thead className="bg-[#fbfcff]"><tr><th className="w-16 px-5 py-4 text-xs font-bold text-[#27325d] sm:px-7">Rank</th><th className="px-5 py-4 text-xs font-bold text-[#27325d]">Team Member</th><SortHeading label="Customers Managed" active={sortBy === "customer"} onClick={() => onSort("customer")} /><SortHeading label="Follow-Ups Completed" active={sortBy === "follow_up"} onClick={() => onSort("follow_up")} /></tr></thead><tbody>{loading ? <tr><td colSpan="4" className="px-5 py-12 text-center text-sm font-medium text-[#65719b]">Loading staff performance…</td></tr> : staff.length ? staff.map((member, index) => <tr key={`${member.staff_name || "staff"}-${index}`} className="border-t border-[#edf0f6] transition hover:bg-[#fbfcff]"><td className="px-5 py-5 font-bold text-[#65719b] sm:px-7">{index + 1}</td><td className="px-5 py-5 font-bold text-[#17205e]">{member.staff_name || "Unnamed team member"}</td><td className="px-5 py-5 font-semibold text-[#17205e]">{member.customer_count ?? 0}</td><td className="px-5 py-5 font-semibold text-[#17205e]">{member.follow_up_count ?? 0}</td></tr>) : <tr><td colSpan="4" className="px-5 py-12 text-center text-sm font-medium text-[#65719b]">No staff performance records found.</td></tr>}</tbody></table></div>
    </section>
  );
}

function SortHeading({ label, active, onClick }) {
  return <th className="px-5 py-3"><button type="button" onClick={onClick} className={`inline-flex items-center gap-1.5 text-left text-xs font-bold transition ${active ? "text-[#0454ff]" : "text-[#27325d] hover:text-[#0454ff]"}`}>{label}{active ? <ArrowDown className="h-3.5 w-3.5" /> : <ArrowUp className="h-3.5 w-3.5 text-[#9ba6c5]" />}</button></th>;
}

function StatusBadge({ label, success }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${success ? "bg-[#e1f8ec] text-[#087b3d]" : "bg-[#fff2df] text-[#ad6800]"}`}>{label}</span>;
}

function readableRole(value) {
  if (!value) return "Not available";
  return String(value).toLowerCase().split("_").map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");
}
