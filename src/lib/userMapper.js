export const apiRoleOptions = [
  { label: "Super Admin", value: "ADMIN" },
  { label: "Manager", value: "MANAGER" },
  { label: "Staff", value: "USER" },
];

export const statusOptions = [
  { label: "Active", value: "true" },
  { label: "Inactive", value: "false" },
];

export function roleLabel(role) {
  return apiRoleOptions.find((option) => option.value === role)?.label || role;
}

export function statusLabel(isActive) {
  return isActive ? "Active" : "Inactive";
}

export function mapApiUser(user) {
  return {
    id: user.id,
    username: user.username || "",
    email: user.email || "",
    mobile: String(user.mobile_number || ""),
    role: roleLabel(user.role),
    roleValue: user.role,
    status: statusLabel(user.is_active),
    isActive: user.is_active,
    currentLoginStatus: user.current_login_status,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
    createdBy: user.created_by,
    updatedBy: user.updated_by,
    avatarColor: user.role === "ADMIN" ? "blue" : user.role === "MANAGER" ? "amber" : "green",
  };
}

export function formFromUser(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    mobile: String(user.mobile || ""),
    role: user.roleValue,
    status: String(user.isActive),
  };
}

export function formToCreatePayload(form, currentUserId) {
  return {
    username: form.username,
    email: form.email,
    mobile_number: form.mobile,
    role: form.role,
    is_active: form.status === "true",
    created_by: currentUserId || null,
  };
}

export function formToUpdatePayload(form, currentUserId) {
  return {
    email: form.email,
    mobile_number: form.mobile,
    role: form.role,
    is_active: form.status === "true",
    updated_by: currentUserId || null,
  };
}
