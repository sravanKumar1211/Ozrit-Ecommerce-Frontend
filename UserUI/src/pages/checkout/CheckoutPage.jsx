import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { fetchCart } from "@/features/cart/cartThunks";
import { applyCoupon } from "@/features/coupons/couponsThunks";
import { createOrder, createRazorpayOrder, verifyRazorpayPayment } from "@/features/checkout/checkoutThunks";
import LoadingState from "@/components/common/LoadingState";
import toast from "react-hot-toast";

const CheckoutPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, subtotal, tax, grandTotal, loading: cartLoading } = useAppSelector((s) => s.cart);
  const { user } = useAppSelector((s) => s.auth);
  const { applied: appliedCoupon } = useAppSelector((s) => s.coupons || {});
  const [address, setAddress] = useState(
    typeof user?.address === "string" ? user.address : user?.address?.fullAddress || "",
  );
  const [couponCode, setCouponCode] = useState("");
  const [applying, setApplying] = useState(false);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    if (appliedCoupon?.couponCode) {
      setCouponCode(appliedCoupon.couponCode);
    }
  }, [appliedCoupon]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplying(true);
    const res = await dispatch(applyCoupon({ couponCode: couponCode.trim(), totalAmount: subtotal }));
    setApplying(false);
    if (applyCoupon.fulfilled.match(res)) {
      toast.success(`Coupon applied — saved ₹${Number(res.payload.discount || 0).toFixed(2)}`);
    } else {
      const msg = res.payload?.message || res.error?.message || "Failed to apply coupon";
      toast.error(msg);
    }
  };

  const openRazorpayCheckout = (razorPayload, ecommerceOrderId) => {
    const Razorpay = window.Razorpay;
    const razorpayOrder = razorPayload?.razorpayOrder;

    if (!Razorpay || !razorpayOrder?.id) {
      toast.error("Payment gateway unavailable. Check your order in Orders.");
      navigate("/orders");
      return;
    }

    const key = razorPayload.key || import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!key) {
      toast.error("Razorpay key is not configured");
      navigate("/orders");
      return;
    }

    const options = {
      key,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency || "INR",
      name: "Ozrit Shop",
      description: `Order #${ecommerceOrderId}`,
      order_id: razorpayOrder.id,
      handler: async (response) => {
        const verifyRes = await dispatch(
          verifyRazorpayPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }),
        );

        if (verifyRazorpayPayment.fulfilled.match(verifyRes)) {
          toast.success("Payment successful");
          navigate(`/orders/${ecommerceOrderId}`);
        } else {
          toast.error(verifyRes.payload || "Payment verification failed. Contact support if amount was deducted.");
          navigate("/orders");
        }
      },
      prefill: {
        name: user?.name || "",
        email: user?.email || "",
        contact: user?.phone || "",
      },
      theme: { color: "#0f172a" },
    };

    const rzp = new Razorpay(options);
    rzp.on("payment.failed", () => {
      toast.error("Payment failed. You can retry from your orders.");
      navigate("/orders");
    });
    rzp.open();
  };

  const handlePlaceOrder = async () => {
    if (!items.length) {
      toast.error("Your cart is empty");
      return;
    }

    if (!address.trim()) {
      toast.error("Please enter a shipping address");
      return;
    }

    setPlacing(true);
    const orderPayload = {
      couponCode: appliedCoupon?.couponCode || couponCode.trim() || undefined,
      address: address.trim(),
    };

    const res = await dispatch(createOrder(orderPayload));
    if (!createOrder.fulfilled.match(res)) {
      setPlacing(false);
      toast.error(res.payload || "Failed to create order");
      return;
    }

    const order = res.payload.data?.order;
    if (!order?.id) {
      setPlacing(false);
      toast.error("Order created but response was invalid");
      return;
    }

    toast.success("Order created — opening payment");
    const razor = await dispatch(createRazorpayOrder({ orderId: order.id }));
    setPlacing(false);

    if (createRazorpayOrder.fulfilled.match(razor)) {
      openRazorpayCheckout(razor.payload.data, order.id);
    } else {
      toast.error(razor.payload || "Payment initiation failed. View order in Orders.");
      navigate(`/orders/${order.id}`);
    }
  };

  if (cartLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <LoadingState label="Loading cart..." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-950">Checkout</h1>
          <p className="mt-2 text-sm text-slate-500">Complete your purchase</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">Shipping address</h2>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none"
              rows={5}
              placeholder="House no, street, city, pincode"
            />
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">Apply coupon</h2>
            <div className="mt-4 flex gap-3">
              <input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Coupon code"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                disabled={applying}
                className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {applying ? "Applying..." : "Apply"}
              </button>
            </div>
            {appliedCoupon && (
              <div className="mt-3 rounded-2xl bg-emerald-50 p-3 text-sm text-emerald-800">
                Coupon <strong>{appliedCoupon.couponCode}</strong> applied —{" "}
                {appliedCoupon.discountType === "percent"
                  ? `${appliedCoupon.discountValue}%`
                  : `₹${appliedCoupon.discountValue}`}{" "}
                off
              </div>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-950">Order summary</h2>
          <div className="mt-6 space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>Items</span>
              <span className="font-semibold text-slate-950">{items.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-950">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Tax</span>
              <span className="font-semibold text-slate-950">₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-base font-semibold">
              <span>Total</span>
              <span className="text-slate-950">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={placing || !items.length}
            className="mt-6 w-full rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {placing ? "Processing..." : "Pay & Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
