import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { loadSingleVariant, editVariant, clearCurrentVariant } from "@/state/slices/variantSlice";
import Breadcrumbs from "@/components/Breadcrumbs";

const EditVariantPage = () => {
  const { productId, variantId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { currentVariant, loading } = useSelector((state) => state.variants);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      color: "",
      size: "",
      stock: 0,
      price: "",
      sku: "",
    },
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const previewSrc = preview || currentVariant?.image || "";

  // Populate localized form values when variant data arrives
  useEffect(() => {
    if (variantId) {
      dispatch(loadSingleVariant(variantId));
    }
    return () => {
      dispatch(clearCurrentVariant());
    };
  }, [dispatch, variantId]);

  useEffect(() => {
    if (currentVariant) {
      reset({
        color: currentVariant.color || "",
        size: currentVariant.size || "",
        stock: currentVariant.stock || 0,
        price: currentVariant.price || "",
        sku: currentVariant.sku || "",
      });
    }
  }, [currentVariant, reset]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (formDataValues) => {
    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("color", formDataValues.color);
    formData.append("size", formDataValues.size);
    formData.append("stock", formDataValues.stock);
    formData.append("price", formDataValues.price);
    formData.append("sku", formDataValues.sku);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const result = await dispatch(editVariant({ id: variantId, formData }));
    if (editVariant.fulfilled.match(result)) {
      toast.success("Variant saved successfully!");
      navigate(`/products/${productId}/variants`);
    } else {
      toast.error(result.payload || "Failed to edit variant details.");
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Breadcrumbs />

      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Modify Product Variant</h1>
          <p className="text-sm text-slate-500 mt-1">Adjust property tags, pricing adjustments, or swap inventory imagery assets.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Color</label>
              <input type="text" {...register("color")} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Size</label>
              <input type="text" {...register("size")} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Adjusted Price ($)</label>
              <input type="number" step="0.01" {...register("price")} required className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Stock</label>
              <input type="number" {...register("stock")} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Stock Keeping SKU</label>
            <input type="text" {...register("sku")} required className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-mono outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Update Media Asset</label>
            <div className="flex items-center gap-4">
              <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200" />
              {previewSrc && <img src={previewSrc} alt="Preview" className="h-16 w-16 rounded-2xl object-cover border" />}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Link to={`/products/${productId}/variants`} className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">Cancel</Link>
            <button type="submit" disabled={loading} className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50 transition">
              {loading ? "Saving Changes..." : "Update Variant"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVariantPage;
