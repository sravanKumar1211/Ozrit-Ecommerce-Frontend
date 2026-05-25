import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { loadCoupons, createNewCoupon, removeCoupon } from "@/state/slices/couponSlice";
import Breadcrumbs from "@/components/Breadcrumbs";
import Pagination from "@/components/Pagination";
import { formatDate } from "@/utils/date";
import { COUPON_TYPES } from "@/constants/status";

const CouponsPage = () => {
  const dispatch = useDispatch();
  const { coupons, loading, error } = useSelector((state) => state.coupons);
  const [currentPage, setCurrentPage] = useState(1);
  const { register, handleSubmit, reset } = useForm();
  const limit = 10;

  useEffect(() => {
    dispatch(loadCoupons());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const totalPages = Math.max(1, Math.ceil(coupons.length / limit));

  const paginatedCoupons = useMemo(
    () => coupons.slice((currentPage - 1) * limit, currentPage * limit),
    [coupons, currentPage, limit],
  );

  const onSubmit = async (values) => {
    const payload = {
      couponCode: values.code,
      discountType: values.type,
      discountValue: Number(values.discount),
      expiryDate: values.expiresAt,
      minPurchaseAmount: values.minPurchaseAmount ? Number(values.minPurchaseAmount) : 0,
      status: values.status === "active",
    };

    const result = await dispatch(createNewCoupon(payload));
    if (createNewCoupon.fulfilled.match(result)) {
      toast.success("Coupon created.");
      reset();
      setCurrentPage(1);
    }
  };

  const handleDelete = async (id) => {
    const result = await dispatch(removeCoupon(id));
    if (removeCoupon.fulfilled.match(result)) {
      toast.success("Coupon deleted.");
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Coupons</h1>
              <p className="text-sm text-slate-500">Create discount codes and manage their availability.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm text-slate-800">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-4">Code</th>
                  <th className="px-4 py-4">Type</th>
                  <th className="px-4 py-4">Discount</th>
                  <th className="px-4 py-4">Expires</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {paginatedCoupons.map((coupon) => (
                  <tr key={coupon.id}>
                    <td className="px-4 py-4 font-medium text-slate-900">{coupon.couponCode}</td>
                    <td className="px-4 py-4 capitalize">{coupon.discountType}</td>
                    <td className="px-4 py-4">{coupon.discountValue}</td>
                    <td className="px-4 py-4">{formatDate(coupon.expiryDate)}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${coupon.status ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                        {coupon.status ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => handleDelete(coupon.id)}
                        className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 transition hover:bg-rose-100"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {!coupons.length && (
                  <tr>
                    <td colSpan="6" className="px-4 py-10 text-center text-slate-500">No coupons available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">New Coupon</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <label className="block text-sm text-slate-600">
              Code
              <input
                {...register("code", { required: true })}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
              />
            </label>
            <label className="block text-sm text-slate-600">
              Discount type
              <select
                {...register("type", { required: true })}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
                defaultValue="percent"
              >
                {COUPON_TYPES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm text-slate-600">
              Discount value
              <input
                type="number"
                {...register("discount", { required: true })}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
              />
            </label>
            <label className="block text-sm text-slate-600">
              Minimum purchase amount
              <input
                type="number"
                {...register("minPurchaseAmount")}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
              />
            </label>
            <label className="block text-sm text-slate-600">
              Expires At
              <input
                type="date"
                {...register("expiresAt", { required: true })}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
              />
            </label>
            <label className="block text-sm text-slate-600">
              Status
              <select
                {...register("status", { required: true })}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
                defaultValue="active"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Create Coupon
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CouponsPage;
