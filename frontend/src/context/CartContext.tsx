import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { cartAPI } from "../services/api";
import { useAuth } from "./AuthContext";
import type { CartItem } from "../types";

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  loading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isLoggedIn) return;
    setLoading(true);
    try {
      const res = await cartAPI.get();
      const cart = res.data.data.cart;
      setItems(cart.items || []);
      setTotalItems(cart.totalItems || 0);
      setTotalPrice(cart.totalPrice || 0);
    } catch {
      // Cart may not exist yet — that's fine
      setItems([]);
      setTotalItems(0);
      setTotalPrice(0);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  const addToCart = useCallback(
    async (productId: string, quantity = 1) => {
      await cartAPI.addItem(productId, quantity);
      await fetchCart();
    },
    [fetchCart],
  );

  // Fetch cart on login
  useEffect(() => {
    if (isLoggedIn) fetchCart();
    else {
      setItems([]);
      setTotalItems(0);
      setTotalPrice(0);
    }
  }, [isLoggedIn, fetchCart]);

  return (
    <CartContext.Provider
      value={{ items, totalItems, totalPrice, loading, fetchCart, addToCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
