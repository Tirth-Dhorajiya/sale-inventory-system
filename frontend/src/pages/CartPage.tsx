import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useToast } from "../components/Toast";
import { purchaseAPI } from "../services/api";
import Spinner from "../components/Spinner";
import { ShoppingCart, Plus, Minus } from "lucide-react";

const CartPage = () => {
  const { items, totalItems, totalPrice, loading, fetchCart, addToCart } = useCart();
  const { toast } = useToast();
  const [buying, setBuying] = useState(false);

  const handleBuyAll = async () => {
    setBuying(true);
    try {
      const res = await purchaseAPI.buyCart();
      const { succeeded, failed } = res.data.data;

      if (succeeded && succeeded.length > 0) {
        toast(`${succeeded.length} item(s) purchased!`, "success");
      }
      if (failed && failed.length > 0) {
        failed.forEach((f) => toast(`${f.product}: ${f.reason}`, "error"));
      }
      await fetchCart();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Purchase failed", "error");
    } finally {
      setBuying(false);
    }
  };

  const handleBuyItem = async (productId: string, name: string) => {
    setBuying(true);
    try {
      await purchaseAPI.buyProduct(productId, 1);
      toast(`Purchased ${name}!`, "success");
      await fetchCart();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Purchase failed", "error");
    } finally {
      setBuying(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold">Your Cart</h1>
        <p className="text-gray-500 text-sm mt-1">
          {totalItems > 0
            ? `${totalItems} item(s) in your cart`
            : "Your cart is empty"}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <ShoppingCart size={48} className="mx-auto mb-3 text-gray-600" />
          <p className="text-lg">Nothing here yet — start shopping!</p>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div
                key={item.product._id}
                className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:border-indigo-500/20 transition-all"
              >
                <div className="flex-1">
                  <p className="font-semibold text-white">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {item.product.category} · Stock: {item.product.stockQuantity}
                  </p>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => addToCart(item.product._id, -1)}
                      disabled={buying}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 text-white font-bold transition-all disabled:opacity-50 cursor-pointer"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-semibold text-sm min-w-[1rem] text-center">{item.quantity}</span>
                    <button
                      onClick={() => addToCart(item.product._id, 1)}
                      disabled={buying || item.quantity >= item.product.stockQuantity}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 text-white font-bold transition-all disabled:opacity-50 cursor-pointer"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <p className="font-bold text-indigo-400 mr-4">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() =>
                    handleBuyItem(item.product._id, item.product.name)
                  }
                  disabled={buying}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg hover:-translate-y-0.5 transition-all btn-glow disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 cursor-pointer"
                >
                  Buy
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-6 p-5 bg-gray-900/80 border border-white/10 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-sm text-gray-400">Total</p>
              <p className="text-2xl font-extrabold gradient-text">
                ${totalPrice.toFixed(2)}
              </p>
            </div>
            <button
              onClick={handleBuyAll}
              disabled={buying}
              className="px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl hover:-translate-y-0.5 transition-all btn-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 cursor-pointer"
            >
              {buying ? "Processing..." : "Purchase All"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
