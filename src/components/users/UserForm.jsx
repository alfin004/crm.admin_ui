import { Info, RefreshCcw } from "lucide-react";
import Button from "../common/Button";
import Input from "../common/Input";
import Select from "../common/Select";
import { generatedPassword } from "../../data/users";
import { apiRoleOptions, statusOptions } from "../../lib/userMapper";

export default function UserForm({
  mode,
  form,
  onChange,
  onSubmit,
  onCancel,
  onResetPassword,
  submitting = false,
  resetSubmitting = false,
}) {
  const password = generatedPassword(form.username, form.mobile);
  const roleOptions = mode === "add" ? [{ label: "Select role", value: "" }, ...apiRoleOptions] : apiRoleOptions;

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-7">
        <h3 className="border-b border-[#dbe3f1] pb-4 text-lg font-extrabold text-[#0454ff]">User Information</h3>
      </div>
      <div className="space-y-6">
        <Input
          label="Username"
          required
          value={form.username}
          onChange={(event) => onChange("username", event.target.value)}
          placeholder="Enter username"
          disabled={mode === "edit"}
          hint={mode === "edit" ? "Username cannot be changed." : undefined}
        />
        <Input
          label="Email ID"
          required
          type="email"
          value={form.email}
          onChange={(event) => onChange("email", event.target.value)}
          placeholder="Enter email address"
        />
        <label className="block">
          <span className="mb-3 block text-sm font-bold text-[#071154]">
            Mobile Number <span className="text-red-500">*</span>
          </span>
          <span className="flex h-12 overflow-hidden rounded-md border border-[#cfd8eb] bg-white focus-within:border-[#0454ff] focus-within:ring-4 focus-within:ring-[#0454ff]/10">
            <span className="flex w-36 items-center justify-center gap-3 border-r border-[#cfd8eb] text-sm font-extrabold">
              <span className="text-xs font-extrabold text-[#0454ff]">IN</span>
              +91
            </span>
            <input
              className="min-w-0 flex-1 px-4 text-sm font-medium text-[#071154] outline-none placeholder:text-[#6f78a5]"
              value={form.mobile}
              onChange={(event) => onChange("mobile", event.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="Enter mobile number"
              required
              minLength={10}
            />
          </span>
        </label>
        <Select label="Role" required value={form.role} onChange={(event) => onChange("role", event.target.value)} options={roleOptions} />
        <Select label="Status" required value={form.status} onChange={(event) => onChange("status", event.target.value)} options={statusOptions} />

        <div className="rounded-md bg-[#eef5ff] px-6 py-5 text-[#071154]">
          <div className="flex gap-4">
            <Info className="mt-0.5 h-6 w-6 shrink-0 text-[#0454ff]" />
            <div className="space-y-4 text-sm font-medium">
              <p>{mode === "add" ? "The password for this user will be set automatically as:" : "Password for this user is set automatically as:"}</p>
              <p className="inline-block rounded-md bg-white px-4 py-2 font-extrabold text-[#0454ff]">
                First 4 characters of username + First 4 digits of mobile number
              </p>
              <div className="space-y-2">
                <p>Example:</p>
                <p>
                  Username: <span className="font-semibold">john.doe</span> <span className="mx-3">|</span> Mobile: +91 98765 43210
                </p>
                <p>
                  Password: <span className="font-extrabold text-[#0454ff]">john9876</span>
                </p>
                {form.username && form.mobile.length >= 4 ? (
                  <p>
                    Current password: <span className="font-extrabold text-[#0454ff]">{password}</span>
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {mode === "edit" ? (
          <div className="flex flex-col gap-4 rounded-md border border-[#dbe3f1] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="text-base font-extrabold">Reset Password</h4>
              <p className="mt-2 max-w-md text-sm font-medium leading-6 text-[#56618c]">Generate a new password for this user using the default method.</p>
            </div>
            <Button variant="secondary" icon={RefreshCcw} className="shrink-0 text-[#0454ff]" onClick={onResetPassword} loading={resetSubmitting}>
              Reset Password
            </Button>
          </div>
        ) : null}
      </div>

      <div className="-mx-8 -mb-8 mt-8 flex justify-end gap-4 border-t border-[#dbe3f1] px-8 py-5">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {mode === "add" ? "Create User" : "Update User"}
        </Button>
      </div>
    </form>
  );
}
