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

const heroSlides = [
  {
    title: "Fresh styles, faster shopping",
    text: "Explore categories, brands and products from your live ecommerce catalog.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Discover everyday essentials",
    text: "Browse trending products and category collections built for every screen.",
    image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Shop by category",
    text: "Use the sidebar accordion or header navigation to drill into subcategories.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=80",
  },
];

const HomePage = () => {
  const dispatch = useAppDispatch();
  const { categories, subCategories } = useAppSelector((state) => state.categories);
  const { featured } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchNavigation());
    dispatch(fetchFeaturedProducts());
  }, [dispatch]);

  const groupedProducts = useMemo(() => {
    const groups = new Map();
    featured.forEach((product) => {
      const key = product.Category?.name || "Featured";
      const group = groups.get(key) || [];
      if (group.length < 8) {
        group.push(product);
        groups.set(key, group);
      }
    });
    return Array.from(groups.entries()).slice(0, 4);
  }, [featured]);

  return (
    <div>
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
          <div className="hidden lg:block">
            <CategorySidebar categories={categories} subCategories={subCategories} />
          </div>

          <Swiper modules={[Autoplay, Pagination]} autoplay={{ delay: 4500 }} pagination className="min-h-95 w-full overflow-hidden rounded-3xl">
            {heroSlides.map((slide) => (
              <SwiperSlide key={slide.title}>
                <div className="relative min-h-95 overflow-hidden rounded-3xl">
                  <img src={slide.image} alt={slide.title} className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-slate-950/45" />
                  <div className="relative flex min-h-95 max-w-2xl flex-col justify-center px-6 py-12 text-white sm:px-10">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{slide.title}</h1>
                    <p className="mt-4 max-w-xl text-base leading-7 text-slate-100">{slide.text}</p>
                    <Link to="/products" className="mt-8 w-fit rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
                      Shop now
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="py-8">
          <SectionHeader title="Shop by category" subtitle="Jump into curated sections from the backend catalog." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.slice(0, 8).map((category) => (
              <Link key={category.id} to={`/products?category=${category.id}`} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="aspect-5/3 bg-slate-100">
                  {category.image ? (
                    <img src={getImageUrl(category.image)} alt={category.name} className="h-full w-full object-cover transition group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-400">Category</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-950">{category.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">Browse collection</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <ProductSlider title="Trending products" subtitle="Latest active products from the catalog." products={featured.slice(0, 10)} actionTo="/products" />

        {groupedProducts.map(([categoryName, products]) => (
          <ProductSlider
            key={categoryName}
            title={`${categoryName} picks`}
            subtitle="A few products from this category."
            products={products}
            actionTo={`/products?search=${encodeURIComponent(categoryName)}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
