import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { loadOrders, changeOrderStatus } from "@/state/slices/orderSlice";
import Breadcrumbs from "@/components/Breadcrumbs";
import { ORDER_STATUS } from "@/constants/status";
import { formatCurrency } from "@/utils/currency";

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(loadOrders());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleStatusChange = async (order, status) => {
    const result = await dispatch(changeOrderStatus({ orderId: order.id, orderStatus: status }));
    if (changeOrderStatus.fulfilled.match(result)) {
      toast.success("Order status updated.");
    } else {
      toast.error(result.payload || "Could not update order.");
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
        <h1 className="text-2xl font-semibold text-slate-900">Orders</h1>
        <p className="mt-1 text-sm text-slate-500">Review order status, payments and customer details.</p>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm text-slate-800">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-4">Order</th>
                <th className="px-4 py-4">Customer</th>
                <th className="px-4 py-4">Amount</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {orders?.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-4">#{order.id}</td>
                  <td className="px-4 py-4">{order.User?.name || "Guest"}</td>
                  <td className="px-4 py-4">{formatCurrency(order.finalAmount)}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${ORDER_STATUS.find((status) => status.value === order.orderStatus)?.color || "bg-slate-100 text-slate-700"}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-4 py-4 space-x-2">
                    <Link
                      to={`/orders/${order.id}`}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
                    >
                      Details
                    </Link>
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order, e.target.value)}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none"
                    >
                      {ORDER_STATUS.map((status) => (
                        <option key={status.value} value={status.value}>{status.label}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {!orders?.length && (
                <tr>
                  <td colSpan="5" className="px-4 py-10 text-center text-slate-500">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
