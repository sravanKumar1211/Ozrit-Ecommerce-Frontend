import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { loadCategories, createNewCategory, editCategory, removeCategory } from "@/state/slices/categorySlice";
import Breadcrumbs from "@/components/Breadcrumbs";
import Pagination from "@/components/Pagination";
import { useForm } from "react-hook-form";
import { formatDate } from "@/utils/date";
import useDebounce from "@/hooks/useDebounce";
import { getImageUrl } from "@/utils/image";

const CategoriesPage = () => {
  const dispatch = useDispatch();
  const { categories, total, limit, loading, error } = useSelector((state) => state.categories);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const { register, handleSubmit, reset } = useForm();
  const debouncedSearch = useDebounce(search, 450);

  useEffect(() => {
    dispatch(loadCategories({ search: debouncedSearch, page: currentPage, limit }));
  }, [dispatch, debouncedSearch, currentPage, limit]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const totalPages = Math.ceil(total / limit);

  const onSubmit = async (values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    
    // Convert string select values back to true Booleans for standard DB integrations
    formData.append("status", values.status === "true");
    
    // Explicitly target item 0 in the local FileList state array
    if (values.image && values.image.length > 0) {
      formData.append("image", values.image[0]);
    }

    if (editingId) {
      const result = await dispatch(editCategory({ id: editingId, formData }));
      if (editCategory.fulfilled.match(result)) {
        toast.success("Category updated.");
        setEditingId(null);
        setPreviewImage("");
        reset(); // Clear form ONLY after the transaction finishes successfully
      }
    } else {
      const result = await dispatch(createNewCategory(formData));
      if (createNewCategory.fulfilled.match(result)) {
        toast.success("Category created.");
        setPreviewImage("");
        reset(); // Clear form ONLY after the transaction finishes successfully
      }
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setPreviewImage(category.image || "");
    reset({
      name: category.name,
      status: category.status ? "true" : "false",
      image: null,
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;
    const result = await dispatch(removeCategory(id));
    if (removeCategory.fulfilled.match(result)) {
      toast.success("Category removed.");
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Categories</h1>
              <p className="text-sm text-slate-500">Add or update category listings and card assets.</p>
            </div>
            <div className="w-full max-w-xs">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search categories"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm text-slate-800">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-4">Category</th>
                  <th className="px-4 py-4">Created</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {category.image ? (
                          <img src={getImageUrl(category.image)} alt={category.name} className="h-12 w-12 rounded-2xl object-cover" />
                        ) : (
                          <div className="h-12 w-12 rounded-2xl bg-slate-100" />
                        )}
                        <div>
                          <p className="font-medium text-slate-900">{category.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">{formatDate(category.createdAt)}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${category.status ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                        {category.status ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-4 space-x-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(category)}
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(category.id)}
                        className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 transition hover:bg-rose-100"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {!categories.length && (
                  <tr>
                    <td colSpan="4" className="px-4 py-10 text-center text-slate-500">
                      No categories were found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-900">{editingId ? "Edit Category" : "Create Category"}</h2>
            <p className="text-sm text-slate-500">Manage category data and visual assets.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <label className="block text-sm text-slate-600">
              Name
              <input
                {...register("name", { required: true })}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
              />
            </label>
            <label className="block text-sm text-slate-600">
              Image
              <input
                type="file"
                {...register("image")}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
              />
            </label>
            {previewImage && (
              <img src={getImageUrl(previewImage)} alt="Category preview" className="h-20 w-20 rounded-2xl object-cover" />
            )}
            <label className="block text-sm text-slate-600">
              Status
              <select
                {...register("status", { required: true })}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {editingId ? "Update Category" : "Create Category"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
