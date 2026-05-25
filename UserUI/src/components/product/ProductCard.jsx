import { Link } from "react-router-dom";
import { getImageUrl } from "@/utils/image";

const ProductCard = ({ product, variant, onAddToCart }) => {
  const canAdd = Boolean(variant && variant.stock > 0);
  const displayPrice = variant?.price ?? "See details";
  const stockLabel = variant ? `${variant.stock} in stock` : "Select variant";

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-4/3 bg-slate-100">
          {product.thumbnail ? (
            <img src={getImageUrl(product.thumbnail)} alt={product.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">No image</div>
          )}
        </div>
      </Link>
      <div className="space-y-3 p-4">
        <div>
          <p className="text-xs font-medium uppercase text-slate-400">{product.Brand?.name || product.Category?.name || "Product"}</p>
          <h3 className="line-clamp-2 min-h-11 text-sm font-semibold text-slate-950">{product.name}</h3>
        </div>
        <div className="grid gap-2 text-sm text-slate-600">
          <span className="font-semibold text-slate-900">${displayPrice}</span>
          <span>{stockLabel}</span>
        </div>
        <div className="flex items-center justify-between gap-3 pt-2">
          <Link to={`/product/${product.id}`} className="text-sm font-semibold text-slate-700 hover:text-slate-950">
            Details
          </Link>
          <button
            type="button"
            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={() => onAddToCart?.(variant?.id)}
            disabled={!canAdd}
          >
            {canAdd ? "Add to cart" : "Choose variant"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
