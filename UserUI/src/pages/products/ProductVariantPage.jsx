import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { fetchProductDetails } from "@/features/productDetails/productDetailsThunks";
import { fetchVariants } from "@/features/variants/variantsThunks";
import { addItemToCart } from "@/features/cart/cartThunks";
import toast from "react-hot-toast";
import { getImageUrl } from "@/utils/image";
import LoadingState from "@/components/common/LoadingState";

const ProductVariantPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { product, loading: productLoading } = useAppSelector((state) => state.productDetails);
  const { byProductId, loading: variantsLoading } = useAppSelector((state) => state.variants);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProductDetails(id));
    dispatch(fetchVariants({ productId: id, limit: 100 }));
  }, [dispatch, id]);

  const variantList = byProductId[id] || [];
  const loading = productLoading && !product;

  const handleSelectVariant = (variantId) => {
    navigate(`/product/${id}?variant=${variantId}`);
  };

  const handleAddToCart = async (variant) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/product/${id}/variants` } });
      return;
    }
    if (variant.stock === 0) {
      toast.error("This variant is out of stock");
      return;
    }
    const result = await dispatch(addItemToCart({ productVariantId: variant.id, quantity: 1 }));
    if (addItemToCart.fulfilled.match(result)) {
      toast.success("Added to cart");
    } else {
      toast.error(result.payload || "Failed to add to cart");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <LoadingState label="Loading variants..." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <nav className="mb-2 flex items-center gap-2 text-sm text-slate-500">
            <Link to="/products" className="hover:text-slate-950">Products</Link>
            <span>/</span>
            <Link to={`/product/${id}`} className="hover:text-slate-950">{product?.name || "Product"}</Link>
            <span>/</span>
            <span className="text-slate-950">Variants</span>
          </nav>
          <h1 className="text-2xl font-semibold text-slate-950">{product?.name || "Choose a variant"}</h1>
          <p className="mt-1 text-sm text-slate-500">Select a variant to view details or add directly to cart.</p>
        </div>
        <Link
          to={`/product/${id}`}
          className="shrink-0 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          ← Product details
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Product summary sidebar */}
        {product && (
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:self-start">
            {product.thumbnail && (
              <div className="mb-4 overflow-hidden rounded-2xl bg-slate-100">
                <img
                  src={getImageUrl(product.thumbnail)}
                  alt={product.name}
                  className="aspect-square w-full object-cover"
                />
              </div>
            )}
            <h2 className="font-semibold text-slate-950">{product.name}</h2>
            {product.description && (
              <p className="mt-2 line-clamp-3 text-sm text-slate-500">{product.description}</p>
            )}
            <div className="mt-4 space-y-2 text-sm">
              {product.Category && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Category</span>
                  <span className="font-medium text-slate-950">{product.Category.name}</span>
                </div>
              )}
              {product.Brand && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Brand</span>
                  <span className="font-medium text-slate-950">{product.Brand.name}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">Variants</span>
                <span className="font-medium text-slate-950">{variantList.length}</span>
              </div>
            </div>
          </div>
        )}

        {/* Variant grid */}
        <div>
          {variantsLoading && !variantList.length ? (
            <LoadingState label="Loading variants..." />
          ) : variantList.length ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {variantList.map((variant) => {
                const isOos = variant.stock === 0;
                return (
                  <div
                    key={variant.id}
                    className={`rounded-3xl border bg-white p-4 shadow-sm transition
                      ${isOos ? "border-slate-100 opacity-60" : "border-slate-200 hover:border-slate-400 hover:shadow-md"}
                    `}
                  >
                    {/* Variant image */}
                    <div className="mb-4 overflow-hidden rounded-2xl bg-slate-100">
                      {variant.image ? (
                        <img
                          src={getImageUrl(variant.image)}
                          alt={variant.color || variant.sku}
                          className="aspect-square w-full object-cover"
                        />
                      ) : (
                        <div className="flex aspect-square items-center justify-center text-sm text-slate-400">
                          No image
                        </div>
                      )}
                    </div>

                    {/* Variant info */}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-slate-950">
                            {variant.color || `Variant ${variant.id}`}
                          </p>
                          {variant.size && (
                            <p className="text-sm text-slate-500">Size: {variant.size}</p>
                          )}
                          {variant.sku && (
                            <p className="text-xs text-slate-400">SKU: {variant.sku}</p>
                          )}
                        </div>
                        <span className="text-lg font-bold text-slate-950">
                          ₹{Number(variant.price).toFixed(2)}
                        </span>
                      </div>

                      <div className={`text-sm font-medium ${isOos ? "text-rose-500" : "text-emerald-600"}`}>
                        {isOos ? "Out of stock" : `${variant.stock} in stock`}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleSelectVariant(variant.id)}
                          className="flex-1 rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          View details
                        </button>
                        <button
                          type="button"
                          disabled={isOos}
                          onClick={() => handleAddToCart(variant)}
                          className="flex-1 rounded-full bg-slate-950 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Add to cart
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500">
              No variants available for this product.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductVariantPage;
