export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 18px 50px rgba(15, 23, 42, 0.08)",
      },
      colors: {
        surface: "#f8fafc",
        primary: "#111827",
        accent: "#2563eb",
      },
    },
  },
  plugins: [],
};
