import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { loadProduct, editProduct } from "@/state/slices/productSlice";
import Breadcrumbs from "@/components/Breadcrumbs";

const EditProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { product, loading, error } = useSelector((state) => state.products);

  const { control, register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      description: "",
      categoryId: "",
      subCategoryId: "",
      brandId: "",
      status: true,
    },
  });

  useEffect(() => {
    dispatch(loadProduct(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description || "",
        categoryId: product.categoryId || "",
        subCategoryId: product.subCategoryId || "",
        brandId: product.brandId || "",
        status: String(product.status),
      });
    }
    console.log(product)
  }, [product, reset]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

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
    const result = await dispatch(editProduct({ id, formData }));
    if (editProduct.fulfilled.match(result)) {
      toast.success("Product updated successfully.");
      navigate("/products");
    }
  };

  const thumbnail = useWatch({ control, name: "thumbnail" });

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Edit Product</h1>
            <p className="text-sm text-slate-500">Update product details and push changes to the catalog.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-600">
              Product name
              <input
                type="text"
                {...register("name", { required: true })}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-600">
              Category ID
              <input
                type="text"
                {...register("categoryId", { required: true })}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
              />
            </label>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-600">
              Subcategory ID
              <input
                type="text"
                {...register("subCategoryId", { required: true })}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-600">
              Brand ID
              <input
                type="text"
                {...register("brandId", { required: true })}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
              />
            </label>
          </div>

          <label className="space-y-2 text-sm text-slate-600">
            Description
            <textarea
              rows="4"
              {...register("description")}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
            />
          </label>

          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-600">
              Thumbnail
              <input
                type="file"
                {...register("thumbnail")}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-600">
              Status
              <select
                {...register("status")}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </label>
          </div>

          {thumbnail?.length > 0 && (
            <p className="text-sm text-slate-500">Selected file: {thumbnail[0].name}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-3xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProductPage;
