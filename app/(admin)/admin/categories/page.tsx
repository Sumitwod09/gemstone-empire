import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { CategoryManager } from "./CategoryManager";

export const metadata: Metadata = { title: "Categories — Admin" };

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  
  // Fetch all categories (active & inactive)
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  return (
    <div>
      <div className="mb-6 text-left">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Categories</h1>
        <p className="text-xs text-gray-400 mt-0.5">Manage gemstone storefront product categories</p>
      </div>
      <CategoryManager categories={categories ?? []} />
    </div>
  );
}
