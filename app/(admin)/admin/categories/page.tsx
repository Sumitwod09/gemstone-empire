import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { CategoryManager } from "./CategoryManager";
import type { Category } from "@/types";

export const metadata: Metadata = { title: "Categories — Admin" };

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-6">
        Categories
      </h1>
      <CategoryManager categories={(categories as Category[]) ?? []} />
    </div>
  );
}
