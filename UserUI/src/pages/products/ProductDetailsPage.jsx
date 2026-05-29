import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { fetchProductDetails } from "@/features/productDetails/productDetailsThunks";
import { fetchFeaturedProducts } from "@/features/products/productsThunks";
import { clearProductDetails } from "@/features/productDetails/productDetailsSlice";
import { addItemToCart } from "@/features/cart/cartThunks";
import { fetchVariants } from "@/features/variants/variantsThunks";
import toast from "react-hot-toast";
import ProductCard from "@/components/product/ProductCard";
import LoadingState from "@/components/common/LoadingState";
import { getImageUrl } from "@/utils/image";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [quantity, setQuantity] = useState(1);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { product, loading: productLoading } = useAppSelector((state) => state.productDetails);
  const { byProductId, loading: variantsLoading } = useAppSelector((state) => state.variants);
  const { featured } = useAppSelector((state) => state.products);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const variantId = searchParams.get("variant");
  const variantList = byProductId[id] || [];

  const selectedVariant = useMemo(
    () => variantList.find((v) => String(v.id) === variantId) || variantList[0] || null,
    [variantId, variantList],
  );

  // Reset quantity when variant changes
  useEffect(() => {
    setQuantity(1);
  }, [variantId]);

  useEffect(() => {
    dispatch(fetchProductDetails(id));
    dispatch(fetchVariants({ productId: id, limit: 100 }));
    // Only fetch featured if not already loaded
    if (!featured.length) dispatch(fetchFeaturedProducts());
    return () => {
      dispatch(clearProductDetails());
    };
  }, [dispatch, id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectVariant = (vid) => {
    setSearchParams({ variant: String(vid) }, { replace: true });
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      navigate(`/product/${id}/variants`);
      return;
    }
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/product/${id}?variant=${selectedVariant.id}` } });
      return;
    }
    if (selectedVariant.stock < quantity) {
      toast.error(`Only ${selectedVariant.stock} in stock`);
      return;
    }
    const result = await dispatch(addItemToCart({ productVariantId: selectedVariant.id, quantity }));
    if (addItemToCart.fulfilled.match(result)) {
      toast.success("Added to cart");
    } else {
      toast.error(result.payload || "Failed to add to cart");
    }
  };

  // Show loading only on initial product load — variants load in background
  if (productLoading && !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <LoadingState label="Loading product..." />
      </div>
    );
  }

  if (!product) return null;

  const relatedProducts = featured
    .filter((item) => item.id !== product.id && item.categoryId === product.categoryId)
    .slice(0, 4);

  const fallbackRelated = featured.filter((item) => item.id !== product.id).slice(0, 4);
  const displayRelated = relatedProducts.length ? relatedProducts : fallbackRelated;

  const mainImage = selectedVariant?.image
    ? getImageUrl(selectedVariant.image)
    : product.thumbnail
      ? getImageUrl(product.thumbnail)
      : null;

  const maxQty = selectedVariant?.stock ?? 99;
  const outOfStock = selectedVariant ? selectedVariant.stock === 0 : false;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
        <Link to="/" className="hover:text-slate-950">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-slate-950">Products</Link>
        {product.Category && (
          <>
            <span>/</span>
            <Link to={`/products?category=${product.categoryId}`} className="hover:text-slate-950">
              {product.Category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-slate-950">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
        {/* Left column */}
        <div className="space-y-6">
          {/* Main image + info */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Image */}
              <div className="overflow-hidden rounded-2xl bg-slate-100">
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt={product.name}
                    className="aspect-square w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-square items-center justify-center text-sm text-slate-400">
                    No image
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {product.Brand?.name || product.Category?.name || "Product"}
                  </p>
                  <h1 className="mt-1 text-2xl font-bold text-slate-950">{product.name}</h1>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-400">Category</p>
                    <p className="font-semibold text-slate-950">{product.Category?.name || "—"}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-400">Subcategory</p>
                    <p className="font-semibold text-slate-950">{product.SubCategory?.name || "—"}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-400">Brand</p>
                    <p className="font-semibold text-slate-950">{product.Brand?.name || "—"}</p>
                  </div>
                  {selectedVariant && (
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-400">Stock</p>
                      <p className={`font-semibold ${selectedVariant.stock === 0 ? "text-rose-600" : "text-emerald-600"}`}>
                        {selectedVariant.stock === 0 ? "Out of stock" : `${selectedVariant.stock} available`}
                      </p>
                    </div>
                  )}
                </div>

                {selectedVariant && (
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {selectedVariant.color && (
                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-400">Color</p>
                        <p className="font-semibold text-slate-950">{selectedVariant.color}</p>
                      </div>
                    )}
                    {selectedVariant.size && (
                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-400">Size</p>
                        <p className="font-semibold text-slate-950">{selectedVariant.size}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">Description</h2>
            <p className="mt-3 leading-7 text-slate-600">
              {product.description || "No description available for this product."}
            </p>
          </div>

          {/* Variant picker */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-950">
                {variantsLoading ? "Loading variants..." : `Variants (${variantList.length})`}
              </h2>
              {variantList.length > 4 && (
                <Link
                  to={`/product/${id}/variants`}
                  className="text-sm font-medium text-slate-600 hover:text-slate-950"
                >
                  View all
                </Link>
              )}
            </div>

            {variantsLoading && !variantList.length ? (
              <div className="mt-4 text-sm text-slate-400">Loading variants...</div>
            ) : variantList.length ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {variantList.slice(0, 6).map((variant) => {
                  const isSelected = selectedVariant?.id === variant.id;
                  const isOos = variant.stock === 0;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      disabled={isOos}
                      onClick={() => handleSelectVariant(variant.id)}
                      className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition
                        ${isSelected ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 hover:border-slate-400"}
                        ${isOos ? "cursor-not-allowed opacity-50" : ""}
                      `}
                    >
                      {variant.image && (
                        <img
                          src={getImageUrl(variant.image)}
                          alt={variant.color || variant.sku}
                          className="h-10 w-10 flex-shrink-0 rounded-xl object-cover"
                        />
                      )}
                      <div className="min-w-0">
                        <p className={`truncate text-sm font-semibold ${isSelected ? "text-white" : "text-slate-950"}`}>
                          {variant.color || `Variant ${variant.id}`}
                        </p>
                        <p className={`text-xs ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                          {variant.size ? `Size: ${variant.size}` : ""}{variant.size && " · "}
                          {isOos ? "Out of stock" : `${variant.stock} left`}
                        </p>
                      </div>
                      <span className={`ml-auto text-sm font-semibold ${isSelected ? "text-white" : "text-slate-950"}`}>
                        ₹{Number(variant.price).toFixed(2)}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-400">No variants available.</p>
            )}
          </div>
        </div>

        {/* Right column — purchase box + related */}
        <div className="space-y-6">
          {/* Purchase box */}
          <div className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">Purchase</h2>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-slate-500">Price</span>
                <span className="text-xl font-bold text-slate-950">
                  {selectedVariant ? `₹${Number(selectedVariant.price).toFixed(2)}` : "—"}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-slate-500">Quantity</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-semibold">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                    disabled={quantity >= maxQty}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>

              {selectedVariant && (
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-semibold text-slate-950">
                    ₹{(Number(selectedVariant.price) * quantity).toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={outOfStock}
              className="mt-5 w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {outOfStock ? "Out of stock" : selectedVariant ? "Add to cart" : "Select a variant"}
            </button>

            {!isAuthenticated && (
              <p className="mt-3 text-center text-xs text-slate-400">
                <Link to="/login" className="underline">Login</Link> to add items to cart
              </p>
            )}
          </div>

          {/* Related products */}
          {displayRelated.length > 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-950">Related products</h2>
              <div className="mt-4 grid gap-4">
                {displayRelated.map((item) => (
                  <ProductCard key={item.id} product={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
