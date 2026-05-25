import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { loadProfile } from "@/features/auth/authThunks";
import LoadingState from "@/components/common/LoadingState";

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadProfile());
  }, [dispatch]);

  if (loading && !user) {
    return <div className="mx-auto max-w-3xl px-4 py-10"><LoadingState label="Loading profile..." /></div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-950">Profile</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-400">Name</p>
            <p className="mt-1 font-semibold text-slate-950">{user?.name || "-"}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-400">Email</p>
            <p className="mt-1 break-all font-semibold text-slate-950">{user?.email || "-"}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-400">Phone</p>
            <p className="mt-1 font-semibold text-slate-950">{user?.phone || "-"}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-400">Role</p>
            <p className="mt-1 font-semibold capitalize text-slate-950">{user?.role || "user"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
