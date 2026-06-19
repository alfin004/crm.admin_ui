import { useCallback, useEffect, useState } from "react";
import { Plus, RefreshCcw, Search } from "lucide-react";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Select from "../components/common/Select";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import AddUserModal from "../components/users/AddUserModal";
import EditUserModal from "../components/users/EditUserModal";
import RoleCards from "../components/users/RoleCards";
import UserTable from "../components/users/UserTable";
import { useAuth } from "../context/AuthContext";
import { usersApi } from "../lib/api";
import { apiRoleOptions, formFromUser, formToCreatePayload, formToUpdatePayload, mapApiUser, statusOptions } from "../lib/userMapper";

const emptyForm = {
  username: "",
  email: "",
  mobile: "",
  role: "",
  status: "true",
};

export default function UserManagement() {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resetSubmitting, setResetSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [addForm, setAddForm] = useState(emptyForm);
  const [editForm, setEditForm] = useState(emptyForm);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await usersApi.list({
        roles: role,
        search: search.trim(),
        isActive: status,
        limit: perPage,
        offset: (page - 1) * perPage,
      });
      setUsers(response.data.map(mapApiUser));
      setTotalCount(response.total_count);
      setTotalPages(response.total_pages || 1);
    } catch (err) {
      if (err.message !== "Unauthorized") setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, perPage, refreshKey, role, search, status]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const resetFilters = () => {
    setSearch("");
    setRole("");
    setStatus("");
    setPage(1);
  };

  const handleAddSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await usersApi.create(formToCreatePayload(addForm, currentUser?.id));
      setAddForm(emptyForm);
      setAddOpen(false);
      setPage(1);
      setRefreshKey((current) => current + 1);
    } catch (err) {
      if (err.message !== "Unauthorized") setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (user) => {
    setEditForm(formFromUser(user));
    setEditOpen(true);
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await usersApi.update(editForm.id, formToUpdatePayload(editForm, currentUser?.id));
      setEditOpen(false);
      setRefreshKey((current) => current + 1);
    } catch (err) {
      if (err.message !== "Unauthorized") setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    setResetSubmitting(true);
    setError("");
    try {
      await usersApi.resetPassword(editForm.id);
      setEditOpen(false);
    } catch (err) {
      if (err.message !== "Unauthorized") setError(err.message);
    } finally {
      setResetSubmitting(false);
    }
  };

  const handleDelete = async (user) => {
    const confirmed = window.confirm(`Delete ${user.username}?`);
    if (!confirmed) return;

    setError("");
    try {
      await usersApi.delete(user.id);
      setRefreshKey((current) => current + 1);
    } catch (err) {
      if (err.message !== "Unauthorized") setError(err.message);
    }
  };

  return (
    <div className="app-shell min-h-screen bg-[#f8fbff]">
      <Sidebar />
      <Header />
      <main className="px-4 py-7 sm:px-6 lg:ml-[292px] lg:px-10">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-[-0.01em] text-[#071154]">User Management</h1>
              <p className="mt-3 text-sm font-medium text-[#17205e]">Manage system users, roles, and access permissions.</p>
            </div>
            <Button icon={Plus} className="w-full sm:w-auto" onClick={() => setAddOpen(true)}>
              Add New User
            </Button>
          </div>

          <section className="soft-shadow mb-6 rounded-lg border border-[#dfe6f2] bg-white p-6">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr_1fr_auto] lg:items-end">
              <Input
                label="Search Users"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search by name, email or mobile..."
                icon={Search}
              />
              <Select
                label="Role"
                value={role}
                onChange={(event) => {
                  setRole(event.target.value);
                  setPage(1);
                }}
                options={[{ label: "All Roles", value: "" }, ...apiRoleOptions]}
              />
              <Select
                label="Status"
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value);
                  setPage(1);
                }}
                options={[{ label: "All Status", value: "" }, ...statusOptions]}
              />
              <Button variant="secondary" icon={RefreshCcw} className="lg:w-36" onClick={resetFilters}>
                Reset
              </Button>
            </div>
          </section>

          {error ? <p className="mb-5 rounded-md bg-[#ffe7e7] px-4 py-3 text-sm font-semibold text-[#d50d0d]">{error}</p> : null}
          {loading ? <p className="mb-5 rounded-md bg-white px-4 py-3 text-sm font-semibold text-[#071154] table-shadow">Loading users...</p> : null}

          <UserTable
            users={users}
            page={page}
            perPage={perPage}
            totalCount={totalCount}
            totalPages={totalPages}
            onPageChange={setPage}
            onPerPageChange={(value) => {
              setPerPage(value);
              setPage(1);
            }}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <div className="mt-6">
            <RoleCards />
          </div>
        </div>
      </main>

      <AddUserModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        form={addForm}
        onChange={(field, value) => setAddForm((current) => ({ ...current, [field]: value }))}
        onSubmit={handleAddSubmit}
        submitting={submitting}
      />
      <EditUserModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        form={editForm}
        onChange={(field, value) => setEditForm((current) => ({ ...current, [field]: value }))}
        onSubmit={handleEditSubmit}
        onResetPassword={handleResetPassword}
        submitting={submitting}
        resetSubmitting={resetSubmitting}
      />
    </div>
  );
}
