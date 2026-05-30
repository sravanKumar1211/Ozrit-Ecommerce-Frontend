# 🛍️ Ozrit E-Commerce Front-ends

This repository contains the two dynamic front-end applications that drive the Ozrit E-Commerce platform:
1. **User UI (`UserUI`):** The client-facing e-commerce storefront.
2. **Admin Dashboard (`AdminDashboard`):** The administrative dashboard for managing products, categories, orders, and chats.

## 🚀 Deployed Links
- **User UI Website:** [https://ozrit-shop.vercel.app](https://ozrit-shop.vercel.app)
- **Admin Dashboard URL:** [https://ozrit-admin.vercel.app/login](https://ozrit-admin.vercel.app/login)
- **Backend API URL:** [https://ozrit-ecommerce-backend.onrender.com](https://ozrit-ecommerce-backend.onrender.com)

---

## 🔑 Admin Credentials
For logging into the **Admin Dashboard** (`https://ozrit-admin.vercel.app/login`):
* **Email:** `sravankumargaddamedhi@gmail.com`
* **Password:** `admin@123`

---

## 🛠️ Technology Stack
- **Library:** React (v19)
- **Bundler:** Vite (v8)
- **Styling:** Tailwind CSS (v4) & Material-UI (MUI)
- **State Management:** Redux Toolkit & React-Redux
- **WebSockets:** Socket.IO Client

---

## 📂 Repository Structure

```text
/
├── UserUI/                # E-Commerce Storefront
└── AdminDashboard/
    └── admin/             # React Admin App
```

---

## ⚙️ Environment Variables Config (.env)

Both front-end applications are fully configured to use dynamic environments using Vite's `VITE_` prefix:

### 1. User UI (`UserUI/.env`)
Create a `.env` in the `UserUI` root:
```text
VITE_API_BASE_URL=https://ozrit-ecommerce-backend.onrender.com/api
VITE_SOCKET_URL=https://ozrit-ecommerce-backend.onrender.com
VITE_RAZORPAY_KEY_ID=rzp_test_Sr7ps8DECunJ1T
```

### 2. Admin Dashboard (`AdminDashboard/admin/.env`)
Create a `.env` in the `AdminDashboard/admin` directory:
```text
VITE_API_BASE_URL=https://ozrit-ecommerce-backend.onrender.com/api
VITE_SOCKET_URL=https://ozrit-ecommerce-backend.onrender.com
```

---

## 🚀 How to Deploy on Vercel

Both sites are hosted on Vercel. Follow these configuration options when setting up:

### 1. User UI Setup
- **Root Directory:** `UserUI`
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variables:**
  - `VITE_API_BASE_URL` = `https://ozrit-ecommerce-backend.onrender.com/api`

### 2. Admin Dashboard Setup
- **Root Directory:** `AdminDashboard/admin`
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variables:**
  - `VITE_API_BASE_URL` = `https://ozrit-ecommerce-backend.onrender.com/api`