"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faSliders } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui";
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
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const toggle = useCallback(
    (key: string, value: string) => {
      const current = get(key);
      update(key, current === value ? "" : value);
    },
    [get, update]
  );

  const clearAll = () => {
    router.push(pathname);
  };

  const hasFilters = ["category", "shape", "color", "origin", "treatment"].some(
    (k) => !!searchParams.get(k)
  );

  const sidebarContent = (
    <div className="flex flex-col gap-6 text-sm">
      {hasFilters && (
        <button
          onClick={clearAll}
          className="text-[var(--color-accent)] text-xs font-medium hover:underline self-start"
        >
          Clear All Filters
        </button>
      )}

      {/* Category */}
      <div>
        <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] font-medium mb-2">
          Category
        </p>
        <div className="flex flex-col gap-1.5">
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={get("category") === cat.slug}
                onChange={() => toggle("category", cat.slug)}
                className="accent-[var(--color-accent)]"
              />
              <span className="text-[var(--color-text-primary)]">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Shape */}
      <div>
        <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] font-medium mb-2">
          Shape
        </p>
        <div className="flex flex-col gap-1.5">
          {SHAPES.map((shape) => (
            <label key={shape} className="flex items-center gap-2 cursor-pointer capitalize">
              <input
                type="checkbox"
                checked={get("shape") === shape}
                onChange={() => toggle("shape", shape)}
                className="accent-[var(--color-accent)]"
              />
              <span className="text-[var(--color-text-primary)] capitalize">{shape}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] font-medium mb-2">
          Price (USD)
        </p>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min"
            value={get("price_min")}
            onChange={(e) => update("price_min", e.target.value)}
            className="w-full border border-[var(--color-border)] rounded-[6px] px-2 py-1.5 text-xs focus:border-[var(--color-accent)] outline-none"
          />
          <span className="text-[var(--color-text-muted)]">–</span>
          <input
            type="number"
            placeholder="Max"
            value={get("price_max")}
            onChange={(e) => update("price_max", e.target.value)}
            className="w-full border border-[var(--color-border)] rounded-[6px] px-2 py-1.5 text-xs focus:border-[var(--color-accent)] outline-none"
          />
        </div>
      </div>

      {/* Carat range */}
      <div>
        <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] font-medium mb-2">
          Carat Weight
        </p>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            step="0.01"
            placeholder="Min"
            value={get("carat_min")}
            onChange={(e) => update("carat_min", e.target.value)}
            className="w-full border border-[var(--color-border)] rounded-[6px] px-2 py-1.5 text-xs focus:border-[var(--color-accent)] outline-none"
          />
          <span className="text-[var(--color-text-muted)]">–</span>
          <input
            type="number"
            step="0.01"
            placeholder="Max"
            value={get("carat_max")}
            onChange={(e) => update("carat_max", e.target.value)}
            className="w-full border border-[var(--color-border)] rounded-[6px] px-2 py-1.5 text-xs focus:border-[var(--color-accent)] outline-none"
          />
        </div>
      </div>

      {/* Origin */}
      <div>
        <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] font-medium mb-2">
          Origin
        </p>
        <div className="flex flex-col gap-1.5">
          {ORIGINS.map((origin) => (
            <label key={origin} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={get("origin") === origin}
                onChange={() => toggle("origin", origin)}
                className="accent-[var(--color-accent)]"
              />
              <span className="text-[var(--color-text-primary)]">{origin}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Treatment */}
      <div>
        <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] font-medium mb-2">
          Treatment
        </p>
        <div className="flex flex-col gap-1.5">
          {TREATMENTS.map((t) => (
            <label key={t} className="flex items-center gap-2 cursor-pointer capitalize">
              <input
                type="checkbox"
                checked={get("treatment") === t}
                onChange={() => toggle("treatment", t)}
                className="accent-[var(--color-accent)]"
              />
              <span className="text-[var(--color-text-primary)] capitalize">{t}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile filter toggle */}
      <div className="lg:hidden mb-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setMobileOpen(true)}
        >
          <FontAwesomeIcon icon={faSliders} className="w-4 h-4" />
          Filters
          {hasFilters && (
            <span className="ml-1 w-4 h-4 bg-[var(--color-accent)] text-white text-[9px] rounded-full flex items-center justify-center">
              !
            </span>
          )}
        </Button>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-[280px] flex-shrink-0 sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-0 left-0 h-full w-72 bg-white flex flex-col">
            <div className="flex items-center justify-between px-5 h-14 border-b border-[var(--color-border)] flex-shrink-0">
              <span className="text-sm font-semibold">Filters</span>
              <button onClick={() => setMobileOpen(false)}>
                <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {sidebarContent}
            </div>
            <div className="px-5 py-4 border-t border-[var(--color-border)]">
              <Button
                className="w-full"
                onClick={() => setMobileOpen(false)}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
