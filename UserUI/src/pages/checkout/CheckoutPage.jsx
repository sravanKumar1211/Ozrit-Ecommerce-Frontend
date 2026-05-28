import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { fetchCart } from "@/features/cart/cartThunks";
import { clearCart } from "@/features/cart/cartSlice";
import { applyCoupon } from "@/features/coupons/couponsThunks";
import { clearCoupon } from "@/features/coupons/couponsSlice";
import {
  createOrder,
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "@/features/checkout/checkoutThunks";
import { clearCheckout } from "@/features/checkout/checkoutSlice";
import { fetchOrderById } from "@/features/orders/ordersThunks";
import { getImageUrl } from "@/utils/image";
import { waitForRazorpay } from "@/utils/razorpay";
import LoadingState from "@/components/common/LoadingState";
import toast from "react-hot-toast";

const CheckoutPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    items,
    subtotal,
    tax,
    grandTotal,
    loading: cartLoading,
  } = useAppSelector((s) => s.cart);
  const { user } = useAppSelector((s) => s.auth);
  const {
    applied: appliedCoupon,
    discount,
    discountedTotal,
  } = useAppSelector((s) => s.coupons);
  const { loading: checkoutLoading } = useAppSelector((s) => s.checkout);

  const [couponCode, setCouponCode] = useState("");
  const [couponApplying, setCouponApplying] = useState(false);
  const [placing, setPlacing] = useState(false);

  const address =
    typeof user?.address === "string"
      ? (() => {
          try {
            return JSON.parse(user.address);
          } catch {
            return {};
          }
        })()
      : user?.address || {};

  const isAddressComplete =
    address.houseNo?.trim() &&
    address.street?.trim() &&
    address.village?.trim() &&
    address.city?.trim() &&
    address.pincode?.trim();

  // Sync coupon code input if coupon already applied
  useEffect(() => {
    if (appliedCoupon?.couponCode) setCouponCode(appliedCoupon.couponCode);
  }, [appliedCoupon]);

  useEffect(() => {
    dispatch(fetchCart());
    return () => {
      // Don't clear coupon on unmount — user may navigate back
    };
  }, [dispatch]);

  // ─── Coupon ────────────────────────────────────────────────────────────────
  const handleApplyCoupon = async () => {
    const code = couponCode.trim();
    if (!code) return;
    setCouponApplying(true);
    const res = await dispatch(
      applyCoupon({ couponCode: code, totalAmount: subtotal }),
    );
    setCouponApplying(false);
    if (applyCoupon.fulfilled.match(res)) {
      toast.success(
        `Coupon applied — saved ₹${Number(res.payload.discount || 0).toFixed(2)}`,
      );
    } else {
      toast.error(res.payload || "Invalid coupon");
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(clearCoupon());
    setCouponCode("");
  };

  // ─── Razorpay popup ────────────────────────────────────────────────────────
  const openRazorpayPopup = async (razorpayData, ecommerceOrderId) => {
    let RazorpayClass;
    try {
      RazorpayClass = await waitForRazorpay();
    } catch {
      toast.error("Payment gateway unavailable. Check your order in Orders.");
      navigate(`/orders/${ecommerceOrderId}`);
      return;
    }

    const key = razorpayData.key || import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!key) {
      toast.error("Razorpay key not configured");
      navigate(`/orders/${ecommerceOrderId}`);
      return;
    }

    const rzpOrder = razorpayData.razorpayOrder;
    if (!rzpOrder?.id) {
      toast.error("Invalid Razorpay order data");
      navigate(`/orders/${ecommerceOrderId}`);
      return;
    }

    return new Promise((resolve) => {
      const options = {
        key,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency || "INR",
        name: "Ozrit Shop",
        description: `Order #${ecommerceOrderId}`,
        order_id: rzpOrder.id,
        handler: async (response) => {
          // Verify signature (but don't rely on response for status update)
          const verifyRes = await dispatch(
            verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          );

          if (!verifyRazorpayPayment.fulfilled.match(verifyRes)) {
            toast.error(
              verifyRes.payload ||
                "Payment verification failed. Contact support if amount was deducted.",
            );
            resolve({ success: false });
            return;
          }

          // Synchronous signature verified successfully!
          toast.success("Order placed successfully 🎉");
          resolve({ success: true });
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        theme: { color: "#0f172a" },
        modal: {
          ondismiss: () => {
            toast(
              "Payment cancelled. Your order is saved — you can pay later from Orders.",
              {
                icon: "ℹ️",
              },
            );
            resolve({ success: false, dismissed: true });
          },
        },
      };

      const rzp = new RazorpayClass(options);
      rzp.on("payment.failed", (response) => {
        toast.error(
          response?.error?.description ||
            "Payment failed. Retry from your Orders page.",
        );
        resolve({ success: false });
      });
      rzp.open();
    });
  };

  // ─── Place order ───────────────────────────────────────────────────────────
  const handlePlaceOrder = async () => {
    if (!items.length) {
      toast.error("Your cart is empty");
      return;
    }

    // Validate that user has configured an address

    if (!isAddressComplete) {
      toast.error("Please add your shipping address before placing an order");
      navigate("/profile");
      return;
    }

    // Step 1: Create ecommerce order
    const orderRes = await dispatch(
      createOrder({
        couponCode: appliedCoupon?.couponCode || undefined,
        address: user.address,
      }),
    );

    if (!createOrder.fulfilled.match(orderRes)) {
      setPlacing(false);
      toast.error(orderRes.payload || "Failed to create order");
      return;
    }

    const order = orderRes.payload.data?.order;
    if (!order?.id) {
      setPlacing(false);
      toast.error("Order created but response was invalid");
      return;
    }

    // Step 2: Create Razorpay order
    const razorRes = await dispatch(createRazorpayOrder({ orderId: order.id }));

    if (!createRazorpayOrder.fulfilled.match(razorRes)) {
      setPlacing(false);
      toast.error(
        razorRes.payload || "Payment initiation failed. View order in Orders.",
      );
      navigate(`/orders/${order.id}`);
      return;
    }

    // Step 3: Open Razorpay popup
    const result = await openRazorpayPopup(razorRes.payload.data, order.id);
    setPlacing(false);

    // Step 4: Post-payment cleanup
    dispatch(clearCart());
    dispatch(clearCoupon());
    dispatch(clearCheckout());

          if (result?.success) {
        toast.success("Order placed successfully 🎉");
        setTimeout(() => {
          navigate("/orders");
        }, 1000);
        return;
      }
    
    else if (!result?.dismissed) {
      navigate(`/orders/${order.id}`);
    } else {
      // Dismissed — stay or go to orders
      navigate("/orders");
    }
  };

  // ─── Computed totals ───────────────────────────────────────────────────────
  const displaySubtotal = subtotal;
  const displayDiscount = appliedCoupon ? discount : 0;
  const displayTotal = appliedCoupon ? discountedTotal : grandTotal;

  if (cartLoading && !items.length) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <LoadingState label="Loading cart..." />
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-slate-950">Checkout</h1>
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-12 text-center">
          <p className="text-slate-500">Your cart is empty.</p>
          <Link
            to="/products"
            className="mt-4 inline-block rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-950">Checkout</h1>
        <nav className="mt-1 flex items-center gap-2 text-sm text-slate-500">
          <Link to="/cart" className="hover:text-slate-950">
            Cart
          </Link>
          <span>/</span>
          <span className="text-slate-950">Checkout</span>
        </nav>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Left column */}
        <div className="space-y-5">
          {/* Shipping info */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-950">
              Customer Details
            </h2>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-400">Name</p>
                <p className="font-semibold text-slate-950">
                  {user?.name || "—"}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-400">Email</p>
                <p className="font-semibold text-slate-950">
                  {user?.email || "—"}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-400">Phone</p>
                <p className="font-semibold text-slate-950">
                  {user?.phone || "—"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-950">
                Shipping Address
              </h2>

              {isAddressComplete && (
                <Link
                  to="/profile"
                  className="text-xs font-medium text-slate-500 hover:text-slate-950"
                >
                  Edit Address
                </Link>
              )}
            </div>

            {!isAddressComplete ? (
              <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                <p className="text-sm text-slate-500">
                  No shipping address found.
                </p>
                <Link
                to="/profile"
                style={{
                  backgroundColor: "#020617",
                  color: "#ffffff",
                }}
                className="mt-4 inline-flex rounded-full px-5 py-2.5 text-sm font-semibold"
              >
                Add Address
              </Link>
              </div>
            ) : (
              <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-400">House No</p>
                  <p className="font-semibold text-slate-950">
                    {address.houseNo}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-400">Street</p>
                  <p className="font-semibold text-slate-950">
                    {address.street}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-400">Village / Area</p>
                  <p className="font-semibold text-slate-950">
                    {address.village}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-400">City</p>
                  <p className="font-semibold text-slate-950">{address.city}</p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3 sm:col-span-2">
                  <p className="text-xs text-slate-400">Pincode</p>
                  <p className="font-semibold text-slate-950">
                    {address.pincode}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Cart items summary */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-950">
              Items ({items.length})
            </h2>
            <div className="mt-4 space-y-3">
              {items.map((item) => {
                const variant = item.productVariant;
                const product = variant?.Product;
                const img = variant?.image
                  ? getImageUrl(variant.image)
                  : product?.thumbnail
                    ? getImageUrl(product.thumbnail)
                    : null;
                return (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
                      {img ? (
                        <img
                          src={img}
                          alt={product?.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-slate-400">
                          —
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-950">
                        {product?.name || "Product"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {[variant?.color, variant?.size]
                          .filter(Boolean)
                          .join(" / ")}{" "}
                        × {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-slate-950">
                      ₹{Number(item.total || 0).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Coupon */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-950">Coupon</h2>
            {appliedCoupon ? (
              <div className="mt-4 flex items-center justify-between rounded-2xl bg-emerald-50 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-emerald-800">
                    {appliedCoupon.couponCode}
                  </p>
                  <p className="text-xs text-emerald-600">
                    {appliedCoupon.discountType === "percent"
                      ? `${appliedCoupon.discountValue}% off`
                      : `₹${appliedCoupon.discountValue} off`}
                    {" · "}Saving ₹{Number(discount).toFixed(2)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="text-xs font-semibold text-rose-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="mt-4 flex gap-3">
                <input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                  placeholder="Enter coupon code"
                  className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm uppercase outline-none focus:border-slate-400"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={couponApplying || !couponCode.trim()}
                  className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {couponApplying ? "Checking..." : "Apply"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right column — order summary */}
        <div className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
          <h2 className="text-base font-semibold text-slate-950">
            Order summary
          </h2>

          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal ({items.length} items)</span>
              <span className="font-semibold text-slate-950">
                ₹{Number(displaySubtotal).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tax (10%)</span>
              <span className="font-semibold text-slate-950">
                ₹{Number(tax).toFixed(2)}
              </span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount ({appliedCoupon.couponCode})</span>
                <span className="font-semibold">
                  −₹{Number(displayDiscount).toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between border-t border-slate-200 pt-3 text-base">
              <span className="font-semibold text-slate-950">Total</span>
              <span className="text-xl font-bold text-slate-950">
                ₹{Number(displayTotal).toFixed(2)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={placing || checkoutLoading || !items.length}
            className="mt-6 w-full rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {placing || checkoutLoading ? "Processing..." : "Pay & Place Order"}
          </button>

          <p className="mt-3 text-center text-xs text-slate-400">
            Secured by Razorpay · Payment verified server-side
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
