import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import ProductCard from "./ProductCard";
import SectionHeader from "@/components/common/SectionHeader";

const ProductSlider = ({ title, subtitle, products = [], actionTo }) => {
  if (!products.length) return null;

  return (
    <section className="py-8">
      <SectionHeader title={title} subtitle={subtitle} actionLabel="View all" actionTo={actionTo || "/products"} />
      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={16}
        breakpoints={{
          320: { slidesPerView: 1.2 },
          640: { slidesPerView: 2.2 },
          1024: { slidesPerView: 4 },
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default ProductSlider;
