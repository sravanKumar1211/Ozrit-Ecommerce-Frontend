import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { fetchMyOrders } from "@/features/orders/ordersThunks";
import LoadingState from "@/components/common/LoadingState";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const OrdersPage = () => {
  const dispatch = useAppDispatch();
  const { orders, loading } = useAppSelector((s) => s.orders);

  useEffect(() => {
    dispatch(fetchMyOrders()).then((res) => {
      if (fetchMyOrders.rejected.match(res)) {
        toast.error(res.payload?.message || res.error?.message || "Failed to load orders");
      }
    });
  }, [dispatch]);

  if (loading) return <div className="mx-auto max-w-7xl px-4 py-10"><LoadingState label="Loading orders..." /></div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-slate-950">My Orders</h1>
      <div className="mt-6 space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-600">Order #{order.id}</div>
                <div className="mt-1 font-semibold text-slate-900">${order.finalAmount}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleString()}</div>
                <Link to={`/orders/${order.id}`} className="mt-2 inline-block rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">View</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
