import { useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { loadVariants, removeVariant, clearVariantErrors } from "@/state/slices/variantSlice";
import Breadcrumbs from "@/components/Breadcrumbs";
import { formatCurrency } from "@/utils/currency";



const ProductVariantsPage = () => {
  const dispatch = useDispatch();
  const { productId } = useParams();

  // Redux state
  const { variants, loading, error } = useSelector(
    (state) => state.variants
  );

  // Load variants
  useEffect(() => {
    if (productId) {
      dispatch(loadVariants(productId));
    }
  }, [dispatch, productId]);

  // Error handling
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearVariantErrors());
    }
  }, [error, dispatch]);

  // Delete variant
  const handleDelete = async (variantId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this variant?"
    );

    if (!confirmed) return;

    const result = await dispatch(removeVariant(variantId));

    if (removeVariant.fulfilled.match(result)) {
      toast.success("Variant permanently deleted.");
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs />

      <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
        
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Product Variants
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage separate inventory properties matching your Sequel models.
            </p>
          </div>

          <Link
            to={`/products/${productId}/variants/add`}
            className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Add New Variant
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-4">Image</th>
                <th className="px-4 py-4">Color</th>
                <th className="px-4 py-4">Size</th>
                <th className="px-4 py-4">Price</th>
                <th className="px-4 py-4">SKU Code</th>
                <th className="px-4 py-4">Stock Level</th>
                <th className="px-4 py-4">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 bg-white">
              
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-10 text-center text-slate-500"
                  >
                    Syncing database assets...
                  </td>
                </tr>
              ) : variants.length > 0 ? (
                
                variants.map((variant) => (
                  <tr key={variant.id}>
                    
                    {/* Image */}
                    <td className="px-4 py-4">
                      <img
                        src={variant.image || "https://placehold.co/100"}
                        alt="variant"
                        className="h-10 w-10 rounded-xl border object-cover"
                      />
                    </td>

                    {/* Color */}
                    <td className="px-4 py-4 font-medium text-slate-900">
                      {variant.color || "—"}
                    </td>

                    {/* Size */}
                    <td className="px-4 py-4">
                      {variant.size || "—"}
                    </td>

                    {/* Price */}
                    <td className="px-4 py-4 font-semibold text-slate-900">
                      {formatCurrency(variant.price)}
                    </td>

                    {/* SKU */}
                    <td className="px-4 py-4 font-mono text-xs text-slate-500">
                      {variant.sku || "N/A"}
                    </td>

                    {/* Stock */}
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          variant.stock > 0
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {variant.stock} units
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="space-x-2 px-4 py-4">
                      
                      <Link
                        to={`/products/${productId}/variants/edit/${variant.id}`}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100"
                      >
                        Edit
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDelete(variant.id)}
                        className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs text-rose-700 hover:bg-rose-100"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))

              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-10 text-center text-slate-500"
                  >
                    No variants found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductVariantsPage;