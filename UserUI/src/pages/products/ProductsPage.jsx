import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { fetchBrands } from "@/features/brands/brandsThunks";
import { fetchNavigation } from "@/features/categories/categoriesThunks";
import { addItemToCart, fetchCart } from "@/features/cart/cartThunks";
import { fetchProducts } from "@/features/products/productsThunks";
import { fetchVariants } from "@/features/variants/variantsThunks";
import toast from "react-hot-toast";
import { productQueryFromSearchParams } from "@/utils/query";
import ProductFilterPanel from "@/components/products/ProductFilterPanel";
import ProductCard from "@/components/product/ProductCard";
import LoadingState from "@/components/common/LoadingState";

const ProductsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { categories, subCategories } = useAppSelector((state) => state.categories);
  const { brands } = useAppSelector((state) => state.brands);
  const { products, loading, total, limit } = useAppSelector((state) => state.products);
  const { byProductId } = useAppSelector((state) => state.variants);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const queryParams = useMemo(() => ({ ...productQueryFromSearchParams(searchParams), limit: Number(searchParams.get("limit") || 12) }), [searchParams]);
  const currentPage = Number(searchParams.get("page") || 1);
  const sort = searchParams.get("sort") || "";

  useEffect(() => {
    dispatch(fetchNavigation());
    dispatch(fetchBrands());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProducts({ ...queryParams, page: currentPage, sort }));
  }, [dispatch, queryParams, currentPage, sort]);

  useEffect(() => {
    products.forEach((product) => {
      if (!byProductId[product.id]) {
        dispatch(fetchVariants({ productId: product.id, limit: 20 }));
      }
    });
  }, [dispatch, products, byProductId]);

  const activeFilters = {
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    subcategory: searchParams.get("subcategory") || "",
    brand: searchParams.get("brand") || "",
    sort,
  };

  const updateFilters = (changes) => {
    const next = Object.fromEntries(searchParams.entries());
    Object.entries(changes).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
    });
    if (changes.category) {
      next.delete("subcategory");
    }
    next.set("page", "1");
    setSearchParams(next);
  };

  const handlePageChange = (_, page) => {
    const next = Object.fromEntries(searchParams.entries());
    next.set("page", String(page));
    setSearchParams(next);
  };

  const handleAddToCart = async (productId, variantId) => {
    if (!variantId) {
      navigate(`/product/${productId}`);
      return;
    }

    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/product/${productId}` } });
      return;
    }

    const result = await dispatch(addItemToCart({ productVariantId: variantId, quantity: 1 }));
    if (addItemToCart.fulfilled.match(result)) {
      toast.success("Product added to cart");
      dispatch(fetchCart());
    } else {
      toast.error(result.payload || result.error?.message || "Failed to add to cart");
    }
  };

  const pageCount = Math.max(Math.ceil(total / queryParams.limit), 1);
  const queryLabel = searchParams.get("search") || "All products";

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[320px_1fr] lg:px-8">
      <ProductFilterPanel categories={categories} subCategories={subCategories} brands={brands} filters={activeFilters} onFilterChange={updateFilters} onSortChange={(value) => updateFilters({ sort: value })} onClearFilters={() => setSearchParams({ page: "1" })} />

      <section>
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-950">{queryLabel}</h1>
            <p className="mt-1 text-sm text-slate-500">{total} products found.</p>
          </div>
        </div>

        {loading ? (
          <LoadingState label="Loading products..." />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => {
              const firstVariant = byProductId[product.id]?.[0] || null;
              return <ProductCard key={product.id} product={product} variant={firstVariant} onAddToCart={(variantId) => handleAddToCart(product.id, variantId)} />;
            })}
          </div>
        )}

        {!loading && !products.length && (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
            No products matched this search.
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <Pagination page={currentPage} count={pageCount} onChange={handlePageChange} color="primary" />
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;
