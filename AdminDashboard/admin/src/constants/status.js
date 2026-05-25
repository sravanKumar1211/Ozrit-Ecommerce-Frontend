export const ORDER_STATUS = [
  { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: "packed", label: "Packed", color: "bg-sky-100 text-sky-800" },
  { value: "shipped", label: "Shipped", color: "bg-blue-100 text-blue-800" },
  { value: "delivered", label: "Delivered", color: "bg-emerald-100 text-emerald-800" },
  { value: "cancelled", label: "Cancelled", color: "bg-rose-100 text-rose-800" },
];

export const PRODUCT_STATUS = [
  { value: true, label: "Active", color: "bg-emerald-100 text-emerald-800" },
  { value: false, label: "Inactive", color: "bg-rose-100 text-rose-800" },
];

export const COUPON_TYPES = [
  { value: "flat", label: "Flat amount" },
  { value: "percent", label: "Percent" },
];
