import type { Metadata } from "next";
import { Suspense } from "react";
import { searchProducts, getCategories } from "@/lib/db";
import { ProductCard } from "@/components/storefront/ProductCard";
import { FilterSidebar } from "@/components/storefront/FilterSidebar";
import { Spinner } from "@/components/ui";
import Link from "next/link";
import { Button } from "@/components/ui";

export const metadata: Metadata = { title: "Search" };

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

async function SearchResults({ q }: { q: string }) {
  const products = await searchProducts(q);

  if (products.length === 0) {
    return (
      <div className="py-16 text-center text-[var(--color-text-muted)]">
        <p className="text-lg font-medium mb-2">No results for "{q}"</p>
        <p className="text-sm mb-6">Try a different term or browse by category.</p>
        <Link href="/products">
          <Button>Browse All Gems</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="text-sm text-[var(--color-text-secondary)] mb-4">
        {products.length} result{products.length !== 1 ? "s" : ""} for "{q}"
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const categories = await getCategories();

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-10">
      <h1
        className="text-3xl font-bold text-[var(--color-text-primary)] mb-8"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {q ? `Search results for "${q}"` : "Search"}
      </h1>

      <div className="flex gap-8">
        <FilterSidebar categories={categories} />
        <div className="flex-1 min-w-0">
          {q ? (
            <Suspense fallback={<Spinner className="mx-auto mt-16" size="lg" />}>
              <SearchResults q={q} />
            </Suspense>
          ) : (
            <p className="text-[var(--color-text-muted)]">
              Enter a search term in the header to find gemstones.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
