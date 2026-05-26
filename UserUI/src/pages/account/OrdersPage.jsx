import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { fetchMyOrders } from "@/features/orders/ordersThunks";
import { getImageUrl } from "@/utils/image";
import LoadingState from "@/components/common/LoadingState";
import toast from "react-hot-toast";

const STATUS_STYLES = {
  pending:   "bg-amber-50 text-amber-700",
  packed:    "bg-blue-50 text-blue-700",
  shipped:   "bg-indigo-50 text-indigo-700",
  delivered: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-rose-50 text-rose-700",
};

const PAYMENT_STYLES = {
  pending: "bg-amber-50 text-amber-700",
  paid:    "bg-emerald-50 text-emerald-700",
  failed:  "bg-rose-50 text-rose-700",
};

const Badge = ({ label, styleMap }) => {
  const key = (label || "").toLowerCase();
  const cls = styleMap[key] || "bg-slate-100 text-slate-600";
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${cls}`}>
      {label || "—"}
    </span>
  );
};

const OrdersPage = () => {
  const dispatch = useAppDispatch();
  const { orders, loading } = useAppSelector((s) => s.orders);

  useEffect(() => {
    dispatch(fetchMyOrders()).then((res) => {
      if (fetchMyOrders.rejected.match(res)) {
        toast.error(res.payload || "Failed to load orders");
      }
    });
  }, [dispatch]);

  if (loading && !orders.length) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <LoadingState label="Loading orders..." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-950">My Orders</h1>
        <Link to="/products" className="text-sm font-medium text-slate-500 hover:text-slate-950">
          Continue shopping
        </Link>
      </div>

      {!orders.length ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
          <p className="text-slate-500">You have no orders yet.</p>
          <Link
            to="/products"
            className="mt-4 inline-block rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-slate-950">
                      Order #{order.id}
                    </span>
                    <Badge label={order.orderStatus} styleMap={STATUS_STYLES} />
                    <Badge label={order.paymentStatus} styleMap={PAYMENT_STYLES} />
                  </div>

                  <p className="text-xs text-slate-400">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                  {/* Item thumbnails */}
                  <div className="flex flex-wrap gap-2">
                    {order.OrderItems?.slice(0, 4).map((item) => (
                      <div
                        key={item.id}
                        className="h-10 w-10 overflow-hidden rounded-xl bg-slate-100"
                        title={item.Product?.name}
                      >
                        {item.ProductVariant?.image || item.Product?.thumbnail ? (
                          <img
                            src={
                              item.ProductVariant?.image
                                ? getImageUrl(item.ProductVariant.image)
                                : getImageUrl(item.Product.thumbnail)
                            }
                            alt={item.Product?.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-slate-400">
                            —
                          </div>
                        )}
                      </div>
                    ))}
                    {(order.OrderItems?.length || 0) > 4 && (
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-xs font-semibold text-slate-500">
                        +{order.OrderItems.length - 4}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <p className="text-lg font-bold text-slate-950">
                    ₹{Number(order.finalAmount).toFixed(2)}
                  </p>
                  {order.discountAmount > 0 && (
                    <p className="text-xs text-emerald-600">
                      Saved ₹{Number(order.discountAmount).toFixed(2)}
                    </p>
                  )}
                  {/* <Link
                    to={`/orders/${order.id}`}
                    className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    View details
                  </Link> */}

                  <Link
                    to={`/orders/${order.id}`}
                    style={{
                      backgroundColor: "#0f172a",
                      color: "#ffffff",
                    }}
                    className="rounded-full px-4 py-2 text-sm font-semibold"
                  >
                    View Details
                  </Link>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
