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
    try {
      const res = await fetch(`/api/admin/variants/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock_qty: qty }),
      });
      if (!res.ok) throw new Error();
      setVariants((prev) =>
        prev.map((v) => (v.id === id ? { ...v, stock_qty: qty } : v))
      );
      toast.success("Stock updated");
    } catch {
      toast.error("Failed to update stock");
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="bg-white border border-[var(--color-border)] rounded-[8px] overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
            <th className="px-4 py-2.5 text-left text-xs text-[var(--color-text-muted)] font-medium">SKU</th>
            <th className="px-4 py-2.5 text-left text-xs text-[var(--color-text-muted)] font-medium">Product</th>
            <th className="px-4 py-2.5 text-left text-xs text-[var(--color-text-muted)] font-medium">Shape / Carat</th>
            <th className="px-4 py-2.5 text-left text-xs text-[var(--color-text-muted)] font-medium">Stock Qty</th>
          </tr>
        </thead>
        <tbody>
          {variants.map((v) => {
            const lowStock = v.stock_qty < 3;
            return (
              <tr
                key={v.id}
                className={`border-b border-[var(--color-border)] last:border-0 ${lowStock ? "bg-[var(--color-warning-light)]" : "hover:bg-[var(--color-surface-hover)]"}`}
              >
                <td className="px-4 py-2.5 font-mono text-xs">{v.sku}</td>
                <td className="px-4 py-2.5 font-medium">{v.product?.name ?? "—"}</td>
                <td className="px-4 py-2.5 text-[var(--color-text-secondary)] capitalize">
                  {v.shape} / {formatCarat(v.carat_weight)}
                </td>
                <td className="px-4 py-2.5">
                  <input
                    type="number"
                    min={0}
                    defaultValue={v.stock_qty}
                    className={`w-16 border rounded-[4px] px-2 py-1 text-sm outline-none focus:border-[var(--color-accent)] ${lowStock ? "border-[var(--color-warning)]" : "border-[var(--color-border)]"}`}
                    onBlur={(e) => {
                      const newQty = parseInt(e.target.value);
                      if (!isNaN(newQty) && newQty !== v.stock_qty) {
                        updateStock(v.id, newQty);
                      }
                    }}
                    disabled={saving === v.id}
                  />
                  {saving === v.id && <span className="ml-2 text-xs text-[var(--color-text-muted)]">Saving…</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
