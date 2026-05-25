import { useMemo } from "react";
import { getImageUrl } from "@/utils/image";

const CartItemCard = ({ item, loading, onQuantityChange, onRemove }) => {
  const variant = item.productVariant;
  const product = variant?.Product;
  const imageSrc = variant?.image ? getImageUrl(variant.image) : getImageUrl(product?.thumbnail);

  const itemTotal = useMemo(() => {
    const price = parseFloat(variant?.price || 0);
    return (price * (item.quantity || 1)).toFixed(2);
  }, [item.quantity, variant]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-[120px_1fr_auto]">
        <div className="aspect-square overflow-hidden rounded-3xl bg-slate-100">
          {imageSrc ? (
            <img src={imageSrc} alt={product?.name || variant?.sku} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">No image</div>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-950">{product?.name || "Product variant"}</h3>
            <p className="text-sm text-slate-500">{variant?.color ? `${variant.color} / ${variant.size || "N/A"}` : "Variant details"}</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">
              Price: <span className="font-semibold text-slate-900">${variant?.price?.toFixed(2) || "0.00"}</span>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">
              Stock: <span className="font-semibold text-slate-900">{variant?.stock ?? "N/A"}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex items-center gap-2 text-sm text-slate-600">
              Quantity
              <input
                type="number"
                min="1"
                max={variant?.stock ?? 99}
                value={item.quantity}
                disabled={loading}
                onChange={(event) => onQuantityChange(item.id, Number(event.target.value))}
                className="w-20 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none"
              />
            </label>
            <button type="button" disabled={loading} onClick={() => onRemove(item.id)} className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:opacity-60">
              Remove
            </button>
          </div>
        </div>

        <div className="flex flex-col items-end justify-between gap-4">
          <div className="rounded-3xl bg-slate-50 px-4 py-3 text-right text-sm text-slate-600">
            Total <span className="block text-xl font-semibold text-slate-950">${itemTotal}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
