import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarDays, Download, FileText, Filter } from "lucide-react";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Pagination from "../components/common/Pagination";
import Select from "../components/common/Select";
import { dashboardApi, reportsApi } from "../lib/api";

const reportInfo = {
  customers: { title: "Customer Reports", description: "View and analyze customer reports based on different filters.", itemLabel: "customers", endpoint: "customers", exportPath: "/reports/customers/export" },
  products: { title: "Product Reports", description: "View and analyze product related reports.", itemLabel: "products", endpoint: "products", exportPath: "/reports/products/export" },
  followups: { title: "Follow-Up Reports", description: "View and analyze follow-up related reports.", itemLabel: "customers", endpoint: "followUps", exportPath: "/reports/follow-ups/export" },
};

const emptyFilters = { district: "", staff_id: "", status: "", is_active: "", product_id: "", registration_date_from: "", registration_date_to: "", purchase_date_from: "", purchase_date_to: "", follow_up_status: "", date_from: "", date_to: "" };
const unwrap = (response) => response?.data?.items || response?.items || response?.data || (Array.isArray(response) ? response : []);
const totalOf = (response, rows) => response?.data?.total ?? response?.total ?? rows.length;
const dateText = (value) => value ? new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const filenameFrom = (header, fallback) => header?.match(/filename[^=]*=\s*(?:UTF-8''|\"?)([^;\"]+)/i)?.[1]?.replaceAll('"', "") || fallback;

export default function Reports({ type }) {
  const info = reportInfo[type];
  const [filters, setFilters] = useState(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState(emptyFilters);
  const [staff, setStaff] = useState([]);
  const [products, setProducts] = useState([]);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");

  const setFilter = (key) => (event) => setFilters((current) => ({ ...current, [key]: event.target.value }));
  const params = useMemo(() => ({ ...appliedFilters, ...(appliedFilters.is_active === "" ? {} : { is_active: appliedFilters.is_active === "true" }), limit: perPage, offset: (page - 1) * perPage }), [appliedFilters, page, perPage]);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const response = await reportsApi[info.endpoint](params);
      const items = unwrap(response);
      setRows(Array.isArray(items) ? items : []); setTotal(totalOf(response, Array.isArray(items) ? items : []));
    } catch (err) { if (err.message !== "Unauthorized") setError(err.message); setRows([]); setTotal(0); }
    finally { setLoading(false); }
  }, [info.endpoint, params]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    let active = true;
    Promise.all([dashboardApi.staff.dropdown(), dashboardApi.products.list({ limit: 100, offset: 0 })])
      .then(([staffResponse, productResponse]) => {
        if (!active) return;
        setStaff(normalizeStaff(staffResponse));
        const productRows = unwrap(productResponse); setProducts(Array.isArray(productRows) ? productRows : []);
      })
      .catch((err) => { if (active && err.message !== "Unauthorized") setError((message) => message || `Unable to load report filters: ${err.message}`); });
    return () => { active = false; };
  }, []);

  const generate = () => { setPage(1); setAppliedFilters(filters); };
  const exportReport = async () => {
    setExporting(true); setError("");
    try {
      const exportParams = { ...appliedFilters, ...(appliedFilters.is_active === "" ? {} : { is_active: appliedFilters.is_active === "true" }) };
      const { blob, contentDisposition, contentType } = await reportsApi.export(info.exportPath, exportParams);
      const fallback = `${type}-report${contentType?.includes("json") ? ".json" : ".xlsx"}`;
      const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = filenameFrom(contentDisposition, fallback); link.click(); URL.revokeObjectURL(link.href);
    } catch (err) { if (err.message !== "Unauthorized") setError(err.message); }
    finally { setExporting(false); }
  };

  const totalPages = Math.max(1, Math.ceil(total / perPage));
  return <div className="app-shell min-h-screen bg-[#f8fbff]"><Sidebar /><Header /><main className="min-w-0 px-4 py-7 sm:px-6 lg:ml-[292px] lg:px-10"><div className="mx-auto max-w-[1500px]">
    <div className="mb-7 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between"><div><h1 className="text-3xl font-extrabold tracking-[-0.01em] text-[#071154]">{info.title}</h1><p className="mt-2 text-sm font-medium text-[#17205e]">{info.description}</p></div><div className="flex flex-col gap-3 sm:flex-row"><Button icon={FileText} onClick={generate} loading={loading}>Generate Report</Button><Button className="bg-[#00a869] text-white shadow-[0_8px_18px_rgba(0,168,105,0.2)] hover:bg-[#008a56]" icon={Download} onClick={exportReport} loading={exporting}>Download Excel</Button></div></div>
    <section className="soft-shadow mb-6 rounded-lg border border-[#dfe6f2] bg-white p-5 sm:p-6"><Filters type={type} filters={filters} setFilter={setFilter} staff={staff} products={products} onGenerate={generate} loading={loading} /></section>
    {error ? <p className="mb-5 rounded-md bg-[#ffe7e7] px-4 py-3 text-sm font-semibold text-[#d50d0d]">{error}</p> : null}
    <section className="table-shadow overflow-hidden rounded-lg border border-[#dfe6f2] bg-white"><div className="mobile-scrollbar overflow-x-auto"><ReportTable type={type} rows={rows} loading={loading} offset={(page - 1) * perPage} /></div><Pagination page={page} totalPages={totalPages} perPage={perPage} onPageChange={setPage} onPerPageChange={(value) => { setPerPage(value); setPage(1); }} showingFrom={total ? (page - 1) * perPage + 1 : 0} showingTo={Math.min(page * perPage, total)} total={total} itemLabel={info.itemLabel} /></section>
  </div></main></div>;
}

