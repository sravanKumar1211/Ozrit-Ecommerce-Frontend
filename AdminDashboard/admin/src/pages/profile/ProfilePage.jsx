import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Breadcrumbs from "@/components/Breadcrumbs";
import { loadProfile, saveAdminProfile, resetAdminPassword } from "@/state/slices/authSlice";
import { getImageUrl } from "@/utils/image";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { admin, loading, error } = useSelector((state) => state.auth);
  const { register, handleSubmit, reset } = useForm();
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
  } = useForm();
  const previewImage = admin?.profileImage || "";

  useEffect(() => {
    dispatch(loadProfile());
  }, [dispatch]);

  useEffect(() => {
    if (admin) {
      reset({
        name: admin.name || "",
        phone: admin.phone || "",
      });
    }
  }, [admin, reset]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const onSubmit = async (values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("phone", values.phone);
    if (values.profileImage?.[0]) {
      formData.append("profileImage", values.profileImage[0]);
    }

    const result = await dispatch(saveAdminProfile(formData));
    if (saveAdminProfile.fulfilled.match(result)) {
      toast.success("Profile updated successfully.");
    }
  };

  const onChangePassword = async (values) => {
    const result = await dispatch(resetAdminPassword(values));
    if (resetAdminPassword.fulfilled.match(result)) {
      toast.success("Password updated successfully.");
      resetPasswordForm();
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs />

      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Profile</h1>
            <p className="mt-1 text-sm text-slate-500">Manage your admin account information.</p>
          </div>
          {previewImage ? (
            <img src={getImageUrl(previewImage)} alt={admin?.name || "Admin"} className="h-20 w-20 rounded-3xl object-cover" />
          ) : (
            <div className="h-20 w-20 rounded-3xl bg-slate-100" />
          )}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-400">Name</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{admin?.name || "-"}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-400">Email</p>
            <p className="mt-1 break-all text-sm font-semibold text-slate-900">{admin?.email || "-"}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-400">Phone</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{admin?.phone || "-"}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-400">Role</p>
            <p className="mt-1 text-sm font-semibold capitalize text-slate-900">{admin?.role || "-"}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-6 md:grid-cols-2">
          <label className="block text-sm text-slate-600">
            Name
            <input
              {...register("name", { required: true })}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
            />
          </label>
          <label className="block text-sm text-slate-600">
            Phone
            <input
              {...register("phone", { required: true })}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
            />
          </label>
          <label className="block text-sm text-slate-600 md:col-span-2">
            Profile Image
            <input
              type="file"
              accept="image/*"
              {...register("profileImage")}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Save profile
          </button>
        </form>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-slate-900">Change Password</h2>
        <form onSubmit={handlePasswordSubmit(onChangePassword)} className="mt-6 grid gap-6 md:grid-cols-3">
          <label className="block text-sm text-slate-600">
            Old Password
            <input
              type="password"
              {...registerPassword("oldPassword", { required: true })}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
            />
          </label>
          <label className="block text-sm text-slate-600">
            New Password
            <input
              type="password"
              {...registerPassword("newPassword", { required: true, minLength: 6 })}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
            />
          </label>
          <label className="block text-sm text-slate-600">
            Confirm Password
            <input
              type="password"
              {...registerPassword("confirmPassword", { required: true, minLength: 6 })}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 md:col-span-3"
          >
            Update password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
