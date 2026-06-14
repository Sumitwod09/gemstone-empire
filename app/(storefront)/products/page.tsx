import type { Metadata } from "next";
import { Suspense } from "react";
import { getProducts, getCategories } from "@/lib/db";
import { ProductCard } from "@/components/storefront/ProductCard";
import { FilterSidebar } from "@/components/storefront/FilterSidebar";
import { Pagination } from "@/components/storefront/Pagination";
import { Spinner } from "@/components/ui";
import type { ProductFilters } from "@/types";

export const metadata: Metadata = {
  title: "All Gemstones",
  description: "Browse our full collection of loose precious and semi-precious gemstones.",
};

interface PageProps {
  searchParams: Promise<Record<string, string>>;
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "carat_asc", label: "Carat Weight" },
];

const PAGE_SIZE = 24;

async function ProductGrid({ searchParams }: { searchParams: Record<string, string> }) {
  const page = Math.max(1, parseInt(searchParams.page ?? "1"));
  const sort = (searchParams.sort ?? "newest") as ProductFilters["sort"];

  const filters: ProductFilters = {
    page,
    limit: PAGE_SIZE,
    sort,
    category: searchParams.category,
    shape: searchParams.shape,
    origin: searchParams.origin,
    treatment: searchParams.treatment,
    price_min: searchParams.price_min ? Number(searchParams.price_min) : undefined,
    price_max: searchParams.price_max ? Number(searchParams.price_max) : undefined,
    carat_min: searchParams.carat_min ? Number(searchParams.carat_min) : undefined,
    carat_max: searchParams.carat_max ? Number(searchParams.carat_max) : undefined,
  };

  const { data: products, total, totalPages } = await getProducts(filters);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[var(--color-text-secondary)]">
          {total} {total === 1 ? "gem" : "gems"} found
        </p>
        <select
          defaultValue={sort}
          className="border border-[var(--color-border)] rounded-[6px] px-3 py-1.5 text-sm outline-none focus:border-[var(--color-accent)]"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-[var(--color-text-muted)]">
          <p className="text-lg font-medium mb-2">No gems found</p>
          <p className="text-sm">Try adjusting your filters.</p>
        </div>
      )}
      <Pagination page={page} totalPages={totalPages} />
    </>
  );
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const categories = await getCategories();

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-10">
      <h1
        className="text-3xl font-bold text-[var(--color-text-primary)] mb-8"
        style={{ fontFamily: "var(--font-display)" }}
      >
        All Gemstones
      </h1>
      <div className="flex gap-8">
        <FilterSidebar categories={categories} />
        <div className="flex-1 min-w-0">
          <Suspense fallback={<Spinner className="mx-auto mt-16" size="lg" />}>
            <ProductGrid searchParams={params} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
