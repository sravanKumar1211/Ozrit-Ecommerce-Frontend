import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { clearAuthError } from "@/features/auth/authSlice";
import { registerUser } from "@/features/auth/authThunks";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => () => dispatch(clearAuthError()), [dispatch]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await dispatch(registerUser(form));
    if (registerUser.fulfilled.match(result)) {
      if (result.payload?.requiresVerification) {
        toast.success("Account created! Please verify your email with the 6-digit code sent.");
        navigate(`/verify-email?email=${encodeURIComponent(form.email)}`, { replace: true });
      } else {
        toast.success("Account created successfully!");
        navigate("/", { replace: true });
      }
    } else {
      toast.error(result.payload || "Registration failed");
    }
  };

  return (
    <div className="mx-auto flex max-w-md px-4 py-12">
      <form onSubmit={handleSubmit} className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-950">Create account</h1>
        <p className="mt-1 text-sm text-slate-500">Register using the existing backend user API.</p>
        {error && <Alert severity="error" className="mt-5">{error}</Alert>}
        <div className="mt-6 space-y-4">
          {[
            ["name", "Name", "text"],
            ["email", "Email", "email"],
            ["phone", "Phone", "tel"],
            ["password", "Password", "password"],
          ].map(([name, label, type]) => (
            <label key={name} className="block text-sm font-medium text-slate-600">
              {label}
              <input
                name={name}
                type={type}
                required
                value={form[name]}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-400"
              />
            </label>
          ))}
        </div>
        <button type="submit" disabled={loading} className="mt-6 w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
          {loading ? "Creating account..." : "Register"}
        </button>
        <p className="mt-5 text-center text-sm text-slate-500">
          Already have an account? <Link to="/login" className="font-semibold text-slate-950">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
