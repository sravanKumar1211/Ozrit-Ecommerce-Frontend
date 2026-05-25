import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { loginUser, loadProfile } from "@/state/slices/authSlice";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading,token } = useSelector((state) => state.auth);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  const onSubmit = async (values) => {
    const result = await dispatch(loginUser(values));

    if (loginUser.fulfilled.match(result)) {
      toast.success("Welcome back!");
      await dispatch(loadProfile());
      navigate("/dashboard");
    } else if (loginUser.rejected.match(result)) {
      toast.error(result.payload || "Invalid username or password");
    
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-4">
      <div className="w-full max-w-md rounded-[2rem] border border-slate-700 bg-slate-950/95 p-10 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-white">Admin Portal</h1>
          <p className="mt-3 text-sm text-slate-400">
            Secure login to manage products, orders and customers.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <label className="block text-sm font-medium text-slate-300">
            Email address
            <input
              type="email"
              {...register("email", { required: true })}
              className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-slate-500"
              placeholder="admin@example.com"
            />
          </label>

          <label className="block text-sm font-medium text-slate-300">
            Password
            <input
              type="password"
              {...register("password", { required: true })}
              className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-slate-500"
              placeholder="••••••••"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-3 w-full rounded-3xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>

      <div>
        <Toaster position="top-center" />
      </div>
    </div>
  );
};

export default LoginPage;
