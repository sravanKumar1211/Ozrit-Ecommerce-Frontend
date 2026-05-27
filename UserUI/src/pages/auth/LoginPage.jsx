import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { loginUser } from "@/features/auth/authThunks";
import { clearAuthError } from "@/features/auth/authSlice";
import toast from "react-hot-toast";

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  const [form, setForm] = useState({ email: "", password: "" });

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [from, isAuthenticated, navigate]);

  useEffect(() => () => dispatch(clearAuthError()), [dispatch]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) {
      toast.success("Logged in successfully");
      navigate(from, { replace: true });
    } else {
      if (result.payload && typeof result.payload === "object" && result.payload.requiresVerification) {
        toast.error(result.payload.message || "Email verification required");
        navigate(`/verify-email?email=${encodeURIComponent(result.payload.email)}`, { replace: true });
      } else {
        toast.error(typeof result.payload === "string" ? result.payload : result.error?.message || "Login failed");
      }
    }
  };

  return (
    <div className="mx-auto flex max-w-md px-4 py-12">
      <form onSubmit={handleSubmit} className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-950">Login</h1>
        <p className="mt-1 text-sm text-slate-500">Access your ecommerce account.</p>
        {error && <Alert severity="error" className="mt-5">{error}</Alert>}
        <div className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-slate-600">
            Email
            <input
              type="email"
              required
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-400"
            />
          </label>
          <label className="block text-sm font-medium text-slate-600">
            Password
            <input
              type="password"
              required
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-400"
            />
          </label>
        </div>
        <button type="submit" disabled={loading} className="mt-6 w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="mt-5 text-center text-sm text-slate-500">
          New here? <Link to="/register" className="font-semibold text-slate-950">Create account</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
