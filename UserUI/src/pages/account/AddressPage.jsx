import { useEffect, useState } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { loadProfile } from "@/features/auth/authThunks";

const AddressPage = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const [address, setAddress] = useState(user?.address || "");

  useEffect(() => {
    dispatch(loadProfile());
  }, [dispatch]);

  useEffect(() => setAddress(user?.address || ""), [user]);

  const handleSave = () => {
    // Profile update not included in Stage 3 backend modifications; rely on existing profile update if present.
    alert('Save address: functionality depends on profile update endpoint.');
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-slate-950">Address</h1>
      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6">
        <textarea value={address} onChange={(e) => setAddress(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4" rows={6} />
        <div className="mt-4">
          <button onClick={handleSave} className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">Save</button>
        </div>
      </div>
    </div>
  );
};

export default AddressPage;
