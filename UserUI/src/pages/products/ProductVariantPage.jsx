import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { fetchNavigation } from "@/features/categories/categoriesThunks";
import { fetchBrands } from "@/features/brands/brandsThunks";
import { fetchProductDetails } from "@/features/productDetails/productDetailsThunks";
import { fetchVariants } from "@/features/variants/variantsThunks";
import { getImageUrl } from "@/utils/image";
import LoadingState from "@/components/common/LoadingState";

const ProductVariantPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { product, loading: productLoading } = useAppSelector((state) => state.productDetails);
  const { variants, loading: variantsLoading } = useAppSelector((state) => state.variants);

  useEffect(() => {
    dispatch(fetchNavigation());
    dispatch(fetchBrands());
    dispatch(fetchProductDetails(id));
    dispatch(fetchVariants({ productId: id, limit: 100 }));
  }, [dispatch, id]);

  const variantList = variants.byProductId?.[id] || [];
  const loading = productLoading || variantsLoading;

  if (loading || !product) {
    return <div className="mx-auto max-w-7xl px-4 py-10"><LoadingState label="Loading variant options..." /></div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-950">{product.name}</h1>
          <p className="mt-2 text-sm text-slate-500">Choose a variant before adding the product to your cart.</p>
        </div>
        <Link to={`/product/${id}`} className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
          View product details
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <p className="text-sm font-semibold uppercase text-slate-400">Description</p>
          <p className="mt-3 text-slate-600">{product.description || "This product has several variants to choose from."}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              Category: <span className="font-semibold text-slate-950">{product.Category?.name || "-"}</span>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              Brand: <span className="font-semibold text-slate-950">{product.Brand?.name || "-"}</span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-950">Available variants</h2>
          <div className="mt-6 grid gap-4">
            {variantList.length ? (
              variantList.map((variant) => (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => navigate(`/product/${id}?variant=${variant.id}`)}
                  className="group grid gap-4 rounded-3xl border border-slate-200 p-4 text-left transition hover:border-slate-400 hover:bg-slate-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="aspect-square w-24 overflow-hidden rounded-3xl bg-slate-100">
                      {variant.image ? (
                        <img src={getImageUrl(variant.image)} alt={variant.color || variant.sku} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-slate-400">No image</div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-950">{variant.color || "Variant"}</h3>
                      <p className="text-sm text-slate-600">Size: {variant.size || "N/A"}</p>
                      <p className="text-sm text-slate-600">Stock: {variant.stock}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                    <span>Price</span>
                    <span className="font-semibold text-slate-950">${variant.price?.toFixed(2) || "0.00"}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="rounded-3xl bg-slate-50 p-8 text-sm text-slate-500">No variants available for this product.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductVariantPage;
