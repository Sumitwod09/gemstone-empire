"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { Category } from "@/types";

const SHAPES = ["oval", "round", "cushion", "pear", "marquise", "emerald", "heart", "trillion", "octagon"];
const TREATMENTS = ["heat", "unheated", "beryllium", "none"];
const ORIGINS = ["Burma", "Ceylon", "Brazil", "Colombia", "Mozambique", "Thailand", "Madagascar"];

interface FilterSidebarProps {
  categories: Category[];
}

export function FilterSidebar({ categories }: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const get = (key: string) => searchParams.get(key) ?? "";

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  const clearAll = () => {
    router.push(pathname);
  };

  const hasFilters = ["category", "shape", "origin", "treatment", "price_min", "price_max", "carat_min", "carat_max"].some(
    (k) => !!searchParams.get(k)
  );

  return (
    <div className="w-full bg-gray-50 border border-gray-200 rounded-md p-4 mb-6 text-left">
      <div className="flex flex-wrap items-center gap-4 text-xs">
        {/* Category Select */}
        <div className="flex flex-col gap-1">
          <label className="font-bold text-gray-500 uppercase tracking-wider">Category</label>
          <select
            value={get("category")}
            onChange={(e) => update("category", e.target.value)}
            className="border border-gray-300 rounded px-2.5 py-1.5 bg-white text-gray-800 focus:border-[#006B3F] outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Shape Select */}
        <div className="flex flex-col gap-1">
          <label className="font-bold text-gray-500 uppercase tracking-wider">Shape</label>
          <select
            value={get("shape")}
            onChange={(e) => update("shape", e.target.value)}
            className="border border-gray-300 rounded px-2.5 py-1.5 bg-white text-gray-800 focus:border-[#006B3F] outline-none capitalize"
          >
            <option value="">All Shapes</option>
            {SHAPES.map((shape) => (
              <option key={shape} value={shape}>{shape}</option>
            ))}
          </select>
        </div>

        {/* Origin Select */}
        <div className="flex flex-col gap-1">
          <label className="font-bold text-gray-500 uppercase tracking-wider">Origin</label>
          <select
            value={get("origin")}
            onChange={(e) => update("origin", e.target.value)}
            className="border border-gray-300 rounded px-2.5 py-1.5 bg-white text-gray-800 focus:border-[#006B3F] outline-none"
          >
            <option value="">All Origins</option>
            {ORIGINS.map((origin) => (
              <option key={origin} value={origin}>{origin}</option>
            ))}
          </select>
        </div>

        {/* Treatment Select */}
        <div className="flex flex-col gap-1">
          <label className="font-bold text-gray-500 uppercase tracking-wider">Treatment</label>
          <select
            value={get("treatment")}
            onChange={(e) => update("treatment", e.target.value)}
            className="border border-gray-300 rounded px-2.5 py-1.5 bg-white text-gray-800 focus:border-[#006B3F] outline-none capitalize"
          >
            <option value="">All Treatments</option>
            {TREATMENTS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Price Inputs */}
        <div className="flex flex-col gap-1">
          <label className="font-bold text-gray-500 uppercase tracking-wider">Price (USD)</label>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              placeholder="Min"
              value={get("price_min")}
              onChange={(e) => update("price_min", e.target.value)}
              className="w-16 border border-gray-300 rounded px-2 py-1 bg-white text-gray-800 focus:border-[#006B3F] outline-none"
            />
            <span className="text-gray-400">–</span>
            <input
              type="number"
              placeholder="Max"
              value={get("price_max")}
              onChange={(e) => update("price_max", e.target.value)}
              className="w-16 border border-gray-300 rounded px-2 py-1 bg-white text-gray-800 focus:border-[#006B3F] outline-none"
            />
          </div>
        </div>

        {/* Carat Weight Inputs */}
        <div className="flex flex-col gap-1">
          <label className="font-bold text-gray-500 uppercase tracking-wider">Carats</label>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              step="0.01"
              placeholder="Min"
              value={get("carat_min")}
              onChange={(e) => update("carat_min", e.target.value)}
              className="w-16 border border-gray-300 rounded px-2 py-1 bg-white text-gray-800 focus:border-[#006B3F] outline-none"
            />
            <span className="text-gray-400">–</span>
            <input
              type="number"
              step="0.01"
              placeholder="Max"
              value={get("carat_max")}
              onChange={(e) => update("carat_max", e.target.value)}
              className="w-16 border border-gray-300 rounded px-2 py-1 bg-white text-gray-800 focus:border-[#006B3F] outline-none"
            />
          </div>
        </div>

        {/* Clear Filters Button */}
        {hasFilters && (
          <button
            onClick={clearAll}
            className="bg-emerald-50 text-[#006B3F] hover:bg-emerald-100 border border-emerald-200 rounded px-3 py-1.5 font-bold self-end transition-colors cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
}
