import type { Metadata } from "next";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { InventoryTable } from "./InventoryTable";

export const metadata: Metadata = { title: "Inventory — Admin" };

export default function AdminInventoryPage() {
  const variants = MOCK_PRODUCTS.flatMap((p) =>
    (p.variants ?? []).map((v) => ({
      id: v.id,
      sku: v.sku,
      stock_qty: v.stock_qty,
      shape: v.shape,
      carat_weight: v.carat_weight,
      product: { name: p.name },
    }))
  ).sort((a, b) => a.stock_qty - b.stock_qty);

  return (
    <div>
      <div className="mb-6 text-left">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Inventory</h1>
        <p className="text-xs text-gray-400 mt-0.5">Manage gemstone variant stock quantities</p>
      </div>
      <InventoryTable variants={variants} />
    </div>
  );
}
