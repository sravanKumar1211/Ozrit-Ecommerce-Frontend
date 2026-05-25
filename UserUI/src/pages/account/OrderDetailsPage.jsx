import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { fetchOrderById, cancelOrder } from "@/features/orders/ordersThunks";
import LoadingState from "@/components/common/LoadingState";
import toast from "react-hot-toast";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { current, loading } = useAppSelector((s) => s.orders);

  useEffect(() => {
    dispatch(fetchOrderById(id));
  }, [dispatch, id]);

  const handleCancel = async () => {
    const res = await dispatch(cancelOrder(id));
    if (cancelOrder.fulfilled.match(res)) {
      toast.success("Order cancelled");
      navigate('/orders');
    } else {
      toast.error(res.payload?.message || res.error?.message || "Unable to cancel order");
    }
  };

  if (loading || !current) return <div className="mx-auto max-w-7xl px-4 py-10"><LoadingState label="Loading order..." /></div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-slate-950">Order #{current.id}</h1>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="grid gap-4">
          <div className="flex items-center justify-between"><span>Status</span><span className="font-semibold">{current.orderStatus}</span></div>
          <div className="flex items-center justify-between"><span>Payment</span><span className="font-semibold">{current.paymentStatus}</span></div>
          <div className="pt-4">
            <h3 className="font-semibold">Items</h3>
            <div className="mt-2 space-y-2">
              {current.OrderItems?.map((it) => (
                <div key={it.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{it.Product?.name}</div>
                    <div className="text-sm text-slate-500">Variant: {it.ProductVariant?.color || it.ProductVariant?.sku}</div>
                  </div>
                  <div>${it.totalPrice}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {current.orderStatus !== 'cancelled' && current.orderStatus !== 'delivered' && (
          <div className="mt-6">
            <button onClick={handleCancel} className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white">Cancel Order</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsPage;
