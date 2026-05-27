import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { loadOrders } from "@/state/slices/orderSlice";
import Breadcrumbs from "@/components/Breadcrumbs";
import { formatCurrency } from "@/utils/currency";
import { formatDate } from "@/utils/date";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.orders);
  const order = orders?.find((item) => String(item.id) === String(id));

  useEffect(() => {
    if (!orders.length) {
      dispatch(loadOrders());
    }
  }, [dispatch, orders.length]);

  if (!order) {
    return (
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
        <p className="text-slate-500">Order not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Order #{order.id}</h1>
          <p className="text-sm text-slate-500">Created on {formatDate(order.createdAt)}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-lg font-semibold text-slate-900">Customer</h2>
            <p className="mt-3 text-sm text-slate-700">{order.User?.name || "Guest"}</p>
            <p className="text-sm text-slate-500">{order.User?.email}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-lg font-semibold text-slate-900">Order summary</h2>
            <div className="mt-3 space-y-2 text-sm text-slate-700">
              <p>Total amount: {formatCurrency(order.totalAmount)}</p>
              <p>Discount: {formatCurrency(order.discountAmount)}</p>
              <p className="font-semibold">Final total: {formatCurrency(order.finalAmount)}</p>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-lg font-semibold text-slate-900">Payment details</h2>
            <div className="mt-3 space-y-2 text-sm text-slate-700">
              <div>
                Status:{" "}
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase border ${
                  order.paymentStatus === "paid"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : order.paymentStatus === "failed"
                    ? "bg-rose-50 text-rose-700 border-rose-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}>
                  {order.paymentStatus || "pending"}
                </span>
              </div>
              <p>Method: <span className="font-semibold uppercase">{order.paymentMethod || "Razorpay"}</span></p>
              {order.razorpayPaymentId && <p className="truncate">Transaction ID: <span className="font-mono text-xs text-slate-500">{order.razorpayPaymentId}</span></p>}
              {order.paidAt && <p>Paid On: <span className="font-semibold text-xs">{new Date(order.paidAt).toLocaleString("en-IN")}</span></p>}
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm text-slate-800">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-4">Item</th>
                <th className="px-4 py-4">Price</th>
                <th className="px-4 py-4">Quantity</th>
                <th className="px-4 py-4">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {order.OrderItems?.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-4">
                    <div className="font-medium text-slate-900">{item.Product?.name || item.ProductVariant?.id}</div>
                  </td>
                  <td className="px-4 py-4">{formatCurrency(item.price)}</td>
                  <td className="px-4 py-4">{item.quantity}</td>
                  <td className="px-4 py-4">{formatCurrency(item.totalPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
