import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { fetchCart } from "@/features/cart/cartThunks";
import { applyCoupon } from "@/features/coupons/couponsThunks";
import { createOrder, createRazorpayOrder } from "@/features/checkout/checkoutThunks";
import LoadingState from "@/components/common/LoadingState";
import toast from "react-hot-toast";

const CheckoutPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, subtotal, tax, grandTotal, loading: cartLoading } = useAppSelector((s) => s.cart);
  const { user } = useAppSelector((s) => s.auth);
  const { applied: appliedCoupon } = useAppSelector((s) => s.coupons || {});
  const [address, setAddress] = useState(user?.address || "");
  const [couponCode, setCouponCode] = useState("");
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setApplying(true);
    const res = await dispatch(applyCoupon({ couponCode, totalAmount: subtotal }));
    setApplying(false);
    if (applyCoupon.fulfilled.match(res)) {
      toast.success(`Coupon applied — saved $${res.payload.discount.toFixed(2)}`);
      dispatch(fetchCart());
    } else {
      const msg = res.payload?.message || res.error?.message || "Failed to apply coupon";
      toast.error(msg);
    }
  };

  const handlePlaceOrder = async () => {
    const orderPayload = { couponCode: couponCode || null, address };
    const res = await dispatch(createOrder(orderPayload));
    if (createOrder.fulfilled.match(res)) {
      toast.success("Order created — opening payment");
      const order = res.payload.data?.order;
      const razor = await dispatch(createRazorpayOrder({ orderId: order.id, amount: Math.round(order.finalAmount * 100) }));
      if (createRazorpayOrder.fulfilled.match(razor)) {
        const razorData = razor.payload.data;
        const options = {
          key: razorData.key,
          amount: razorData.order.amount,
          currency: razorData.order.currency,
          name: "Ozrit Shop",
          order_id: razorData.order.id,
          handler: function (response) {
            navigate('/orders');
          },
        };
        // eslint-disable-next-line no-undef
        const Razorpay = window.Razorpay;
        if (Razorpay) {
          const rzp = new Razorpay(options);
          rzp.open();
        } else {
          toast.error("Payment script not available; redirecting to orders");
          navigate('/orders');
        }
      } else {
        toast.error("Payment initiation failed; check orders");
        navigate('/orders');
      }
    }
  };

  if (cartLoading) return <div className="mx-auto max-w-7xl px-4 py-10"><LoadingState label="Loading cart..." /></div>;

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
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none" rows={5} />
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">Apply coupon</h2>
            <div className="mt-4 flex gap-3">
              <input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Coupon code" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" />
              <button onClick={handleApplyCoupon} disabled={applying} className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">{applying ? 'Applying...' : 'Apply'}</button>
            </div>
            {appliedCoupon && (
              <div className="mt-3 rounded-2xl bg-emerald-50 p-3 text-sm text-emerald-800">
                Coupon <strong>{appliedCoupon.couponCode}</strong> applied — {appliedCoupon.discountType === 'percent' ? `${appliedCoupon.discountValue}%` : `$${appliedCoupon.discountValue}`} off
              </div>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-950">Order summary</h2>
          <div className="mt-6 space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between"><span>Items</span><span className="font-semibold text-slate-950">{items.length}</span></div>
            <div className="flex items-center justify-between"><span>Subtotal</span><span className="font-semibold text-slate-950">${subtotal.toFixed(2)}</span></div>
            <div className="flex items-center justify-between"><span>Tax</span><span className="font-semibold text-slate-950">${tax.toFixed(2)}</span></div>
            <div className="flex items-center justify-between text-base font-semibold"><span>Total</span><span className="text-slate-950">${grandTotal.toFixed(2)}</span></div>
          </div>
          <button onClick={handlePlaceOrder} className="mt-6 w-full rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white">Pay & Place Order</button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
