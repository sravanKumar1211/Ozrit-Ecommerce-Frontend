import { Link } from "react-router-dom";
import { getImageUrl } from "@/utils/image";

const ProductCard = ({ product, variant, onAddToCart }) => {
  const hasVariant = Boolean(variant);
  const inStock = hasVariant && variant.stock > 0;
  const price = hasVariant ? `$${Number(variant.price).toFixed(2)}` : null;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-4/3 overflow-hidden bg-slate-100">
          {product.thumbnail ? (
            <img
              src={getImageUrl(product.thumbnail)}
              alt={product.name}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              No image
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {product.Brand?.name || product.Category?.name || "Product"}
          </p>
          <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-slate-950">
            {product.name}
          </h3>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2">
          <div>
            {price ? (
              <span className="text-base font-bold text-slate-950">{price}</span>
            ) : (
              <span className="text-sm text-slate-400">See details</span>
            )}
            {hasVariant && (
              <p className={`text-xs ${inStock ? "text-emerald-600" : "text-rose-500"}`}>
                {inStock ? `${variant.stock} in stock` : "Out of stock"}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/product/${product.id}`}
              className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Details
            </Link>
            {onAddToCart && (
              <button
                type="button"
                onClick={() => onAddToCart(variant?.id)}
                disabled={hasVariant && !inStock}
                className="rounded-full bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {!hasVariant ? "View" : inStock ? "Add" : "OOS"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
