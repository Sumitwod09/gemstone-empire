import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductEditForm } from "./ProductEditForm";
import { VariantList } from "./VariantList";
import type { Product, Category } from "@/types";

export const metadata: Metadata = { title: "Edit Product — Admin" };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductEditPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const isNew = id === "new";

  const [{ data: product }, { data: categories }] = await Promise.all([
    isNew
      ? Promise.resolve({ data: null })
      : supabase
          .from("products")
          .select(`*, variants:gem_variants(*, images:gem_images(*))`)
          .eq("id", id)
          .single(),
    supabase.from("categories").select("id, name").eq("is_active", true),
  ]);

  if (!isNew && !product) notFound();

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold mb-6">
        {isNew ? "Add Product" : "Edit Product"}
      </h1>

      <ProductEditForm
        product={isNew ? null : (product as Product)}
        categories={(categories as Category[]) ?? []}
      />

      {!isNew && product && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold mb-4">Variants</h2>
          <VariantList
            productId={id}
            variants={(product as Product).variants ?? []}
          />
        </section>
      )}
    </div>
  );
}
