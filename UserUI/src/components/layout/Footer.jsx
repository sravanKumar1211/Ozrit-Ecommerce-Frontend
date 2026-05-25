import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="mt-12 border-t border-slate-200 bg-white">
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
      <div>
        <Link to="/" className="text-2xl font-bold text-slate-950">Ozrit Shop</Link>
        <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
          A fast, responsive ecommerce storefront connected to your existing backend catalog and authentication APIs.
        </p>
      </div>
      <div>
        <h3 className="text-sm font-semibold uppercase text-slate-400">Shop</h3>
        <div className="mt-4 grid gap-2 text-sm text-slate-600">
          <Link to="/products">Products</Link>
          <Link to="/products?search=trending">Trending</Link>
          <Link to="/login">Login</Link>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold uppercase text-slate-400">Support</h3>
        <div className="mt-4 grid gap-2 text-sm text-slate-600">
          <span>Secure checkout ready architecture</span>
          <span>JWT authenticated account area</span>
          <span>Responsive catalog browsing</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
