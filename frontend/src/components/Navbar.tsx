import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext.tsx";
import { ShoppingCart, Store, ShoppingBag, PlusCircle, LogOut } from "lucide-react";

const Navbar = () => {
  const { isLoggedIn, isAdmin, user, logout } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();

  const linkClass = (path: string) =>
    `flex items-center gap-1.5 text-sm font-medium transition-colors relative pb-1 ${location.pathname === path
      ? "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-indigo-500 after:to-purple-500 after:rounded"
      : "text-gray-400 hover:text-white"
    }`;

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between h-16 px-6 bg-gray-950/85 backdrop-blur-xl border-b border-white/10">
      <Link to="/" className="flex items-center gap-2">
        <ShoppingCart className="text-indigo-400" size={24} />
        <span className="text-lg font-bold gradient-text">SaleInventory</span>
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/" className={linkClass("/")}>
          <Store size={16} />
          Products
        </Link>

        {isLoggedIn && (
          <Link to="/cart" className={linkClass("/cart")}>
            <ShoppingBag size={16} />
            Cart
            {totalItems > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold bg-indigo-500 text-white rounded-full">
                {totalItems}
              </span>
            )}
          </Link>
        )}

        {isAdmin && (
          <Link to="/admin" className={linkClass("/admin")}>
            <PlusCircle size={16} />
            Add Product
          </Link>
        )}

        {isLoggedIn ? (
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">
              {user?.name}
              {isAdmin && (
                <span className="ml-1 px-1.5 py-0.5 text-[9px] font-bold bg-purple-500/20 text-purple-400 rounded">
                  ADMIN
                </span>
              )}
            </span>
            <button
              onClick={logout}
              className="px-3 py-1.5 text-sm font-semibold text-red-400 border border-red-400/30 rounded-lg hover:bg-red-400/10 transition-all cursor-pointer"
            >
              <LogOut size={14} className="inline mr-1" />
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-3 py-1.5 text-sm font-semibold text-indigo-400 border border-indigo-400/30 rounded-lg hover:bg-indigo-400/10 transition-all"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-3 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg hover:-translate-y-0.5 transition-all btn-glow"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
