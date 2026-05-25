import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { addVariant } from "@/state/slices/variantSlice";
import Breadcrumbs from "@/components/Breadcrumbs";

const AddVariantPage = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.variants);

  const [form, setForm] = useState({
    color: "",
    size: "",
    stock: 0,
    price: "",
    sku: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.price || !form.sku) {
      toast.error("Price and SKU fields are required.");
      return;
    }

    //  Compile multi-part form payload interface data matchingExpress
    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("color", form.color);
    formData.append("size", form.size);
    formData.append("stock", form.stock);
    formData.append("price", form.price);
    formData.append("sku", form.sku);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const result = await dispatch(addVariant(formData));
    if (addVariant.fulfilled.match(result)) {
      toast.success("Variant created successfully!");
      navigate(`/products/${productId}/variants`);
    } else {
      toast.error(result.payload || "Failed to create variant.");
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Breadcrumbs />

      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Add Product Variant</h1>
          <p className="text-sm text-slate-500 mt-1">Configure physical attributes, unique SKU keys, and pricing parameters.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Color</label>
              <input type="text" name="color" value={form.color} onChange={handleChange} placeholder="e.g. Midnight Blue" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Size</label>
              <input type="text" name="size" value={form.size} onChange={handleChange} placeholder="e.g. XL or 11" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Base Variant Price ($)</label>
              <input type="number" step="0.01" name="price" value={form.price} onChange={handleChange} required placeholder="0.00" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Stock Level</label>
              <input type="number" name="stock" value={form.stock} onChange={handleChange} placeholder="0" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Unique SKU Code</label>
            <input type="text" name="sku" value={form.sku} onChange={handleChange} required placeholder="e.g. APPL-IPH15-BLK" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-mono outline-none focus:border-slate-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Variant Graphic Media</label>
            <div className="flex items-center gap-4">
              <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200" />
              {preview && <img src={preview} alt="Preview" className="h-16 w-16 rounded-2xl object-cover border" />}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Link to={`/products/${productId}/variants`} className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">Cancel</Link>
            <button type="submit" disabled={loading} className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50 transition">
              {loading ? "Creating..." : "Save Variant"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVariantPage;