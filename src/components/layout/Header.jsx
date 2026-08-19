import { useState } from "react";
import { Menu as HeadlessMenu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDown, KeyRound, LogOut, Menu as MenuIcon, UserRound } from "lucide-react";
import Button from "../common/Button";
import Input from "../common/Input";
import Modal from "../common/Modal";
import { authApi } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { useLayout } from "../../context/LayoutContext";

export default function Header() {
  const { currentUser, logout } = useAuth();
  const { toggleNavigation } = useLayout();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ password: "", confirmPassword: "" });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [resetSubmitting, setResetSubmitting] = useState(false);
  const displayName = currentUser?.username || "Super Admin";

  const openResetPassword = () => {
    setPasswordForm({ password: "", confirmPassword: "" });
    setPasswordError("");
    setPasswordSuccess("");
    setResetOpen(true);
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (passwordForm.password !== passwordForm.confirmPassword) {
      setPasswordError("Password and confirm password do not match.");
      return;
    }

    setResetSubmitting(true);
    try {
      await authApi.resetPassword(passwordForm.password);
      setPasswordSuccess("Password reset successfully.");
      setPasswordForm({ password: "", confirmPassword: "" });
    } catch (err) {
      if (err.message !== "Unauthorized") setPasswordError(err.message);
    } finally {
      setResetSubmitting(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-[#dbe3f1] bg-white/95 px-5 backdrop-blur lg:ml-[292px] lg:px-8">
        <button type="button" onClick={toggleNavigation} className="grid h-11 w-11 place-items-center rounded-md text-[#071154] hover:bg-[#eef4ff]" aria-label="Toggle navigation">
          <MenuIcon className="h-6 w-6" />
        </button>
        <div className="flex items-center gap-4">
          <HeadlessMenu as="div" className="relative">
            <MenuButton className="flex items-center gap-3 text-sm font-bold text-[#071154]">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#eef3ff]">
                <UserRound className="h-5 w-5" />
              </span>
              <span className="hidden sm:inline">{displayName}</span>
              <ChevronDown className="hidden h-4 w-4 sm:block" />
            </MenuButton>
            <MenuItems className="absolute right-0 z-30 mt-3 w-52 rounded-md border border-[#d8e0f0] bg-white p-1 text-sm font-semibold text-[#071154] shadow-lg focus:outline-none">
              <MenuItem>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded px-3 py-2 text-left data-[focus]:bg-[#eef4ff]"
                  onClick={openResetPassword}
                >
                  <KeyRound className="h-4 w-4 text-[#0454ff]" />
                  Reset Password
                </button>
              </MenuItem>
            </MenuItems>
          </HeadlessMenu>
          <button
            type="button"
            onClick={() => setLogoutOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-md border border-[#d8e0f0] bg-white text-[#0454ff] transition hover:bg-[#f2f6ff]"
            aria-label="Logout"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      <Modal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        title="Confirm Logout"
        footer={
          <>
            <Button variant="secondary" onClick={() => setLogoutOpen(false)}>
              No
            </Button>
            <Button onClick={logout}>Yes, Logout</Button>
          </>
        }
      >
        <p className="text-base font-semibold text-[#071154]">Do you really want to log out?</p>
      </Modal>

      <Modal open={resetOpen} onClose={() => setResetOpen(false)} title="Reset Password">
        <form onSubmit={handleResetPassword} className="space-y-6">
          <Input
            label="New Password"
            required
            type="password"
            value={passwordForm.password}
            onChange={(event) => setPasswordForm((current) => ({ ...current, password: event.target.value }))}
            placeholder="Enter new password"
          />
          <Input
            label="Confirm Password"
            required
            type="password"
            value={passwordForm.confirmPassword}
            onChange={(event) => setPasswordForm((current) => ({ ...current, confirmPassword: event.target.value }))}
            placeholder="Re-enter new password"
          />

          {passwordError ? <p className="rounded-md bg-[#ffe7e7] px-4 py-3 text-sm font-semibold text-[#d50d0d]">{passwordError}</p> : null}
          {passwordSuccess ? <p className="rounded-md bg-[#e1f8ec] px-4 py-3 text-sm font-semibold text-[#087b3d]">{passwordSuccess}</p> : null}

          <div className="-mx-8 -mb-8 flex justify-end gap-4 border-t border-[#dbe3f1] px-8 py-5">
            <Button variant="secondary" onClick={() => setResetOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={resetSubmitting}>
              Reset Password
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
