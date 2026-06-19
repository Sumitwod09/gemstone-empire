import type { Metadata } from "next";
import Link from "next/link";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/mock-data";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatPrice, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Products — Admin" };

export default function AdminProductsPage() {
  const products = MOCK_PRODUCTS;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-xs text-gray-400 mt-0.5">{products.length} total products</p>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors self-start sm:self-auto">
          + Add Product
        </button>
      </div>

      {/* Search */}
      <div className="mb-4 flex flex-col sm:flex-row gap-2">
        <input
          placeholder="Search products..."
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full sm:w-64 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100 transition-all"
        />
        <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-400 bg-white">
          <option value="">All Categories</option>
          {MOCK_CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.slug}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-2.5 text-left text-[10px] text-gray-400 font-bold uppercase tracking-wider">Product</th>
                <th className="px-4 py-2.5 text-left text-[10px] text-gray-400 font-bold uppercase tracking-wider">Category</th>
                <th className="px-4 py-2.5 text-left text-[10px] text-gray-400 font-bold uppercase tracking-wider">Price</th>
                <th className="px-4 py-2.5 text-left text-[10px] text-gray-400 font-bold uppercase tracking-wider">Status</th>
                <th className="px-4 py-2.5 text-left text-[10px] text-gray-400 font-bold uppercase tracking-wider">Featured</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, i) => {
                const v = product.variants?.[0];
                return (
                  <tr key={product.id} className={`border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors ${i % 2 === 1 ? "bg-gray-50/30" : ""}`}>
                    <td className="px-4 py-3">
                      <Link href={`/admin/products/${product.id}`} className="text-emerald-700 hover:underline font-semibold text-xs">
                        {product.name}
                      </Link>
                      {v && <p className="text-[10px] text-gray-400 mt-0.5">{v.sku}</p>}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{product.category?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-xs font-bold text-gray-800">{v ? formatPrice(v.price) : "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${product.is_active ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-gray-100 text-gray-500 border border-gray-200"}`}>
                        {product.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {product.is_featured ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                          Featured
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/products/${product.id}`}>
                        <button className="text-xs text-emerald-600 hover:text-emerald-800 font-semibold hover:underline">
                          Edit
                        </button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
