import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import {
  fetchCart,
  removeCartItem,
  updateCartItem,
} from "@/features/cart/cartThunks";
import CartItemCard from "@/components/cart/CartItemCard";
import LoadingState from "@/components/common/LoadingState";
import toast from "react-hot-toast";

const CartPage = () => {
  const dispatch = useAppDispatch();
  const { items, subtotal, tax, grandTotal, loading } = useAppSelector(
    (state) => state.cart,
  );

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleQuantityChange = async (cartItemId, quantity) => {
    if (quantity < 1) return;
    const result = await dispatch(updateCartItem({ cartItemId, quantity }));
    if (updateCartItem.rejected.match(result)) {
      toast.error(result.payload || "Failed to update quantity");
    }
  };

  const handleRemove = async (cartItemId) => {
    const result = await dispatch(removeCartItem(cartItemId));
    if (removeCartItem.fulfilled.match(result)) {
      toast.success("Item removed");
    } else {
      toast.error(result.payload || "Failed to remove item");
    }
  };

  if (loading && !items.length) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <LoadingState label="Loading cart..." />
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-slate-950">Shopping Cart</h1>
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-12 text-center">
          <p className="text-slate-500">Your cart is empty.</p>
          <Link
            to="/products"
            className="mt-4 inline-block rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold !text-white hover:bg-slate-800"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-950">
          Shopping Cart
          <span className="ml-2 text-base font-normal text-slate-400">
            ({items.length} item{items.length !== 1 ? "s" : ""})
          </span>
        </h1>
        <Link
          to="/products"
          className="text-sm font-medium text-slate-500 hover:text-slate-950"
        >
          Continue shopping
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {items.map((item) => (
            <CartItemCard
              key={item.id}
              item={item}
              loading={loading}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemove}
            />
          ))}
        </div>

        <div className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:sticky xl:top-24">
          <h2 className="text-lg font-semibold text-slate-950">
            Order summary
          </h2>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-950">
                ₹{Number(subtotal).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tax (10%)</span>
              <span className="font-semibold text-slate-950">
                ₹{Number(tax).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-3 text-base">
              <span className="font-semibold text-slate-950">Total</span>
              <span className="font-bold text-slate-950">
                ₹{Number(grandTotal).toFixed(2)}
              </span>
            </div>
          </div>
          <Link
            to="/checkout"
            className="mt-6 block w-full rounded-full !bg-slate-950 px-5 py-3 text-center text-sm font-semibold !text-white transition hover:!bg-slate-800"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
