import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import brandsReducer from "@/features/brands/brandsSlice";
import cartReducer from "@/features/cart/cartSlice";
import categoriesReducer from "@/features/categories/categoriesSlice";
import productDetailsReducer from "@/features/productDetails/productDetailsSlice";
import productsReducer from "@/features/products/productsSlice";
import variantsReducer from "@/features/variants/variantsSlice";
import checkoutReducer from "@/features/checkout/checkoutSlice";
import couponsReducer from "@/features/coupons/couponsSlice";
import ordersReducer from "@/features/orders/ordersSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    brands: brandsReducer,
    cart: cartReducer,
    categories: categoriesReducer,
    productDetails: productDetailsReducer,
    products: productsReducer,
    variants: variantsReducer,
    checkout: checkoutReducer,
    coupons: couponsReducer,
    orders: ordersReducer,
  },
});
