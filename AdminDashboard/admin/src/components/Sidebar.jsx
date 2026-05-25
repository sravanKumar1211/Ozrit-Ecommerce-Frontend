import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiBox,
  FiLayers,
  FiShoppingCart,
  FiUsers,
  FiTag,
  FiAward,
  FiGitCommit,
  FiUser,
} from "react-icons/fi";

const navigation = [
  { name: "Dashboard", to: "/dashboard", icon: FiHome },
  { name: "Products", to: "/products", icon: FiBox },
  { name: "Categories", to: "/categories", icon: FiLayers },
  { name: "SubCategories", to: "/subcategories", icon: FiGitCommit},
  { name: "Brands", to: "/brands", icon: FiAward },
  { name: "Orders", to: "/orders", icon: FiShoppingCart },
  { name: "Customers", to: "/customers", icon: FiUsers },
  { name: "Coupons", to: "/coupons", icon: FiTag },
  { name: "Profile", to: "/profile", icon: FiUser },
];

const Sidebar = () => {
  return (
    /* Added w-64 to keep the sidebar at a fixed readable width for navigation text */
    <aside className="w-64 min-h-screen border-r border-slate-200 bg-white shadow-sm transition-all duration-300">
      <div className="flex h-full flex-col justify-between p-4">
        <div>
          <div className="mb-8 flex items-center justify-between gap-3 px-3">
            <div>
              <span className="block text-xl font-semibold text-slate-900">Ozrit Admin</span>
            </div>
          </div>

          <nav className="space-y-2">
            {navigation.map((item) => {
               const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      isActive ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50"
                    }`
                  }
                >
                  {/* The Icon */}
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  
                  {/* ✅ FIXED: Added the text name tag node here */}
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="mt-8 px-3 text-xs text-slate-400">
          <p>Connected with your ecommerce backend.</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
