/**
 * Data access layer. When NEXT_PUBLIC_SUPABASE_URL is not configured,
 * all functions fall back to local mock data so the UI can be previewed
 * without a Supabase project.
 */

import { cache } from "react";
import type { Category, Product, PaginatedResponse, ProductFilters } from "@/types";
import {
  MOCK_CATEGORIES,
  MOCK_PRODUCTS,
  FEATURED_PRODUCTS,
} from "@/lib/mock-data";

const CONFIGURED =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 10;

// ─── Categories ──────────────────────────────────────────────

export const getCategories = cache(async function getCategories(): Promise<Category[]> {
  if (!CONFIGURED) return MOCK_CATEGORIES;
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");
    return (data as Category[]) ?? MOCK_CATEGORIES;
  } catch {
    return MOCK_CATEGORIES;
  }
});

// ─── Products ────────────────────────────────────────────────

export const getFeaturedProducts = cache(async function getFeaturedProducts(): Promise<Product[]> {
  if (!CONFIGURED) return FEATURED_PRODUCTS;
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select(`*, category:categories(id,name,slug), variants:gem_variants(*, images:gem_images(*))`)
      .eq("is_featured", true)
      .eq("is_active", true)
      .limit(6);
    return (data as Product[]) ?? FEATURED_PRODUCTS;
  } catch {
    return FEATURED_PRODUCTS;
  }
});

export const getProducts = cache(async function getProducts(
  filters: ProductFilters = {}
): Promise<PaginatedResponse<Product>> {
  const { page = 1, limit = 24, category, shape, origin, treatment, sort } = filters;

  if (!CONFIGURED) {
    let results = [...MOCK_PRODUCTS];
    if (category) results = results.filter((p) => p.category?.slug === category);
    if (shape) results = results.filter((p) => p.variants?.some((v) => v.shape === shape));
    if (origin) results = results.filter((p) => p.variants?.some((v) => v.origin === origin));
    if (treatment) results = results.filter((p) => p.variants?.some((v) => v.treatment === treatment));
    if (filters.price_min) results = results.filter((p) => p.variants?.some((v) => v.price >= (filters.price_min ?? 0)));
    if (filters.price_max) results = results.filter((p) => p.variants?.some((v) => v.price <= (filters.price_max ?? Infinity)));
    if (filters.carat_min) results = results.filter((p) => p.variants?.some((v) => v.carat_weight >= (filters.carat_min ?? 0)));
    if (filters.carat_max) results = results.filter((p) => p.variants?.some((v) => v.carat_weight <= (filters.carat_max ?? Infinity)));
    if (filters.q) {
      const q = filters.q.toLowerCase();
      results = results.filter((p) => p.name.toLowerCase().includes(q) || (p.description ?? "").toLowerCase().includes(q));
    }

    if (sort === "price_asc") results.sort((a, b) => (a.variants?.[0]?.price ?? 0) - (b.variants?.[0]?.price ?? 0));
    else if (sort === "price_desc") results.sort((a, b) => (b.variants?.[0]?.price ?? 0) - (a.variants?.[0]?.price ?? 0));
    else if (sort === "carat_asc") results.sort((a, b) => (a.variants?.[0]?.carat_weight ?? 0) - (b.variants?.[0]?.carat_weight ?? 0));

    const total = results.length;
    const from = (page - 1) * limit;
    const paged = results.slice(from, from + limit);
    return { data: paged, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("products")
      .select(`*, category:categories(id,name,slug), variants:gem_variants(*, images:gem_images(*))`, { count: "exact" })
      .eq("is_active", true);

    if (category) {
      const { data: cat } = await supabase.from("categories").select("id").eq("slug", category).single();
      if (cat) query = query.eq("category_id", (cat as { id: string }).id);
    }
    if (sort === "price_asc") query = query.order("created_at", { ascending: true });
    else query = query.order("created_at", { ascending: false });

    query = query.range(from, to);
    const { data, count } = await query;
    const total = count ?? 0;
    return { data: (data as Product[]) ?? [], total, page, limit, totalPages: Math.ceil(total / limit) };
  } catch {
    return getProducts({ ...filters }); // will hit mock branch on retry after CONFIGURED flips
  }
});

export const getProductBySlug = cache(async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!CONFIGURED) {
    return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select(`*, category:categories(*), variants:gem_variants(*, images:gem_images(*))`)
      .eq("slug", slug)
      .eq("is_active", true)
      .single();
    return (data as Product) ?? null;
  } catch {
    return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }
});

export const getRelatedProducts = cache(async function getRelatedProducts(categoryId: string, excludeId: string): Promise<Product[]> {
  if (!CONFIGURED) {
    return MOCK_PRODUCTS.filter((p) => p.category_id === categoryId && p.id !== excludeId).slice(0, 4);
  }
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select(`*, variants:gem_variants(*, images:gem_images(*))`)
      .eq("category_id", categoryId)
      .eq("is_active", true)
      .neq("id", excludeId)
      .limit(4);
    return (data as Product[]) ?? [];
  } catch {
    return MOCK_PRODUCTS.filter((p) => p.category_id === categoryId && p.id !== excludeId).slice(0, 4);
  }
});

export const searchProducts = cache(async function searchProducts(q: string): Promise<Product[]> {
  if (!CONFIGURED) {
    const query = q.toLowerCase();
    return MOCK_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        (p.description ?? "").toLowerCase().includes(query) ||
        p.category?.name.toLowerCase().includes(query) ||
        p.variants?.some(
          (v) => v.origin?.toLowerCase().includes(query) || v.color.toLowerCase().includes(query)
        )
    );
  }
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select(`*, category:categories(id,name,slug), variants:gem_variants(*, images:gem_images(*))`, { count: "exact" })
      .eq("is_active", true)
      .or(`name.ilike.%${q}%,description.ilike.%${q}%`)
      .limit(48);
    return (data as Product[]) ?? [];
  } catch {
    return searchProducts(q);
  }
});
