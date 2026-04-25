import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./components/Toast";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductsPage from "./pages/ProductsPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import CartPage from "./pages/CartPage";
import AdminPage from "./pages/AdminPage";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            {/* Background gradient overlay */}
            <div className="fixed inset-0 pointer-events-none z-0">
              <div className="absolute top-0 left-[20%] w-[500px] h-[500px] bg-indigo-500/[0.06] rounded-full blur-3xl" />
              <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-purple-500/[0.04] rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 min-h-screen">
              <Navbar />
              <main className="max-w-7xl mx-auto px-4">
                <Routes>
                  <Route path="/" element={<ProductsPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route
                    path="/cart"
                    element={
                      <ProtectedRoute>
                        <CartPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute adminOnly>
                        <AdminPage />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>
            </div>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
