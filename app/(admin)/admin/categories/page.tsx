import type { Metadata } from "next";
import { MOCK_CATEGORIES } from "@/lib/mock-data";
import { CategoryManager } from "./CategoryManager";

export const metadata: Metadata = { title: "Categories — Admin" };

export default function AdminCategoriesPage() {
  return (
    <div>
      <div className="mb-6 text-left">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Categories</h1>
        <p className="text-xs text-gray-400 mt-0.5">Manage gemstone storefront product categories</p>
      </div>
      <CategoryManager categories={MOCK_CATEGORIES} />
    </div>
  );
}
