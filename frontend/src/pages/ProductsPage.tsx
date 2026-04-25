import { useEffect, useState, useCallback } from "react";
import { productAPI } from "../services/api";
import type { Product, Pagination } from "../types";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";
import { Search, PackageX } from "lucide-react";

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page };
      if (search) params.search = search;
      if (category) params.category = category;

      const res = await productAPI.getAll(params);
      setProducts(res.data.data.products);
      setPagination(res.data.data.pagination);

      // Build unique category list from first unfiltered load
      if (!category && !search && page === 1) {
        const cats = [
          ...new Set(res.data.data.products.map((p) => p.category)),
        ];
        setCategories((prev) => (prev.length > 0 ? prev : cats));
      }
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, page]);

  useEffect(() => {
    const debounce = setTimeout(fetchProducts, 300);
    return () => clearTimeout(debounce);
  }, [fetchProducts]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, category]);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold">Products</h1>
        <p className="text-gray-500 text-sm mt-1">
          Browse our collection and find what you need
        </p>
      </div>

      {/* Toolbar: Search + Filter */}
      <div className="flex gap-3 flex-wrap items-center mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="min-w-[160px] bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
        >
          <option value="" className="bg-gray-900">
            All Categories
          </option>
          {categories.map((c) => (
            <option key={c} value={c} className="bg-gray-900 capitalize">
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <Spinner />
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <PackageX size={48} className="mx-auto mb-3 text-gray-600" />
          <p className="text-lg">No products found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((p) => (
              <ProductCard
                key={p._id}
                product={p}
                onStockChange={fetchProducts}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-sm font-medium border border-white/10 rounded-lg hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                ← Prev
              </button>
              <span className="text-sm text-gray-400">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((p) => Math.min(pagination.totalPages, p + 1))
                }
                disabled={page === pagination.totalPages}
                className="px-4 py-2 text-sm font-medium border border-white/10 rounded-lg hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductsPage;
