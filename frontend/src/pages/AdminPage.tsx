import { useState, type FormEvent } from "react";
import { productAPI } from "../services/api";
import { useToast } from "../components/Toast";
import { Package, Rocket } from "lucide-react";
const AdminPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    stockQuantity: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await productAPI.create({
        name: form.name,
        price: parseFloat(form.price),
        category: form.category,
        stockQuantity: parseInt(form.stockQuantity, 10),
      });
      toast("Product added to inventory successfully!", "success");
      setForm({ name: "", price: "", category: "", stockQuantity: "" });
    } catch (err: unknown) {
      toast(
        err instanceof Error ? err.message : "Failed to create product",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all placeholder:text-gray-600";

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold gradient-text">Inventory Management</h1>
          <p className="text-gray-400 text-sm mt-2">
            Securely add and manage product listings for your storefront.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-indigo-500/10 px-4 py-2 rounded-lg border border-indigo-500/20">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          <span className="text-xs font-semibold text-indigo-300 tracking-wide uppercase">Admin Privileges Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Container */}
        <div className="lg:col-span-2 p-8 bg-gray-950/50 border border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 text-indigo-400">
              <Package size={24} />
            </div>
            <h2 className="text-xl font-bold text-white">Create New Product</h2>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
                required
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">
                  Price ($)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="349.99"
                    min="0"
                    step="0.01"
                    required
                    className={`${inputClass} pl-8`}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">
                  Initial Stock
                </label>
                <input
                  type="number"
                  name="stockQuantity"
                  value={form.stockQuantity}
                  onChange={handleChange}
                  placeholder="150"
                  min="0"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="e.g. electronics, apparel, home"
                required
                className={inputClass}
              />
            </div>

            <hr className="border-white/5 my-2" />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 text-sm font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none cursor-pointer"
            >
              {loading ? "Adding to Inventory..." : "+ Add to Inventory"}
            </button>
          </form>
        </div>

        {/* Live Preview / Info Card */}
        <div className="hidden lg:flex flex-col gap-4">
          <div className="p-6 bg-gradient-to-b from-indigo-500/10 to-transparent border border-indigo-500/20 rounded-3xl h-full flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(99,102,241,0.2)] text-indigo-400">
              <Rocket size={40} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Live Storefront</h3>
            <p className="text-sm text-gray-400 leading-relaxed px-4">
              Products added here will instantly appear on the main storefront and be available for users to purchase.
            </p>
            <p className="text-xs text-indigo-400 font-semibold mt-6 bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">
              Changes are irreversible
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
