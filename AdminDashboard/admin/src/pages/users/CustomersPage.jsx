import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { loadUsers } from "@/state/slices/userSlice";
import Breadcrumbs from "@/components/Breadcrumbs";
import { formatDate } from "@/utils/date";

const CustomersPage = () => {
  const dispatch = useDispatch();
  const { users, error } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(loadUsers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
        <div className="mb-5">
          <h1 className="text-2xl font-semibold text-slate-900">Customers</h1>
          <p className="text-sm text-slate-500">View registered customers and account details.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm text-slate-800">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-4">Name</th>
                <th className="px-4 py-4">Email</th>
                <th className="px-4 py-4">Joined</th>
                <th className="px-4 py-4">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-4">{user.name}</td>
                  <td className="px-4 py-4">{user.email}</td>
                  <td className="px-4 py-4">{formatDate(user.createdAt)}</td>
                  <td className="px-4 py-4">{user.role || "Customer"}</td>
                </tr>
              ))}
              {!users.length && (
                <tr>
                  <td colSpan="4" className="px-4 py-10 text-center text-slate-500">No customers found.</td>
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
