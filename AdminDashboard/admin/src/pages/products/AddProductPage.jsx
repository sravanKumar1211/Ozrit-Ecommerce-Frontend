import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createNewProduct } from "@/state/slices/productSlice";
import { loadCategories } from "@/state/slices/categorySlice.js";
import { loadSubCategories } from "@/state/slices/subCategorySlice";
import { loadBrands } from "@/state/slices/brandSlice";
import Breadcrumbs from "@/components/Breadcrumbs";

const AddProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  //  Pull data arrays and states out from Redux slices
  const { loading, error } = useSelector((state) => state.products);
  

  const { categories = [] } = useSelector((state) => state.categories || {});
  const { subCategories = [] } = useSelector((state) => state.subCategories || {});
  const { brands = [] } = useSelector((state) => state.brands || {});

  const { control, register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      name: "",
      description: "",
      categoryId: "",
      subCategoryId: "",
      brandId: "",
      status: "true",
    },
  });

  //  Fetch inventory configuration pools cleanly on initial mount
  useEffect(() => {
    dispatch(loadCategories());
    console.log("loading..");
    dispatch(loadSubCategories());
    dispatch(loadBrands());
  }, [dispatch]);

  // Handle server errors passing down from state layer safely
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // 3. Keep target inputs watched to change UI rendering patterns on the fly
  const thumbnail = useWatch({ control, name: "thumbnail" });
  const selectedCategoryId = useWatch({ control, name: "categoryId" });

  // 4. Force subcategory selection to empty string if parent category changes
  useEffect(() => {
    setValue("subCategoryId", "");
  }, [selectedCategoryId, setValue]);

  // 5. Match subcategory lists safely using text comparison evaluation
  const filteredSubCategories = subCategories.filter(
    (sub) => String(sub.categoryId) === String(selectedCategoryId)
  );

  const onSubmit = async (values) => {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (key === "thumbnail") {
        if (value?.[0]) {
          formData.append("thumbnail", value[0]);
        }
      } else if (key === "status") {
        formData.append("status", value === "true");
      } else {
        formData.append(key, value);
      }
    });

    const result = await dispatch(createNewProduct(formData));
    if (createNewProduct.fulfilled.match(result)) {
      toast.success("Product created successfully.");
      reset();
      navigate("/products");
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Add Product</h1>
            <p className="text-sm text-slate-500">Create a new product entry and upload a thumbnail image.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-600 block">
              Product name
              <input
                type="text"
                {...register("name", { required: "Product name is required" })}
                className="w-full mt-1.5 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 transition"
              />
            </label>

            {/* CATEGORY SELECT SELECTOR */}
            <label className="space-y-2 text-sm text-slate-600 block">
              Category
              <select
                {...register("categoryId", { required: "Category is required" })}
                className="w-full mt-1.5 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 transition"
              >
                <option value="">Select a Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* REACTIVE SUBCATEGORY DROPDOWN */}
            <label className="space-y-2 text-sm text-slate-600 block">
              Subcategory
              <select
                {...register("subCategoryId", { required: "Subcategory is required" })}
                disabled={!selectedCategoryId}
                className="w-full mt-1.5 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {!selectedCategoryId ? "Choose a Category First" : "Select a Subcategory"}
                </option>
                {filteredSubCategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </label>

            {/* BRAND SELECTOR */}
            <label className="space-y-2 text-sm text-slate-600 block">
              Brand
              <select
                {...register("brandId", { required: "Brand is required" })}
                className="w-full mt-1.5 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 transition"
              >
                <option value="">Select a Brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="space-y-2 text-sm text-slate-600 block">
            Description
            <textarea
              rows="4"
              {...register("description")}
              className="w-full mt-1.5 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 transition"
            />
          </label>

          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-600 block">
              Thumbnail
              <input
                type="file"
                accept="image/*"
                {...register("thumbnail")}
                className="w-full mt-1.5 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300"
              />
            </label>

            <label className="space-y-2 text-sm text-slate-600 block">
              Status
              <select
                {...register("status")}
                className="w-full mt-1.5 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 transition"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </label>
          </div>

          {thumbnail?.length > 0 && (
            <p className="text-sm text-slate-500 bg-slate-50 px-4 py-2 rounded-xl inline-block border border-slate-100">
              Selected file: <span className="font-medium text-slate-800">{thumbnail[0].name}</span>
            </p>
          )}

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="rounded-3xl bg-slate-900 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 shadow-md"
            >
              {loading ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;