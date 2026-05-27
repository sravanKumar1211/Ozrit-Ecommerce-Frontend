import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { loadUsers } from "@/state/slices/userSlice";
import Breadcrumbs from "@/components/Breadcrumbs";
import { formatDate } from "@/utils/date";

const CustomersPage = () => {
  const dispatch = useDispatch();
  const { users, error } = useSelector((state) => state.users);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    dispatch(loadUsers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Apply the selected filter
  const filteredUsers = users.filter((user) => {
    if (filter === "verified") return user.emailVerified;
    if (filter === "unverified") return !user.emailVerified;
    return true;
  });

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Customers</h1>
            <p className="text-sm text-slate-500">View registered customers and account details.</p>
          </div>
          <div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-soft outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
            >
              <option value="all">All Customers</option>
              <option value="verified">Verified Only</option>
              <option value="unverified">Unverified Only</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm text-slate-800">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-4">Name</th>
                <th className="px-4 py-4">Email</th>
                <th className="px-4 py-4">Joined</th>
                <th className="px-4 py-4">Verification</th>
                <th className="px-4 py-4">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-4 font-medium text-slate-900">{user.name}</td>
                  <td className="px-4 py-4">{user.email}</td>
                  <td className="px-4 py-4 text-slate-500">{formatDate(user.createdAt)}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      user.emailVerified
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
                        : "bg-amber-50 text-amber-700 border border-amber-200/50"
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${user.emailVerified ? "bg-emerald-500" : "bg-amber-500"}`} />
                      {user.emailVerified ? "Verified" : "Unverified"}
                    </span>
                  </td>
                  <td className="px-4 py-4 capitalize text-slate-500">{user.role || "Customer"}</td>
                </tr>
              ))}
              {!filteredUsers.length && (
                <tr>
                  <td colSpan="5" className="px-4 py-10 text-center text-slate-500">No customers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;
