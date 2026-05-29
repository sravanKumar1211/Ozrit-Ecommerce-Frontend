import { useMemo, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getImageUrl } from "@/utils/image";

const CartItemCard = ({ item, loading, onQuantityChange, onRemove }) => {
  const variant = item.productVariant;
  const product = variant?.Product;
  const imageSrc = variant?.image
    ? getImageUrl(variant.image)
    : product?.thumbnail
      ? getImageUrl(product.thumbnail)
      : null;

  // Local quantity state so input feels responsive
  const [localQty, setLocalQty] = useState(item.quantity);
  const debounceRef = useRef(null);

  // Sync if server updates quantity externally
  useEffect(() => {
    setLocalQty(item.quantity);
  }, [item.quantity]);

  const handleQtyChange = (value) => {
    const qty = Math.max(1, Math.min(Number(value), variant?.stock ?? 99));
    if (Number.isNaN(qty)) return;
    setLocalQty(qty);
    // Debounce the API call by 600ms
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (qty !== item.quantity) {
        onQuantityChange(item.id, qty);
      }
    }, 600);
  };

  const itemTotal = useMemo(() => {
    const price = parseFloat(variant?.price || 0);
    return (price * localQty).toFixed(2);
  }, [localQty, variant?.price]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-[100px_1fr_auto]">
        {/* Image */}
        <div className="aspect-square overflow-hidden rounded-2xl bg-slate-100">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={product?.name || variant?.sku}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-slate-400">
              No image
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-2">
          <div>
            {product?.id && (
              <Link
                to={`/product/${product.id}`}
                className="text-base font-semibold text-slate-950 hover:underline"
              >
                {product.name || "Product"}
              </Link>
            )}
            {!product?.id && (
              <p className="text-base font-semibold text-slate-950">Product variant</p>
            )}
            <p className="text-sm text-slate-500">
              {[variant?.color, variant?.size].filter(Boolean).join(" / ") || "Variant"}
            </p>
            {variant?.sku && (
              <p className="text-xs text-slate-400">SKU: {variant.sku}</p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="text-sm text-slate-600">
              Unit price:{" "}
              <span className="font-semibold text-slate-950">
                ₹{Number(variant?.price || 0).toFixed(2)}
              </span>
            </div>
            {variant?.stock !== undefined && (
              <div className={`text-xs font-medium ${variant.stock === 0 ? "text-rose-500" : "text-emerald-600"}`}>
                {variant.stock === 0 ? "Out of stock" : `${variant.stock} available`}
              </div>
            )}
          </div>

          {/* Quantity controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-full border border-slate-200 px-1">
              <button
                type="button"
                disabled={loading || localQty <= 1}
                onClick={() => handleQtyChange(localQty - 1)}
                className="flex h-7 w-7 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 disabled:opacity-40"
              >
                −
              </button>
              <input
                type="number"
                min="1"
                max={variant?.stock ?? 99}
                value={localQty}
                disabled={loading}
                onChange={(e) => handleQtyChange(e.target.value)}
                className="w-10 bg-transparent text-center text-sm font-semibold text-slate-950 outline-none"
              />
              <button
                type="button"
                disabled={loading || localQty >= (variant?.stock ?? 99)}
                onClick={() => handleQtyChange(localQty + 1)}
                className="flex h-7 w-7 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 disabled:opacity-40"
              >
                +
              </button>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={() => onRemove(item.id)}
              className="rounded-full border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
            >
              Remove
            </button>
          </div>
        </div>

        {/* Line total */}
        <div className="flex items-start justify-end">
          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-right">
            <p className="text-xs text-slate-400">Total</p>
            <p className="text-lg font-bold text-slate-950">₹{itemTotal}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
