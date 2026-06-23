"use client";

import { useState, useEffect } from "react";
import { InventoryTable } from "./InventoryTable";

export default function AdminInventoryPage() {
  const [variants, setVariants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVariants() {
      try {
        const res = await fetch("/api/admin/variants");
        if (res.ok) {
          setVariants(await res.json());
        }
      } catch (err) {
        console.error("Failed to load inventory", err);
      } finally {
        setLoading(false);
      }
    }
    fetchVariants();
  }, []);

  return (
    <div>
      <div className="mb-6 text-left">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Inventory</h1>
        <p className="text-xs text-gray-400 mt-0.5">Manage gemstone variant stock quantities</p>
      </div>
      {loading ? (
        <div className="text-gray-400 text-xs py-8">Loading inventory data...</div>
      ) : (
        <InventoryTable variants={variants} />
      )}
    </div>
  );
}
