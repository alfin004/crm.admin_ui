import { ChevronsUpDown } from "lucide-react";
import Pagination from "../common/Pagination";
import UserRow from "./UserRow";

export default function UserTable({ users, page, perPage, onPageChange, onPerPageChange, onEdit, onDelete, totalCount, totalPages: serverTotalPages }) {
  const totalPages = Math.max(1, serverTotalPages || Math.ceil(totalCount / perPage));
  const from = totalCount === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, totalCount);

  return (
    <section className="table-shadow overflow-hidden rounded-lg border border-[#dfe6f2] bg-white">
      <div className="mobile-scrollbar overflow-x-auto">
        <table className="w-full min-w-[1050px] border-collapse text-left text-[#071154]">
          <thead>
            <tr className="bg-white text-sm font-extrabold">
              <th className="px-6 py-5">#</th>
              <th className="px-6 py-5">
                <span className="flex items-center gap-2">Username <ChevronsUpDown className="h-4 w-4 text-[#6572a7]" /></span>
              </th>
              <th className="px-6 py-5">Email ID</th>
              <th className="px-6 py-5">
                <span className="flex items-center gap-2">Mobile Number <ChevronsUpDown className="h-4 w-4 text-[#6572a7]" /></span>
              </th>
              <th className="px-6 py-5">Role</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <UserRow key={user.id} user={user} index={(page - 1) * perPage + index + 1} onEdit={onEdit} onDelete={onDelete} />
            ))}
            {users.length === 0 ? (
              <tr>
                <td className="px-6 py-12 text-center text-sm font-semibold text-[#6572a7]" colSpan={7}>
                  No users match the selected filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <Pagination
        page={page}
        totalPages={totalPages}
        perPage={perPage}
        onPageChange={onPageChange}
        onPerPageChange={onPerPageChange}
        showingFrom={from}
        showingTo={to}
        total={totalCount}
      />
    </section>
  );
}
