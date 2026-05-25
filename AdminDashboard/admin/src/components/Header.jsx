import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiBell, FiLogOut } from "react-icons/fi";
import { logoutUser } from "@/state/slices/authSlice";
import { getImageUrl } from "@/utils/image";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.admin);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 w-full border-b border-slate-200 bg-white py-4 shadow-sm">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex flex-1 items-center gap-3">
          <span className="text-lg font-semibold text-slate-900">Dashboard</span>
        </div>

        <div className="flex items-center gap-4">
          <button className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100">
            <FiBell className="h-5 w-5" />
          </button>
          <div className="hidden items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 sm:flex">
            {user?.profileImage ? (
              <img src={getImageUrl(user.profileImage)} alt={user?.name || "Admin"} className="h-10 w-10 rounded-2xl object-cover" />
            ) : (
              <div className="h-10 w-10 rounded-2xl bg-slate-200" />
            )}
            <div>
              <p className="text-sm font-semibold text-slate-900">{user?.name || "Admin"}</p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            onClick={handleLogout}
          >
            <FiLogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
