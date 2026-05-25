import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { fetchCart, removeCartItem, updateCartItem } from "@/features/cart/cartThunks";
import CartItemCard from "@/components/cart/CartItemCard";
import LoadingState from "@/components/common/LoadingState";

const CartPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, subtotal, tax, grandTotal, loading } = useAppSelector((state) => state.cart);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    dispatch(fetchCart());
  }, [dispatch, isAuthenticated, navigate]);

  const handleQuantityChange = (cartItemId, quantity) => {
    if (quantity < 1) return;
    dispatch(updateCartItem({ cartItemId, quantity }));
  };

  const handleRemove = (cartItemId) => {
    dispatch(removeCartItem(cartItemId));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-950">Shopping Cart</h1>
          <p className="mt-2 text-sm text-slate-500">Manage your cart items before checkout.</p>
        </div>
      </div>

      {loading ? (
        <LoadingState label="Loading cart..." />
      ) : !items.length ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500">
          Your cart is empty. Add a product first to begin shopping.
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.8fr_0.9fr]">
          <div className="space-y-6">
            {items.map((item) => (
              <CartItemCard key={item.id} item={item} loading={loading} onQuantityChange={handleQuantityChange} onRemove={handleRemove} />
            ))}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">Order summary</h2>
            <div className="mt-6 space-y-4 text-sm text-slate-600">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-950">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span>Tax</span>
                <span className="font-semibold text-slate-950">${tax.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between pt-3">
                <span className="text-base font-semibold">Grand total</span>
                <span className="text-base font-semibold text-slate-950">${grandTotal.toFixed(2)}</span>
              </div>
            </div>
            <button type="button" disabled className="mt-6 w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white opacity-70">
              Continue to checkout
            </button>
            <p className="mt-4 text-sm text-slate-500">Checkout is not included in this stage.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
