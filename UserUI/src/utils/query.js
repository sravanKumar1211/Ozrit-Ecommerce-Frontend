export const productQueryFromSearchParams = (searchParams) => {
  const params = {};

  const search = searchParams.get("search");
  const category = searchParams.get("category");
  const subcategory = searchParams.get("subcategory");
  const brand = searchParams.get("brand");
  const sort = searchParams.get("sort");
  const page = searchParams.get("page");
  const limit = searchParams.get("limit");

  if (search) params.search = search;
  if (category) params.categoryId = category;
  if (subcategory) params.subCategoryId = subcategory;
  if (brand) params.brandId = brand;
  if (sort) params.sort = sort;
  if (page) params.page = page;
  if (limit) params.limit = limit;

  return params;
};
