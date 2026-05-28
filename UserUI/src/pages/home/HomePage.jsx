import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { fetchNavigation } from "@/features/categories/categoriesThunks";
import { fetchFeaturedProducts } from "@/features/products/productsThunks";
import { getImageUrl } from "@/utils/image";
import CategorySidebar from "@/components/navigation/CategorySidebar";
import ProductSlider from "@/components/product/ProductSlider";
import SectionHeader from "@/components/common/SectionHeader";

const HomePage = () => {
  const dispatch = useAppDispatch();

  const { categories, subCategories } = useAppSelector(
    (state) => state.categories,
  );

  const { featured } = useAppSelector((state) => state.products);

  useEffect(() => {
    if (!categories.length) {
      dispatch(fetchNavigation());
    }

    dispatch(fetchFeaturedProducts());
  }, [dispatch]);

  const categorySlides = useMemo(() => {
    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      image: category.image ? getImageUrl(category.image) : null,
    }));
  }, [categories]);

  // Product groups by category
  const groupedProducts = useMemo(() => {
    const groups = new Map();

    featured.forEach((product) => {
      const key = product.Category?.id ? String(product.Category.id) : null;
      if (!key) return;
      const label = product.Category?.name || "Featured";
      const existing = groups.get(key) || {
        label,
        products: [],
      };
      if (existing.products.length < 8) {
        existing.products.push(product);
      }
      groups.set(key, existing);
    });
    return Array.from(groups.entries()).slice(0, 4);
  }, [featured]);

  return (
    <div>
      {/* HERO SECTION */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
          <div className="hidden lg:block">
            <CategorySidebar
              categories={categories}
              subCategories={subCategories}
            />
          </div>

          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            loop={categorySlides.length > 1}
            className="h-[500px] w-full overflow-hidden rounded-3xl"
          >
            {categorySlides.map((category) => (
              <SwiperSlide key={category.id}>
                <div className="relative h-[500px] overflow-hidden rounded-3xl">
                  <img
                    src={
                      category.image ||
                      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=80"
                    }
                    alt={category.name}
                    className="absolute inset-0 h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-black/50" />

                  <div className="relative flex h-full items-center px-8 md:px-16">
                    <div className="max-w-2xl text-white">
                      <span className="mb-4 inline-block text-sm uppercase tracking-widest">
                        Shop Category
                      </span>

                      <h1 className="text-4xl font-bold md:text-6xl">
                        {category.name}
                      </h1>

                      <p className="mt-4 text-lg text-slate-200">
                        Explore products from {category.name}
                      </p>

                      <Link
                        to={`/products?category=${category.id}&page=1`}
                        className="mt-8 inline-flex rounded-full bg-white px-8 py-3 font-semibold !text-black hover:bg-slate-100"
                      >
                        Shop Now
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* CATEGORY GRID */}
        <section className="py-8">
          <SectionHeader
            title="Shop by Category"
            subtitle="Browse collections directly from your catalog."
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.slice(0, 8).map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="aspect-[5/3] bg-slate-100 overflow-hidden">
                  {category.image ? (
                    <img
                      src={getImageUrl(category.image)}
                      alt={category.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-400">
                      No Image
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-slate-900">
                    {category.name}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Browse collection
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* TRENDING PRODUCTS */}
        <ProductSlider
          title="Trending Products"
          subtitle="Latest active products from the catalog."
          products={featured.slice(0, 10)}
          actionTo="/products"
        />

        {/* CATEGORY PRODUCT SECTIONS */}
        {groupedProducts.map(([categoryId, { label, products }]) => (
          <ProductSlider
            key={categoryId}
            title={`${label} Picks`}
            subtitle="A few products from this category."
            products={products}
            actionTo={`/products?category=${categoryId}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
