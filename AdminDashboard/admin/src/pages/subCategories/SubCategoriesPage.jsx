import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { loadSubCategories, createNewSubCategory, editSubCategory, removeSubCategory } from "@/state/slices/subCategorySlice";
import { loadCategories } from "@/state/slices/categorySlice";
import useDebounce from "@/hooks/useDebounce";
import { getImageUrl } from "@/utils/image";

const SubCategoriesPage = () => {
  const dispatch = useDispatch();
  const { subCategories, loading, error } = useSelector((state) => state.subCategories);
  const { categories } = useSelector((state) => state.categories);
  
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const { register, handleSubmit, reset } = useForm();
  const debouncedSearch = useDebounce(search, 450);

  useEffect(() => {
    dispatch(loadSubCategories({ search: debouncedSearch }));
    dispatch(loadCategories({ limit: 10 })); // Fetch parent dependencies
  }, [dispatch, debouncedSearch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const onSubmit = async (values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("categoryId", values.categoryId);
    formData.append("status", values.status === "true");
    if (values.image?.[0]) {
      formData.append("image", values.image[0]);
    }

    if (editingId) {
      const result = await dispatch(editSubCategory({ id: editingId, payload: formData }));
      if (editSubCategory.fulfilled.match(result)) {
        toast.success("Subcategory updated.");
        setEditingId(null);
        setPreviewImage("");
        reset();
      }
    } else {
      const result = await dispatch(createNewSubCategory(formData));
      if (createNewSubCategory.fulfilled.match(result)) {
        toast.success("Subcategory created.");
        setPreviewImage("");
        reset();
      }
    }
  };

  const handleEdit = (sub) => {
    setEditingId(sub.id);
    setPreviewImage(sub.image || "");
    reset({
      name: sub.name,
      categoryId: sub.categoryId || sub?.Category?.id || "",
      status: sub.status ? "true" : "false",
      image: null,
    });
  };

  const handleDelete = (subId) => {
  // Display a browser confirmation box
  const isConfirmed = window.confirm("Are you sure you want to delete this sub-category?");
  
  // If the user clicks "OK", dispatch the action
  if (isConfirmed) {
    dispatch(removeSubCategory(subId));
  }
};

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr] p-6">
      <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-soft">
        <h1 className="text-xl font-bold mb-4">Subcategories</h1>
        <input 
          value={search} onChange={(e) => setSearch(e.target.value)} 
          placeholder="Search..." className="w-full mb-4 px-4 py-2 border rounded-2xl bg-slate-50 outline-none" 
        />
        <table className="min-w-full text-sm text-left">
          <thead className="bg-slate-50 uppercase text-xs text-slate-500">
            <tr>
              <th className="p-4">Subcategory</th>
              <th className="p-4">Parent Category</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subCategories.map((sub) => (
              <tr key={sub.id} className="border-b">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {sub.image && <img src={getImageUrl(sub.image)} alt={sub.name} className="h-10 w-10 rounded-xl object-cover border" />}
                    <span className="font-medium">{sub.name}</span>
                  </div>
                </td>
                <td className="p-4 text-slate-500">{sub?.Category?.name || "Unlinked"}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${sub.status ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                    {sub.status ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-4 space-x-2">
                  <button onClick={() => handleEdit(sub)} className="text-blue-600 hover:underline">Edit</button>
                  <button  onClick={() => handleDelete(sub.id)} className="text-rose-600 hover:underline">Delete</button>
                  {/* <button onClick={() => dispatch(removeSubCategory(sub.id))} className="text-rose-600 hover:underline">Delete</button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-soft h-fit">
        <h2 className="text-lg font-semibold mb-4">{editingId ? "Edit Subcategory" : "Create Subcategory"}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Subcategory Name</label>
            <input {...register("name", { required: true })} className="w-full mt-1 px-4 py-2 border rounded-2xl bg-slate-50 outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium">Parent Category</label>
            <select {...register("categoryId", { required: true })} className="w-full mt-1 px-4 py-2 border rounded-2xl bg-slate-50 outline-none">
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Image</label>
            <input type="file" accept="image/*" {...register("image")} className="w-full mt-1 px-4 py-2 border rounded-2xl bg-slate-50 outline-none" />
          </div>
          {previewImage && <img src={getImageUrl(previewImage)} alt="Subcategory preview" className="h-20 w-20 rounded-2xl object-cover" />}
          <div>
            <label className="text-sm font-medium">Status</label>
            <select {...register("status")} className="w-full mt-1 px-4 py-2 border rounded-2xl bg-slate-50 outline-none">
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-3 rounded-2xl font-semibold hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">
            {editingId ? "Update" : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubCategoriesPage;
