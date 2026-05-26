import { useEffect, useState } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import {
  fetchUserProfile,
  updateUserProfile,
} from "@/features/profile/profileThunks";
import { clearProfileStatus } from "@/features/profile/profileSlice";
import LoadingState from "@/components/common/LoadingState";
import toast from "react-hot-toast";

const emptyAddress = {
  houseNo: "",
  street: "",
  village: "",
  city: "",
  pincode: "",
};

const ProfilePage = () => {
  const dispatch = useAppDispatch();

  const { profile, loading: profileLoading } = useAppSelector(
    (state) => state.profile
  );

  const { user: authUser } = useAppSelector(
    (state) => state.auth
  );

  const user = profile || authUser;
  const loading = profileLoading;

  const [form, setForm] = useState({
    name: "",
    phone: "",
  });

  const [address, setAddress] = useState(emptyAddress);

  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    dispatch(fetchUserProfile());

    return () => {
      dispatch(clearProfileStatus());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!user) return;

    setForm({
      name: user.name || "",
      phone: user.phone || "",
    });

    setPreviewImage(user.profileImage || "");

    if (user.address && typeof user.address === "object") {
      setAddress({
        houseNo: user.address.houseNo || "",
        street: user.address.street || "",
        village: user.address.village || "",
        city: user.address.city || "",
        pincode: user.address.pincode || "",
      });
    } else if (
      user.address &&
      typeof user.address === "string"
    ) {
      try {
        const parsed = JSON.parse(user.address);

        setAddress({
          houseNo: parsed.houseNo || "",
          street: parsed.street || "",
          village: parsed.village || "",
          city: parsed.city || "",
          pincode: parsed.pincode || "",
        });
      } catch {
        setAddress(emptyAddress);
      }
    }
  }, [user]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setDirty(true);
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));

    setDirty(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setProfileImage(file);
    setPreviewImage(URL.createObjectURL(file));
    setDirty(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();

    fd.append("name", form.name);
    fd.append("phone", form.phone);
    fd.append("address", JSON.stringify(address));

    if (profileImage) {
      fd.append("profileImage", profileImage);
    }

    const result = await dispatch(
      updateUserProfile(fd)
    );

    if (updateUserProfile.fulfilled.match(result)) {
      toast.success("Profile updated successfully");
      setDirty(false);

      dispatch(fetchUserProfile());
    } else {
      toast.error(
        result.payload || "Failed to update profile"
      );
    }
  };

  if (loading && !user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <LoadingState label="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold text-slate-950">
        Profile
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-5"
      >
        {/* Profile Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt={user?.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-2xl font-bold text-slate-400">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </div>

            <div className="flex-1">
              <h2 className="text-lg font-semibold text-slate-950">
                {user?.name}
              </h2>

              <p className="text-sm text-slate-500">
                {user?.email}
              </p>

              <span className="mt-2 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-600">
                {user?.role || "user"}
              </span>

              <div className="mt-4">
                <label className="cursor-pointer rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800">
                  Change Photo

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Info */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-950">
            Personal Info
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-600">
              Name

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleFormChange}
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-slate-400"
              />
            </label>

            <label className="block text-sm font-medium text-slate-600">
              Phone

              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleFormChange}
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-slate-400"
              />
            </label>

            <label className="block text-sm font-medium text-slate-600 sm:col-span-2">
              Email

              <input
                type="text"
                readOnly
                value={user?.email || ""}
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm text-slate-500"
              />
            </label>
          </div>
        </div>

        {/* Address */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-950">
            Shipping Address
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {[
              ["houseNo", "House / Flat No"],
              ["street", "Street"],
              ["village", "Village / Area"],
              ["city", "City"],
              ["pincode", "Pincode"],
            ].map(([field, label]) => (
              <label
                key={field}
                className="block text-sm font-medium text-slate-600"
              >
                {label}

                <input
                  type="text"
                  name={field}
                  value={address[field]}
                  onChange={handleAddressChange}
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-slate-400"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !dirty}
            className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;