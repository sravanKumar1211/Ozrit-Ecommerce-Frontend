const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const assetBaseUrl = apiBaseUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");

export const getImageUrl = (imagePath) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  const normalizedPath = imagePath.replace(/\\/g, "/").replace(/^\/+/, "");
  return `${assetBaseUrl}/${normalizedPath}`;
};
