import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { fetchOrderById, cancelOrder } from "@/features/orders/ordersThunks";
import { getImageUrl } from "@/utils/image";
import LoadingState from "@/components/common/LoadingState";
import toast from "react-hot-toast";

const STATUS_STYLES = {
  pending:   "bg-amber-50 text-amber-700 border-amber-200",
  packed:    "bg-blue-50 text-blue-700 border-blue-200",
  shipped:   "bg-indigo-50 text-indigo-700 border-indigo-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-rose-50 text-rose-700 border-rose-200",
};

const PAYMENT_STYLES = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  paid:    "bg-emerald-50 text-emerald-700 border-emerald-200",
  failed:  "bg-rose-50 text-rose-700 border-rose-200",
};

const StatusBadge = ({ label, styleMap }) => {
  const key = (label || "").toLowerCase();
  const cls = styleMap[key] || "bg-slate-50 text-slate-600 border-slate-200";
  return (
    <span className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold capitalize ${cls}`}>
      {label || "—"}
    </span>
  );
};

const CANCELLABLE = ["pending", "packed"];

const OrderDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { current, loading } = useAppSelector((s) => s.orders);
  const [cancelling, setCancelling] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    dispatch(fetchOrderById(id));
  }, [dispatch, id]);

  const handleCancel = async () => {
    setCancelling(true);
    setShowConfirm(false);
    const res = await dispatch(cancelOrder(id));
    setCancelling(false);
    if (cancelOrder.fulfilled.match(res)) {
      toast.success("Order cancelled successfully");
      // Re-fetch to get updated state
      dispatch(fetchOrderById(id));
    } else {
      const msg =
        typeof res.payload === "string"
          ? res.payload
          : res.payload?.message || "Unable to cancel order";
      toast.error(msg);
    }
  };

  if (loading && !current) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <LoadingState label="Loading order..." />
      </div>
    );
  }

  if (!current) return null;

  const canCancel = CANCELLABLE.includes(current.orderStatus?.toLowerCase());

const shippingAddress = (() => {
  try {
    let address = current.address;

    // first parse
    if (typeof address === "string") {
      address = JSON.parse(address);
    }

    // second parse
    if (address?.fullAddress) {
      address = JSON.parse(address.fullAddress);
    }

    return address || {};
  } catch (err) {
    console.error(err);
    return {};
  }
})();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <nav className="mb-1 flex items-center gap-2 text-sm text-slate-500">
            <Link to="/orders" className="hover:text-slate-950">Orders</Link>
            <span>/</span>
            <span className="text-slate-950">#{current.id}</span>
          </nav>
          <h1 className="text-2xl font-semibold text-slate-950">Order #{current.id}</h1>
          <p className="mt-1 text-xs text-slate-400">
            Placed on{" "}
            {new Date(current.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge label={current.orderStatus} styleMap={STATUS_STYLES} />
          <StatusBadge label={current.paymentStatus} styleMap={PAYMENT_STYLES} />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        {/* Items */}
        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-950">
              Items ({current.OrderItems?.length || 0})
            </h2>
            <div className="mt-4 space-y-4">
              {current.OrderItems?.map((item) => {
                const variant = item.ProductVariant;
                const product = item.Product;
                const img = variant?.image
                  ? getImageUrl(variant.image)
                  : product?.thumbnail
                    ? getImageUrl(product.thumbnail)
                    : null;
                return (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                      {img ? (
                        <img src={img} alt={product?.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-slate-400">—</div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-950">{product?.name || "Product"}</p>
                      <p className="text-sm text-slate-500">
                        {[variant?.color, variant?.size].filter(Boolean).join(" / ") || "Variant"}
                        {" · "}Qty: {item.quantity}
                      </p>
                      <p className="text-xs text-slate-400">
                        ₹{Number(item.price).toFixed(2)} each
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-slate-950">
                      ₹{Number(item.totalPrice).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cancel */}
          {canCancel && (
            <div className="rounded-3xl border border-rose-100 bg-rose-50 p-5">
              <h3 className="text-sm font-semibold text-rose-800">Cancel order</h3>
              <p className="mt-1 text-xs text-rose-600">
                You can cancel this order while it is pending or packed. Stock will be restored.
              </p>
              {showConfirm ? (
                <div className="mt-3 flex gap-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={cancelling}
                    className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {cancelling ? "Cancelling..." : "Yes, cancel"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfirm(false)}
                    className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700"
                  >
                    Keep order
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowConfirm(true)}
                  className="mt-3 rounded-full border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"
                >
                  Cancel order
                </button>
              )}
            </div>
          )}
        </div>

        {/* Summary sidebar */}
        <div className="space-y-4">
          {/* Totals */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-950">Summary</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-950">
                  ₹{Number(current.totalAmount).toFixed(2)}
                </span>
              </div>
              {current.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span className="font-semibold">−₹{Number(current.discountAmount).toFixed(2)}</span>
                </div>
              )}
              {current.Coupon && (
                <div className="flex justify-between text-slate-500">
                  <span>Coupon</span>
                  <span>{current.Coupon.couponCode}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-slate-200 pt-2 text-base">
                <span className="font-semibold text-slate-950">Total paid</span>
                <span className="font-bold text-slate-950">
                  ₹{Number(current.finalAmount).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment info */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-950">Payment</h2>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Method</span>
                <span className="font-medium capitalize text-slate-950">
                  {current.paymentMethod || "Razorpay"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Status</span>
                <StatusBadge label={current.paymentStatus} styleMap={PAYMENT_STYLES} />
              </div>
              {current.razorpayPaymentId && (
                <div className="flex justify-between">
                  <span>Payment ID</span>
                  <span className="font-mono text-xs text-slate-500">
                    {current.razorpayPaymentId}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Address */}

<div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
  <h2 className="text-base font-semibold text-slate-950">
    Shipping Address
  </h2>

  <div className="mt-4 space-y-3">
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-xs text-slate-400">House No</p>
      <p className="font-semibold text-slate-950">
        {shippingAddress.houseNo || "-"}
      </p>
    </div>

    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-xs text-slate-400">Street</p>
      <p className="font-semibold text-slate-950">
        {shippingAddress.street || "-"}
      </p>
    </div>

    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-xs text-slate-400">Village / Area</p>
      <p className="font-semibold text-slate-950">
        {shippingAddress.village || "-"}
      </p>
    </div>

    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-xs text-slate-400">City</p>
      <p className="font-semibold text-slate-950">
        {shippingAddress.city || "-"}
      </p>
    </div>

    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-xs text-slate-400">Pincode</p>
      <p className="font-semibold text-slate-950">
        {shippingAddress.pincode || "-"}
      </p>
    </div>
  </div>
</div>
               
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
