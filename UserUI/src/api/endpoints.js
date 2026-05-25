export const endpoints = {
  auth: {
    login: "/login",
    register: "/register",
    profile: "/profile",
    logout: "/logout",
  },
  categories: {
    all: "/categories/all",
  },
  subCategories: {
    all: "/subcategories/all",
  },
  brands: {
    all: "/brands/all",
  },
  products: {
    all: "/products/all",
    detail: (id) => `/products/${id}`,
  },
  productVariant: {
    all: "/productVariant/all",
    detail: (id) => `/productVariant/${id}`,
  },
  cart: {
    base: "/cart",
    add: "/cart/add",
    update: "/cart/update",
    removeItem: (id) => `/cart/item/${id}`,
  },
  coupons: {
    apply: "/coupons/apply",
    all: "/coupons/all",
  },
  payment: {
    createOrder: "/payment/create-order",
    webhook: "/payment/webhook",
  },
  orders: {
    create: "/order",
    myOrders: "/my-orders",
    myOrderById: (id) => `/my-orders/${id}`,
    history: "/order-history",
    cancel: (id) => `/order/cancel/${id}`,
  },
};
