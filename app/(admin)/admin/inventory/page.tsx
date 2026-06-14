import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { InventoryTable } from "./InventoryTable";

export const metadata: Metadata = { title: "Inventory — Admin" };

export default async function AdminInventoryPage() {
  const supabase = await createClient();

  const { data: variants } = await supabase
    .from("gem_variants")
    .select(`*, product:products(name)`)
    .eq("is_active", true)
    .order("stock_qty", { ascending: true });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-6">Inventory</h1>
      <InventoryTable variants={variants ?? []} />
    </div>
  );
}
