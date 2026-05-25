import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "@/pages/login/LoginPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import ProductsPage from "@/pages/products/ProductsPage";
import AddProductPage from "@/pages/products/AddProductPage";
import EditProductPage from "@/pages/products/EditProductPage";
import CategoriesPage from "@/pages/categories/CategoriesPage";
import OrdersPage from "@/pages/orders/OrdersPage";
import OrderDetailsPage from "@/pages/orders/OrderDetailsPage";
import CustomersPage from "@/pages/users/CustomersPage";
import CouponsPage from "@/pages/coupons/CouponsPage";
import ProfilePage from "@/pages/profile/ProfilePage";
import NotFoundPage from "@/pages/NotFoundPage";

import ProtectedRoute from "@/routes/ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";
import ProductVariantsPage from "../pages/products/ProductVariantsPage";
import AddVariantPage from "../pages/products/AddVariantPage";
import EditVariantPage from "../pages/products/EditVariantPage";
import SubCategoriesPage from "../pages/subCategories/SubCategoriesPage";
import BrandsPage from "../pages/Brands/BrandsPage";

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        
        <Route index element={<DashboardPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="/products/:productId/variants" element={<ProductVariantsPage />} />
        <Route path="/products/:productId/variants/add" element={<AddVariantPage />} />
        <Route path="/products/:productId/variants/edit/:variantId" element={<EditVariantPage />} />
        <Route path="products/add" element={<AddProductPage />} />
        <Route path="products/edit/:id" element={<EditProductPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/:id" element={<OrderDetailsPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="coupons" element={<CouponsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="subcategories" element={<SubCategoriesPage />} />
        <Route path="brands" element={<BrandsPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
