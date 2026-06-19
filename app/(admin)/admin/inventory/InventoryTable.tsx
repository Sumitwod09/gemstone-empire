"use client";

import { useState } from "react";
import { toast } from "sonner";
import { formatCarat } from "@/lib/utils";

interface InventoryVariant {
  id: string;
  sku: string;
  stock_qty: number;
  shape: string;
  carat_weight: number;
  product?: { name: string };
}

interface InventoryTableProps {
  variants: InventoryVariant[];
}

export function InventoryTable({ variants: initialVariants }: InventoryTableProps) {
  const [variants, setVariants] = useState(initialVariants);
  const [saving, setSaving] = useState<string | null>(null);

  const updateStock = async (id: string, qty: number) => {
    setSaving(id);
    // Simulate latency for premium feel
    await new Promise((resolve) => setTimeout(resolve, 500));

    setVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, stock_qty: qty } : v))
    );
    toast.success("Stock level updated (Local Mock Mode)");
    setSaving(null);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[500px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-4 py-2.5 text-left text-[10px] text-gray-400 font-bold uppercase tracking-wider">SKU</th>
              <th className="px-4 py-2.5 text-left text-[10px] text-gray-400 font-bold uppercase tracking-wider">Product</th>
              <th className="px-4 py-2.5 text-left text-[10px] text-gray-400 font-bold uppercase tracking-wider">Shape / Carat</th>
              <th className="px-4 py-2.5 text-left text-[10px] text-gray-400 font-bold uppercase tracking-wider">Stock Qty</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((v, i) => {
              const lowStock = v.stock_qty < 3;
              return (
                <tr
                  key={v.id}
                  className={`border-b border-gray-50 last:border-0 transition-colors ${
                    lowStock 
                      ? "bg-red-50/40 hover:bg-red-50/60" 
                      : i % 2 === 1 ? "bg-gray-50/30 hover:bg-gray-50/50" : "hover:bg-gray-50/50"
                  }`}
                >
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{v.sku}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800 text-xs">{v.product?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 capitalize">
                    {v.shape} / {formatCarat(v.carat_weight)} ct
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        defaultValue={v.stock_qty}
                        className={`w-16 border rounded px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-emerald-100 focus:border-emerald-400 transition-all ${
                          lowStock ? "border-red-200 bg-red-50/30 text-red-700" : "border-gray-200 text-gray-800"
                        }`}
                        onBlur={(e) => {
                          const newQty = parseInt(e.target.value);
                          if (!isNaN(newQty) && newQty !== v.stock_qty) {
                            updateStock(v.id, newQty);
                          }
                        }}
                        disabled={saving === v.id}
                      />
                      {saving === v.id && (
                        <span className="text-[10px] text-gray-400 animate-pulse font-medium">Saving…</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
