import { useEffect, useRef, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { fetchBrands } from "@/features/brands/brandsThunks";
import { fetchNavigation } from "@/features/categories/categoriesThunks";
import { addItemToCart } from "@/features/cart/cartThunks";
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
  const { products, loading, total } = useAppSelector((state) => state.products);
  const { byProductId } = useAppSelector((state) => state.variants);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const queryParams = useMemo(() => productQueryFromSearchParams(searchParams), [searchParams]);
  const currentPage = Number(searchParams.get("page") || 1);
  const pageLimit = Number(searchParams.get("limit") || 12);

  // Track which product IDs we've already requested variants for to avoid duplicate dispatches
  const requestedVariants = useRef(new Set());

  // One-time data fetches guarded by existing state
  useEffect(() => {
    if (!categories.length) dispatch(fetchNavigation());
    if (!brands.length) dispatch(fetchBrands());
  }, [dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch products whenever query/page changes
  useEffect(() => {
    dispatch(fetchProducts({ ...queryParams, page: currentPage, limit: pageLimit }));
  }, [dispatch, queryParams, currentPage, pageLimit]);

  // Fetch variants for products not yet loaded — use ref to prevent duplicate dispatches
  useEffect(() => {
    products.forEach((product) => {
      const key = String(product.id);
      if (!byProductId[product.id] && !requestedVariants.current.has(key)) {
        requestedVariants.current.add(key);
        dispatch(fetchVariants({ productId: product.id, limit: 20 }));
      }
    });
  }, [dispatch, products]); // byProductId intentionally excluded — ref guards duplicates

  // Clear variant request cache when query changes so new product sets get fetched
  useEffect(() => {
    requestedVariants.current = new Set();
  }, [queryParams]);

  const activeFilters = {
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    subcategory: searchParams.get("subcategory") || "",
    brand: searchParams.get("brand") || "",
    sort: searchParams.get("sort") || "",
  };

  const updateFilters = (changes) => {
    const next = Object.fromEntries(searchParams.entries());
    Object.entries(changes).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        delete next[key];
      } else {
        next[key] = String(value);
      }
    });
    // Changing category resets subcategory
    if (changes.category !== undefined) {
      delete next.subcategory;
    }
    next.page = "1";
    setSearchParams(next);
  };

  const handlePageChange = (_, page) => {
    const next = Object.fromEntries(searchParams.entries());
    next.page = String(page);
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddToCart = async (productId, variantId) => {
    if (!variantId) {
      navigate(`/product/${productId}`);
      return;
    }
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location.pathname + location.search } });
      return;
    }
    const result = await dispatch(addItemToCart({ productVariantId: variantId, quantity: 1 }));
    if (addItemToCart.fulfilled.match(result)) {
      toast.success("Added to cart");
    } else {
      toast.error(result.payload || "Failed to add to cart");
    }
  };

  const pageCount = Math.max(Math.ceil(total / pageLimit), 1);
  const queryLabel = searchParams.get("search") || searchParams.get("category") ? "Search results" : "All products";

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[300px_1fr] lg:px-8">
      <ProductFilterPanel
        categories={categories}
        subCategories={subCategories}
        brands={brands}
        filters={activeFilters}
        onFilterChange={updateFilters}
        onSortChange={(value) => updateFilters({ sort: value })}
        onClearFilters={() => setSearchParams({ page: "1" })}
      />

      <section>
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-950">{queryLabel}</h1>
            <p className="mt-1 text-sm text-slate-500">{total} product{total !== 1 ? "s" : ""} found</p>
          </div>
        </div>

        {loading ? (
          <LoadingState label="Loading products..." />
        ) : products.length ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => {
              const variants = byProductId[product.id] || [];
              const firstVariant = variants.find((v) => v.stock > 0) || variants[0] || null;
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  variant={firstVariant}
                  onAddToCart={(variantId) => handleAddToCart(product.id, variantId)}
                />
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
            No products matched your search. Try adjusting the filters.
          </div>
        )}

        {pageCount > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination
              page={currentPage}
              count={pageCount}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
            />
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductsPage;
