import { configureStore } from "@reduxjs/toolkit";

import authReducer from "@/state/slices/authSlice";
import productReducer from "@/state/slices/productSlice";
import categoryReducer from "@/state/slices/categorySlice";
import orderReducer from "@/state/slices/orderSlice";
import userReducer from "@/state/slices/userSlice";
import couponReducer from "@/state/slices/couponSlice";
import dashboardReducer from "@/state/slices/dashboardSlice";
import variantReducer from "./slices/variantSlice";
import subCategoryReducer from "./slices/subCategorySlice";
import brandReducer from "./slices/brandSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    categories: categoryReducer,
    orders: orderReducer,
    users: userReducer,
    coupons: couponReducer,
    dashboard: dashboardReducer,
    variants: variantReducer,
    subCategories: subCategoryReducer,
    brands: brandReducer,
  },
});
