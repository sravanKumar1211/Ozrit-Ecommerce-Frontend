export const API_ROUTES = {
  auth: {
    login: "/login",
    logout: "/logout",
    profile: "/profile",
    users: "/admin/users",
    dashboard: "/admin/dashboard",
  },
  products: {
    all: "/products/all",
    create: "/products/create",
    detail: (id) => `/products/${id}`,
    update: (id) => `/products/update/${id}`,
    delete: (id) => `/products/delete/${id}`,
  },
  variants: {
    all: "/productVariant/all",
    create: "/productVariant/create",
    detail: (id) => `/productVariant/${id}`,
    update: (id) => `/productVariant/update/${id}`,
    delete: (id) => `/productVariant/delete/${id}`,
  },
  categories: {
    all: "/categories/all",
    create: "/categories/create",
    update: (id) => `/categories/update/${id}`,
    delete: (id) => `/categories/delete/${id}`,
  },
  subCategories: {
    all: "/subcategories/all",
    detail: (id) => `/subcategories/all/${id}`,
    create: "/subcategories/create",
    update: (id) => `/subcategories/update/${id}`,
    delete: (id) => `/subcategories/delete/${id}`,
  },
  brands: {
    all: "/brands/all",
    detail: (id) => `/brands/all/${id}`,
    create: "/brands/create",
    update: (id) => `/brands/update/${id}`,
    delete: (id) => `/brands/delete/${id}`,
  },
  orders: {
    all: "/admin/orders",
    status: "/admin/order/status",
    detail: (id) => `/admin/orders/${id}`,
  },
  coupons: {
    all: "/coupons/all",
    create: "/coupons/create",
    update: (id) => `/coupons/update/${id}`,
    delete: (id) => `/coupons/delete/${id}`,
  },
};
