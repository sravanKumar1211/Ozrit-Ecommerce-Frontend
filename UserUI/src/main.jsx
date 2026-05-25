import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "@/store/store";
import "./styles.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Toaster } from "react-hot-toast";

// Dynamically inject Razorpay script for checkout popup
const injectRazorpayScript = () => {
  if (typeof window === "undefined") return;
  if (document.getElementById("razorpay-script")) return;
  const s = document.createElement("script");
  s.id = "razorpay-script";
  s.src = "https://checkout.razorpay.com/v1/checkout.js";
  s.async = true;
  document.head.appendChild(s);
};

injectRazorpayScript();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <Toaster position="top-right" />
    </Provider>
  </React.StrictMode>,
);
