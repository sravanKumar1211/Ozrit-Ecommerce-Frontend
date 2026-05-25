import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { fetchProductDetails } from "@/features/productDetails/productDetailsThunks";
import { fetchFeaturedProducts } from "@/features/products/productsThunks";
import { clearProductDetails } from "@/features/productDetails/productDetailsSlice";
import { addItemToCart, fetchCart } from "@/features/cart/cartThunks";
import { fetchVariants } from "@/features/variants/variantsThunks";
import toast from "react-hot-toast";
import ProductCard from "@/components/product/ProductCard";
import LoadingState from "@/components/common/LoadingState";
import { getImageUrl } from "@/utils/image";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
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
    () => variantList.find((item) => String(item.id) === variantId) || variantList[0] || null,
    [variantId, variantList],
  );

  useEffect(() => {
    dispatch(fetchProductDetails(id));
    dispatch(fetchVariants({ productId: id, limit: 100 }));
    dispatch(fetchFeaturedProducts());
    return () => {
      dispatch(clearProductDetails());
    };
  }, [dispatch, id]);

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      navigate(`/product/${id}/variants`);
      return;
    }

    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/product/${id}` } });
      return;
    }

    const result = await dispatch(addItemToCart({ productVariantId: selectedVariant.id, quantity }));
    if (addItemToCart.fulfilled.match(result)) {
      toast.success("Product added to cart");
      dispatch(fetchCart());
    } else {
      toast.error(result.payload || result.error?.message || "Failed to add to cart");
    }
  };

  if (productLoading || variantsLoading || !product) {
    return <div className="mx-auto max-w-7xl px-4 py-10"><LoadingState label="Loading product..." /></div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
              <div className="overflow-hidden rounded-3xl bg-slate-100">
                {selectedVariant?.image ? (
                  <img src={getImageUrl(selectedVariant.image)} alt={product.name} className="aspect-4/3 w-full object-cover" />
                ) : product.thumbnail ? (
                  <img src={getImageUrl(product.thumbnail)} alt={product.name} className="aspect-4/3 w-full object-cover" />
                ) : (
                  <div className="flex aspect-4/3 items-center justify-center bg-slate-100 text-slate-400">No image</div>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold uppercase text-slate-400">{product.Brand?.name || "Product"}</p>
                  <h1 className="mt-2 text-3xl font-bold text-slate-950">{product.name}</h1>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                    Category: <span className="font-semibold text-slate-950">{product.Category?.name || "-"}</span>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                    Subcategory: <span className="font-semibold text-slate-950">{product.SubCategory?.name || "-"}</span>
                  </div>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
                  {selectedVariant ? (
                    <>
                      <div>Color: {selectedVariant.color || "N/A"}</div>
                      <div>Size: {selectedVariant.size || "N/A"}</div>
                      <div>Stock: {selectedVariant.stock}</div>
                    </>
                  ) : (
                    "Choose a variant to see price and stock."
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-950">Product description</h2>
              <p className="mt-4 text-slate-600">{product.description || "No description available."}</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-950">Purchase</h2>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <span>Price</span>
                  <span className="font-semibold text-slate-950">${selectedVariant?.price?.toFixed(2) || "0.00"}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <span>Quantity</span>
                  <input
                    value={quantity}
                    min="1"
                    max={selectedVariant?.stock || 99}
                    onChange={(event) => setQuantity(Math.max(1, Number(event.target.value)))}
                    type="number"
                    className="w-24 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none"
                  />
                </div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-950">${selectedVariant ? (selectedVariant.price * quantity).toFixed(2) : "0.00"}</span>
                </div>
              </div>
              <button type="button" onClick={handleAddToCart} className="mt-6 w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
                {selectedVariant ? "Add to cart" : "Select a variant"}
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-950">Variant options</h2>
              <Link to={`/product/${id}/variants`} className="text-sm font-medium text-slate-700 hover:text-slate-950">
                View all variants
              </Link>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {variantList.slice(0, 4).map((variant) => (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => navigate(`/product/${id}?variant=${variant.id}`)}
                  className="rounded-3xl border border-slate-200 p-4 text-left transition hover:border-slate-400 hover:bg-slate-50"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-slate-950">{variant.color || "Variant"}</span>
                    <span className="text-sm text-slate-600">{variant.size || "N/A"}</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">Stock: {variant.stock}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">Related products</h2>
            <div className="mt-6 grid gap-4">
              {featured.filter((item) => item.id !== product.id).slice(0, 3).map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
