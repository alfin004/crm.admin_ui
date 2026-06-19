export const roles = ["Super Admin", "Manager", "Staff"];
export const statuses = ["Active", "Inactive"];

export const users = [
  { id: 1, username: "superadmin", email: "admin@idalwealth.com", mobile: "9876543210", role: "Super Admin", status: "Active", avatarColor: "blue" },
  { id: 2, username: "manager01", email: "manager01@idalwealth.com", mobile: "9123456789", role: "Manager", status: "Active", avatarColor: "amber" },
  { id: 3, username: "staff01", email: "staff01@idalwealth.com", mobile: "9988776655", role: "Staff", status: "Active", avatarColor: "green" },
  { id: 4, username: "staff02", email: "staff02@idalwealth.com", mobile: "8899012345", role: "Staff", status: "Active", avatarColor: "violet" },
  { id: 5, username: "manager02", email: "manager02@idalwealth.com", mobile: "7766554433", role: "Manager", status: "Inactive", avatarColor: "orange" },
  { id: 6, username: "staff03", email: "staff03@idalwealth.com", mobile: "9000022222", role: "Staff", status: "Active", avatarColor: "sky" },
  { id: 7, username: "staff04", email: "staff04@idalwealth.com", mobile: "9000033333", role: "Staff", status: "Inactive", avatarColor: "rose" },
  { id: 8, username: "manager03", email: "manager03@idalwealth.com", mobile: "9811122233", role: "Manager", status: "Active", avatarColor: "indigo" },
  { id: 9, username: "staff05", email: "staff05@idalwealth.com", mobile: "9822233344", role: "Staff", status: "Active", avatarColor: "emerald" },
  { id: 10, username: "staff06", email: "staff06@idalwealth.com", mobile: "9833344455", role: "Staff", status: "Active", avatarColor: "cyan" },
  { id: 11, username: "staff07", email: "staff07@idalwealth.com", mobile: "9844455566", role: "Staff", status: "Inactive", avatarColor: "pink" },
  { id: 12, username: "manager04", email: "manager04@idalwealth.com", mobile: "9855566677", role: "Manager", status: "Active", avatarColor: "lime" },
  { id: 13, username: "staff08", email: "staff08@idalwealth.com", mobile: "9866677788", role: "Staff", status: "Active", avatarColor: "purple" },
  { id: 14, username: "staff09", email: "staff09@idalwealth.com", mobile: "9877788899", role: "Staff", status: "Inactive", avatarColor: "red" },
  { id: 15, username: "manager05", email: "manager05@idalwealth.com", mobile: "9888899900", role: "Manager", status: "Active", avatarColor: "yellow" },
  { id: 16, username: "staff10", email: "staff10@idalwealth.com", mobile: "9899900011", role: "Staff", status: "Active", avatarColor: "teal" },
  { id: 17, username: "staff11", email: "staff11@idalwealth.com", mobile: "9700011122", role: "Staff", status: "Active", avatarColor: "fuchsia" },
  { id: 18, username: "staff12", email: "staff12@idalwealth.com", mobile: "9711122233", role: "Staff", status: "Inactive", avatarColor: "slate" },
  { id: 19, username: "manager06", email: "manager06@idalwealth.com", mobile: "9722233344", role: "Manager", status: "Active", avatarColor: "blue" },
  { id: 20, username: "staff13", email: "staff13@idalwealth.com", mobile: "9733344455", role: "Staff", status: "Active", avatarColor: "green" },
];

export function initialsFor(username) {
  if (username === "superadmin") return "SJ";
  return username
    .replace(/\d+/g, "")
    .split(/[-_.\s]/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || username.slice(0, 2).toUpperCase();
}

export function generatedPassword(username, mobile) {
  const cleanUsername = (username || "").replace(/\s/g, "");
  const cleanMobile = (mobile || "").replace(/\D/g, "");
  return `${cleanUsername.slice(0, 4)}${cleanMobile.slice(0, 4)}`;
}
