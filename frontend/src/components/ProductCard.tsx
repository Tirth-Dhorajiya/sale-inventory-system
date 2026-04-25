import { useState } from "react";
import type { Product } from "../types";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "./Toast";
import { purchaseAPI } from "../services/api";

interface Props {
  product: Product;
  onStockChange?: () => void;
}

const ProductCard = ({ product, onStockChange }: Props) => {
  const { isLoggedIn } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);

  const stockLabel =
    product.stockQuantity === 0
      ? "Out of Stock"
      : product.stockQuantity <= 5
        ? `Only ${product.stockQuantity} left`
        : `${product.stockQuantity} in stock`;

  const stockColor =
    product.stockQuantity === 0
      ? "text-red-400"
      : product.stockQuantity <= 5
        ? "text-amber-400"
        : "text-gray-500";

  const handleAddToCart = async () => {
    if (!isLoggedIn) return toast("Please login first", "error");
    setBusy(true);
    try {
      await addToCart(product._id);
      toast(`${product.name} added to cart`, "success");
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Failed to add", "error");
    } finally {
      setBusy(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isLoggedIn) return toast("Please login first", "error");
    setBusy(true);
    try {
      await purchaseAPI.buyProduct(product._id, 1);
      toast(`Purchased ${product.name}!`, "success");
      onStockChange?.();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Purchase failed", "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 p-5 bg-gray-900/80 border border-white/10 rounded-2xl backdrop-blur-xl transition-all hover:border-indigo-500/30 hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:-translate-y-1 bg-gradient-to-br from-indigo-500/[0.06] to-purple-500/[0.03]">
      {/* Header */}
      <div className="flex justify-between items-start">
        <h3 className="text-base font-semibold text-white">{product.name}</h3>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-400">
          {product.category}
        </span>
      </div>

      {/* Price */}
      <p className="text-2xl font-extrabold gradient-text">
        ${product.price.toFixed(2)}
      </p>

      {/* Stock */}
      <p className={`text-xs font-medium ${stockColor}`}>{stockLabel}</p>

      {/* Actions */}
      <div className="flex gap-2 mt-auto pt-2">
        <button
          onClick={handleAddToCart}
          disabled={busy || product.stockQuantity === 0}
          className="flex-1 py-2 text-xs font-semibold text-indigo-400 border border-indigo-400/30 rounded-lg hover:bg-indigo-400/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          Add to Cart
        </button>
        <button
          onClick={handleBuyNow}
          disabled={busy || product.stockQuantity === 0}
          className="flex-1 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg hover:-translate-y-0.5 transition-all btn-glow disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 cursor-pointer"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
