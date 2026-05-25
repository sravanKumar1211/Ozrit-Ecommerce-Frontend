export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0, // Optional: Removes paise (.00) for clean dashboard metrics
  }).format(amount || 0);
};