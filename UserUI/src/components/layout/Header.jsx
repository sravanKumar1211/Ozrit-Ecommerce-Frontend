import { useEffect, useMemo, useState } from "react";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { fetchNavigation } from "@/features/categories/categoriesThunks";
import { fetchCart } from "@/features/cart/cartThunks";
import { loadProfile, logoutUser } from "@/features/auth/authThunks";

const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { categories } = useAppSelector((state) => state.categories);
  const { user, isAuthenticated, token } = useAppSelector((state) => state.auth);
  const { count = 0 } = useAppSelector((state) => state.cart);
  const [search, setSearch] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchNavigation());
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      dispatch(loadProfile());
      dispatch(fetchCart());
    }
  }, [dispatch, token]);

  const visibleCategories = useMemo(() => categories.slice(0, 5), [categories]);

  const handleSearch = (event) => {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `/products?search=${encodeURIComponent(query)}` : "/products");
    setMobileOpen(false);
  };

  const handleLogout = async () => {
    setAnchorEl(null);
    await dispatch(logoutUser());
    navigate("/");
  };

  const navClass = ({ isActive }) =>
    `text-sm font-medium transition ${isActive ? "text-slate-950" : "text-slate-500 hover:text-slate-900"}`;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-20 items-center justify-between gap-4">
          <Link to="/" className="text-2xl font-bold tracking-tight text-slate-950">Ozrit Shop</Link>

          <form onSubmit={handleSearch} className="hidden flex-1 md:block">
            <div className="mx-auto flex max-w-xl overflow-hidden rounded-full border border-slate-200 bg-slate-50 focus-within:border-slate-400">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search category, subcategory, brand or product"
                className="min-w-0 flex-1 bg-transparent px-5 py-3 text-sm text-slate-900 outline-none"
              />
              <button type="submit" className="bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800">
                Search
              </button>
            </div>
          </form>

          <div className="hidden items-center gap-4 lg:flex">
            <Badge badgeContent={count} color="primary">
              <Link to="/cart" className="text-sm font-semibold text-slate-700">Cart</Link>
            </Badge>
            <Link to="/products" className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              Shop now
            </Link>
            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  onClick={(event) => setAnchorEl(event.currentTarget)}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {user?.name || "Profile"}
                </button>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                  <MenuItem component={Link} to="/profile" onClick={() => setAnchorEl(null)}>Profile</MenuItem>
                  <MenuItem component={Link} to="/orders" onClick={() => setAnchorEl(null)}>Orders</MenuItem>
                  <MenuItem component={Link} to="/address" onClick={() => setAnchorEl(null)}>Address</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm font-semibold text-slate-700 hover:text-slate-950">Login</Link>
                <Link to="/register" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  Register
                </Link>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 lg:hidden"
          >
            Menu
          </button>
        </div>

        <nav className="hidden items-center gap-6 border-t border-slate-100 py-3 lg:flex">
          <NavLink to="/products" className={navClass}>All Products</NavLink>
          {visibleCategories.map((category) => (
            <NavLink key={category.id} to={`/products?category=${category.id}`} className={navClass}>
              {category.name}
            </NavLink>
          ))}
        </nav>

        {mobileOpen && (
          <div className="space-y-4 border-t border-slate-100 py-4 lg:hidden">
            <form onSubmit={handleSearch} className="flex overflow-hidden rounded-full border border-slate-200 bg-slate-50">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products"
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none"
              />
              <button type="submit" className="bg-slate-950 px-4 text-sm font-semibold text-white">Go</button>
            </form>
            <div className="grid gap-3 text-sm font-medium text-slate-600">
              <Link to="/products" onClick={() => setMobileOpen(false)}>All Products</Link>
              {visibleCategories.map((category) => (
                <Link key={category.id} to={`/products?category=${category.id}`} onClick={() => setMobileOpen(false)}>
                  {category.name}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <Link to="/profile" onClick={() => setMobileOpen(false)}>Profile</Link>
                  <button type="button" onClick={handleLogout} className="text-left font-medium">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)}>Login</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)}>Register</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
