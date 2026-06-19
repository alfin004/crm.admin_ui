import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Edit3, Eye, MoreVertical } from "lucide-react";
import Badge from "../common/Badge";
import { initialsFor } from "../../data/users";

const avatarStyles = {
  blue: "bg-[#e7f0ff] text-[#0454ff]",
  amber: "bg-[#fff1d8] text-[#b86c00]",
  green: "bg-[#ddf8e9] text-[#087b3d]",
  violet: "bg-[#eee8ff] text-[#5c40b5]",
  orange: "bg-[#ffe9db] text-[#c65d22]",
  sky: "bg-[#e3f2ff] text-[#0d6ac8]",
  rose: "bg-[#ffe5ed] text-[#c40b3c]",
  indigo: "bg-[#e8ecff] text-[#3345b6]",
  emerald: "bg-[#dcf9ef] text-[#057a55]",
  cyan: "bg-[#dff8ff] text-[#08758b]",
  pink: "bg-[#ffe7f5] text-[#b91b72]",
  lime: "bg-[#eefbd6] text-[#5c8707]",
  purple: "bg-[#f0e5ff] text-[#7a2cd8]",
  red: "bg-[#ffe5e5] text-[#be123c]",
  yellow: "bg-[#fff7cf] text-[#996d00]",
  teal: "bg-[#defcf5] text-[#0f766e]",
  fuchsia: "bg-[#fde7ff] text-[#a21caf]",
  slate: "bg-[#edf1f7] text-[#475569]",
};

export default function UserRow({ user, index, onEdit, onDelete }) {
  const mobile = String(user.mobile || "");
  const formattedMobile = mobile ? `+91 ${mobile.replace(/(\d{5})(\d{5})/, "$1 $2")}` : "-";

  return (
    <tr className="border-t border-[#e1e7f2] bg-white hover:bg-[#fbfdff]">
      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">{index}</td>
      <td className="min-w-[190px] px-6 py-4">
        <div className="flex items-center gap-4">
          <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-xs font-bold ${avatarStyles[user.avatarColor] || avatarStyles.blue}`}>
            {initialsFor(user.username)}
          </span>
          <span className="text-sm font-semibold">{user.username}</span>
        </div>
      </td>
      <td className="min-w-[250px] px-6 py-4 text-sm font-medium">{user.email}</td>
      <td className="min-w-[190px] px-6 py-4 text-sm font-medium">{formattedMobile}</td>
      <td className="px-6 py-4"><Badge>{user.role}</Badge></td>
      <td className="px-6 py-4"><Badge type="status">{user.status}</Badge></td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <ActionButton label="View user" icon={Eye} />
          <ActionButton label="Edit user" icon={Edit3} onClick={() => onEdit(user)} />
          <Menu as="div" className="relative">
            <MenuButton className="grid h-10 w-10 place-items-center rounded-md border border-[#d8e0f0] bg-white text-[#0454ff] transition hover:bg-[#f2f6ff]" aria-label="More options">
              <MoreVertical className="h-4 w-4" />
            </MenuButton>
            <MenuItems className="absolute right-0 z-10 mt-2 w-36 rounded-md border border-[#d8e0f0] bg-white p-1 text-sm font-semibold text-[#071154] shadow-lg focus:outline-none">
              <MenuItem>
                <button type="button" className="w-full rounded px-3 py-2 text-left text-[#d50d0d] data-[focus]:bg-[#ffe7e7]" onClick={() => onDelete(user)}>
                  Delete
                </button>
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>
      </td>
    </tr>
  );
}

function ActionButton({ label, icon: Icon, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid h-10 w-10 place-items-center rounded-md border border-[#d8e0f0] bg-white text-[#0454ff] transition hover:bg-[#f2f6ff]"
      aria-label={label}
      title={label}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
