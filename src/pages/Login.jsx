import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BarChart3, LockKeyhole, UserRound } from "lucide-react";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form);
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (err) {
      setError(err.message === "Unauthorized" ? "Invalid username or password." : err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-[#f8fbff] lg:grid-cols-[1.05fr_0.95fr]">
      <section className="hidden bg-[#071154] px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-md bg-white/10 text-white">
            <BarChart3 className="h-8 w-8" />
          </span>
          <div>
            <p className="text-3xl font-extrabold leading-none text-white">idalWEALTH</p>
            <p className="mt-1 text-sm font-medium text-white/75">Advisory Private Limited</p>
          </div>
        </div>
        <div className="max-w-xl">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#8db1ff]">Admin Portal</p>
          <h1 className="mt-5 text-5xl font-extrabold leading-tight tracking-[-0.01em]">Manage users, roles and access with confidence.</h1>
          <p className="mt-6 max-w-lg text-base font-medium leading-8 text-white/72">
            Sign in to access user management and administrative controls.
          </p>
        </div>
        <p className="text-xs text-white/60">(c) 2026 idalWEALTH Advisory Private Limited.</p>
      </section>

      <section className="flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <span className="grid h-11 w-11 place-items-center rounded-md bg-[#e9f1ff] text-[#0454ff]">
              <BarChart3 className="h-7 w-7" />
            </span>
            <div>
              <p className="text-2xl font-extrabold leading-none text-[#0454ff]">idalWEALTH</p>
              <p className="mt-1 text-xs font-medium text-[#071154]">Advisory Private Limited</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="soft-shadow rounded-lg border border-[#dfe6f2] bg-white p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold tracking-[-0.01em] text-[#071154]">Login</h2>
              <p className="mt-3 text-sm font-medium text-[#56618c]">Enter your credentials to continue.</p>
            </div>

            <div className="space-y-6">
              <Input
                label="Username"
                required
                value={form.username}
                onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
                placeholder="Enter username"
                icon={UserRound}
              />
              <Input
                label="Password"
                required
                type="password"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                placeholder="Enter password"
                icon={LockKeyhole}
              />
            </div>

            {error ? <p className="mt-5 rounded-md bg-[#ffe7e7] px-4 py-3 text-sm font-semibold text-[#d50d0d]">{error}</p> : null}

            <Button type="submit" loading={submitting} className="mt-8 w-full">
              Sign In
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
