import {
  BarChart3,
  Box,
  CalendarDays,
  FileText,
  Home,
  ListChecks,
  Phone,
  ShieldCheck,
  User,
  UserCog,
  Users,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navigation = [
  { label: "Dashboard", icon: Home, path: "#" },
  { label: "Customers", icon: Users, path: "#" },
  { label: "Products", icon: Box, path: "#" },
  { label: "Customer Product Mapping", icon: Phone, path: "#" },
  { label: "Follow-Up Management", icon: ListChecks, path: "#" },
  { label: "Attendance", icon: CalendarDays, path: "/attendance" },
];

const reports = [
  { label: "Customer Reports", icon: FileText, path: "#" },
  { label: "Product Reports", icon: Box, path: "#" },
  { label: "Follow-Up Reports", icon: Phone, path: "#" },
  { label: "Attendance Reports", icon: CalendarDays, path: "#" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[292px] border-r border-[#dbe3f1] bg-white lg:flex lg:flex-col">
      <div className="flex h-20 items-center gap-3 px-6">
        <div className="grid h-11 w-11 place-items-center rounded-md bg-[#e9f1ff] text-[#0454ff]">
          <BarChart3 className="h-7 w-7" />
        </div>
        <div>
          <p className="text-[26px] font-extrabold leading-none text-[#0454ff]">idalWEALTH</p>
          <p className="mt-1 text-xs font-medium text-[#071154]">Advisory Private Limited</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-6">
        <SidebarSection title="UCRM" items={navigation} currentPath={location.pathname} />
        <SidebarSection title="REPORTS" items={reports} currentPath={location.pathname} className="mt-7" />
        <SidebarSection
          title="SETTINGS"
          className="mt-7"
          currentPath={location.pathname}
          items={[
            { label: "User Management", icon: User, path: "/users" },
            { label: "Roles & Permissions", icon: UserCog, path: "#" },
          ]}
        />
      </nav>

      <div className="px-6 pb-7 text-xs leading-6 text-[#2c376c]">
        <p>(c) 2026 idalWEALTH Advisory</p>
        <p>Private Limited. All rights reserved.</p>
      </div>
    </aside>
  );
}

function SidebarSection({ title, items, currentPath, className = "" }) {
  return (
    <section className={className}>
      <h2 className="mb-4 px-3 text-xs font-extrabold tracking-wide text-[#071154]">{title}</h2>
      <div className="space-y-1">
        {items.map(({ label, icon: Icon, path }) => {
          const active = path !== "#" && currentPath === path;
          return (
            <Link
              to={path === "#" ? currentPath : path}
              key={label}
              className={`flex h-12 items-center gap-4 rounded-md px-3 text-sm font-semibold transition ${active ? "bg-[#eaf1ff] text-[#0454ff]" : "text-[#071154] hover:bg-[#f4f7fd]"}`}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
              {label === "Roles & Permissions" ? <ShieldCheck className="ml-auto h-4 w-4 text-[#071154]" /> : null}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