function Filters({ type, filters, setFilter, staff, products, onGenerate, loading }) {
  const productSelect = <Select label="Product" value={filters.product_id} onChange={setFilter("product_id")} options={[{ label: "All Products", value: "" }, ...products.map((item) => ({ label: item.product_name || item.name || item.product_code, value: item.id || item.product_id }))]} />;
  const staffSelect = <Select label="Staff" value={filters.staff_id} onChange={setFilter("staff_id")} options={[{ label: "All Staff", value: "" }, ...staff]} />;
  const date = (label, key) => <Input label={label} type="date" value={filters[key]} onChange={setFilter(key)} icon={CalendarDays} />;
  if (type === "customers") return <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">{<Input label="District" value={filters.district} onChange={setFilter("district")} placeholder="All districts" />}{staffSelect}{<Input label="Status" value={filters.status} onChange={setFilter("status")} placeholder="All statuses" />}{<Select label="Active / Inactive" value={filters.is_active} onChange={setFilter("is_active")} options={[{ label: "All", value: "" }, { label: "Active", value: "true" }, { label: "Inactive", value: "false" }]} />}{productSelect}{date("Registration Date From", "registration_date_from")}{date("Registration Date To", "registration_date_to")}<div className="flex items-end"><Button className="w-full" icon={Filter} onClick={onGenerate} loading={loading}>Generate Report</Button></div></div>;
  if (type === "products") return <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">{productSelect}{date("Purchase Date From", "purchase_date_from")}{date("Purchase Date To", "purchase_date_to")}<div className="flex items-end"><Button className="w-full" icon={Filter} onClick={onGenerate} loading={loading}>Generate Report</Button></div></div>;
  return <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">{productSelect}{<Input label="Follow-Up Status" value={filters.follow_up_status} onChange={setFilter("follow_up_status")} placeholder="All statuses" />}{staffSelect}{date("Date From", "date_from")}{date("Date To", "date_to")}<div className="flex items-end"><Button className="w-full" icon={Filter} onClick={onGenerate} loading={loading}>Generate Report</Button></div></div>;
}

function ReportTable({ type, rows, loading, offset }) {
  const headings = type === "customers" ? ["#", "Customer Name", "Mobile Number", "Email ID", "District", "Assigned Staff", "Status", "Active / Inactive", "Registered On"] : type === "products" ? ["#", "Product Code", "Product Name", "Product Description", "Total Customers", "Last Purchase Date"] : ["#", "Customer Name", "Mobile Number", "Follow-Up Status", "Assigned Staff", "Latest Remarks", "Remarks Date"];
  return <table className="w-full min-w-[980px] text-left text-sm"><thead className="border-b border-[#e1e7f2] bg-[#fbfcff]"><tr>{headings.map((heading) => <th key={heading} className="whitespace-nowrap px-5 py-4 text-xs font-bold text-[#27325d]">{heading}</th>)}</tr></thead><tbody>{loading ? <tr><td colSpan={headings.length} className="px-5 py-12 text-center text-[#56618c]">Loading report…</td></tr> : rows.length ? rows.map((row, index) => <ReportRow key={row.id || row.customer_id || index} type={type} row={row} number={offset + index + 1} />) : <tr><td colSpan={headings.length} className="px-5 py-12 text-center text-[#56618c]">No report records found.</td></tr>}</tbody></table>;
}

function ReportRow({ type, row, number }) {
  const cell = "whitespace-nowrap px-5 py-5";
  if (type === "customers") return <tr className="border-b border-[#edf0f6]"><td className={cell}>{number}</td><td className={cell}>{row.name || [row.first_name, row.last_name].filter(Boolean).join(" ") || "—"}</td><td className={cell}>{row.mobile_number || "—"}</td><td className={cell}>{row.email || "—"}</td><td className={cell}>{row.district || "—"}</td><td className={cell}>{row.assigned_staff_name || "—"}</td><td className={cell}>{row.status || "—"}</td><td className={cell}>{row.is_active === false ? "Inactive" : "Active"}</td><td className={cell}>{dateText(row.registered_on)}</td></tr>;
  if (type === "products") return <tr className="border-b border-[#edf0f6]"><td className={cell}>{number}</td><td className={cell}>{row.product_code || "—"}</td><td className={cell}>{row.product_name || "—"}</td><td className="max-w-sm px-5 py-5">{row.product_description || "—"}</td><td className={cell}>{row.total_customers ?? 0}</td><td className={cell}>{dateText(row.last_purchase_date)}</td></tr>;
  return <tr className="border-b border-[#edf0f6]"><td className={cell}>{number}</td><td className={cell}>{row.name || "—"}</td><td className={cell}>{row.mobile_number || "—"}</td><td className={cell}>{row.status || "—"}</td><td className={cell}>{row.assigned_staff_name || "—"}</td><td className="min-w-64 px-5 py-5">{row.latest_remarks || "—"}</td><td className={cell}>{dateText(row.remarks_date)}</td></tr>;
}

function normalizeStaff(response) {
  const rows = unwrap(response); if (!Array.isArray(rows)) return [];
  return rows.map((item) => ({ value: item.id || item.staff_id || item.uuid, label: item.name || item.full_name || item.username || item.staff_name })).filter((item) => item.value && item.label);
}
