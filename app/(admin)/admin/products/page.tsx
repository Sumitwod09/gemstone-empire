import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DataTable } from "@/components/admin/DataTable";
import { Button, Badge } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import type { Product } from "@/types";

export const metadata: Metadata = { title: "Products — Admin" };

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select(`*, category:categories(name)`)
    .order("created_at", { ascending: false });

  if (params.q) {
    query = query.ilike("name", `%${params.q}%`);
  }

  const { data: products } = await query;

  const columns = [
    {
      key: "name",
      label: "Product",
      render: (_: unknown, row: Product) => (
        <Link href={`/admin/products/${row.id}`} className="font-medium text-[var(--color-accent)] hover:underline">
          {row.name}
        </Link>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (_: unknown, row: Product) => (row.category as { name: string } | undefined)?.name ?? "—",
    },
    {
      key: "is_active",
      label: "Status",
      render: (v: unknown) => (
        <Badge variant={v ? "success" : "default"}>{v ? "Active" : "Inactive"}</Badge>
      ),
    },
    {
      key: "is_featured",
      label: "Featured",
      render: (v: unknown) => v ? <Badge variant="accent">Featured</Badge> : "—",
    },
    {
      key: "created_at",
      label: "Created",
      render: (v: unknown) => formatDate(v as string),
    },
    {
      key: "actions",
      label: "",
      render: (_: unknown, row: Product) => (
        <div className="flex gap-2">
          <Link href={`/admin/products/${row.id}`}>
            <Button size="sm" variant="secondary">Edit</Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">Products</h1>
        <Link href="/admin/products/new">
          <Button>+ Add Product</Button>
        </Link>
      </div>

      <div className="mb-4">
        <form className="flex gap-2">
          <input
            name="q"
            defaultValue={params.q ?? ""}
            placeholder="Search products..."
            className="border border-[var(--color-border)] rounded-[6px] px-3 py-2 text-sm w-64 outline-none focus:border-[var(--color-accent)]"
          />
          <Button type="submit" variant="secondary" size="md">Search</Button>
        </form>
      </div>

      <DataTable
        columns={columns}
        data={(products ?? []) as Product[]}
        rowKey={(row) => row.id}
        emptyMessage="No products found."
      />
    </div>
  );
}
