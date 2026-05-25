import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { loadProducts, removeProduct } from "@/state/slices/productSlice";
import Breadcrumbs from "@/components/Breadcrumbs";
import Pagination from "@/components/Pagination";
import useDebounce from "@/hooks/useDebounce";

const ProductsPage = () => {
  const dispatch = useDispatch();
  const { products, total, limit, error } = useSelector((state) => state.products);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearch = useDebounce(search, 450);

  useEffect(() => {
    dispatch(loadProducts({ search: debouncedSearch, page: currentPage, limit }));
  }, [dispatch, debouncedSearch, currentPage, limit]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);


  const handleDelete = async (id) => {
  const confirmed = window.confirm("Are you sure you want to delete this product?");
  if (!confirmed) return;
  const result = await dispatch(removeProduct(id));
  if (removeProduct.fulfilled.match(result)) {
    toast.success("Product deleted.");
  } else {
    toast.error(result.payload || "Unable to delete product.");
  }
};

  return (
    <div className="space-y-6">
      <Breadcrumbs />

      <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Products</h1>
            <p className="mt-1 text-sm text-slate-500">Manage inventory, update stock and keep your catalog fresh.</p>
          </div>
          <Link
            to="/products/add"
            className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Add Product
          </Link>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
          />
          <div className="text-sm text-slate-500">Showing {products.length} of {total} products</div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm text-slate-800">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-4">Product</th>
                <th className="px-4 py-4">Category</th>
                <th className="px-4 py-4">Sub Category</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Variants</th>
                <th className="px-4 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-4">
  <div className="flex items-center gap-3">
    <img src={product.thumbnail} alt={product.name} className="h-12 w-12 rounded-2xl object-cover" />
    <div>
      <p className="font-medium text-slate-900">{product.name}</p>
      <p className="text-xs text-slate-500">{product?.Brand?.name || "Unknown Brand"}</p>
    </div>
  </div>
</td>

{/* Main Category Row */}
<td className="px-4 py-4">
  {product?.Category?.name || "Uncategorized"}
</td>

{/* Sub Category Row (This was the line causing your crash!) */}
<td className="px-4 py-4">
  {product?.SubCategory?.name || "No Sub-category"}
</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${product.status ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                      {product.status ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      to={`/products/${product.id}/variants`}
                      className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      View Variants
                    </Link>
                  </td>
                  <td className="px-4 py-4 space-x-2">
                    <Link
                      to={`/products/edit/${product.id}`}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(product.id)}
                      className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 transition hover:bg-rose-100"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!products.length && (
                <tr>
                  <td colSpan="6" className="px-4 py-10 text-center text-slate-500">
                    No products available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
};

export default ProductsPage;