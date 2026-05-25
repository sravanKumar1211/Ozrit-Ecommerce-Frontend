import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { loadBrands, createNewBrand, editBrand, removeBrand } from "@/state/slices/brandSlice";
import useDebounce from "@/hooks/useDebounce";
import { getImageUrl } from "@/utils/image";

const BrandsPage = () => {
  const dispatch = useDispatch();
  const { brands, loading, error } = useSelector((state) => state.brands);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [previewLogo, setPreviewLogo] = useState("");
  const { register, handleSubmit, reset } = useForm();
  const debouncedSearch = useDebounce(search, 450);

  useEffect(() => {
    dispatch(loadBrands({ search: debouncedSearch }));
  }, [dispatch, debouncedSearch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const onSubmit = async (values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("status", values.status === "true");
    if (values.logo?.[0]) {
      formData.append("logo", values.logo[0]);
    }

    if (editingId) {
      const result = await dispatch(editBrand({ id: editingId, formData }));
      if (editBrand.fulfilled.match(result)) {
        toast.success("Brand updated.");
        setEditingId(null);
        setPreviewLogo("");
        reset();
      }
    } else {
      const result = await dispatch(createNewBrand(formData));
      if (createNewBrand.fulfilled.match(result)) {
        toast.success("Brand created.");
        setPreviewLogo("");
        reset();
      }
    }
  };

  const handleEdit = (brand) => {
    setEditingId(brand.id);
    setPreviewLogo(brand.logo || "");
    reset({
      name: brand.name,
      status: brand.status ? "true" : "false",
      logo: null,
    });
  };

  const handleDeleteBrand = (brandId) => {
  const isConfirmed = window.confirm("Are you sure you want to delete this brand?");
  
  if (isConfirmed) {
    dispatch(removeBrand(brandId));
  }
};

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr] p-6">
      <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-soft">
        <h1 className="text-xl font-bold mb-4">Brands</h1>
        <input 
          value={search} onChange={(e) => setSearch(e.target.value)} 
          placeholder="Search brands..." className="w-full mb-4 px-4 py-2 border rounded-2xl bg-slate-50 outline-none" 
        />
        <table className="min-w-full text-sm text-left">
          <thead className="bg-slate-50 uppercase text-xs text-slate-500">
            <tr>
              <th className="p-4">Brand Details</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand.id} className="border-b">
                <td className="p-4 flex items-center gap-3">
                  {brand.logo ? (
                    <img src={getImageUrl(brand.logo)} alt={brand.name} className="h-10 w-10 rounded-xl object-cover border" />
                  ) : (
                    <div className="h-10 w-10 rounded-xl border bg-slate-100" />
                  )}
                  <span className="font-medium">{brand.name}</span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${brand.status ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                    {brand.status ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-4 space-x-2">
                  <button onClick={() => handleEdit(brand)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDeleteBrand(brand.id)} className="text-rose-600 hover:underline">  Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-soft h-fit">
        <h2 className="text-lg font-semibold mb-4">{editingId ? "Edit Brand" : "Create Brand"}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Brand Name</label>
            <input {...register("name", { required: true })} className="w-full mt-1 px-4 py-2 border rounded-2xl bg-slate-50 outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium">Logo Image</label>
            <input type="file" {...register("logo")} className="w-full mt-1 px-4 py-2 border rounded-2xl bg-slate-50 outline-none" />
          </div>
          {previewLogo && <img src={getImageUrl(previewLogo)} alt="Brand preview" className="h-20 w-20 rounded-2xl object-cover border" />}
          <div>
            <label className="text-sm font-medium">Status</label>
            <select {...register("status")} className="w-full mt-1 px-4 py-2 border rounded-2xl bg-slate-50 outline-none">
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-3 rounded-2xl font-semibold hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">
            {editingId ? "Update Brand" : "Save Brand"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BrandsPage;
