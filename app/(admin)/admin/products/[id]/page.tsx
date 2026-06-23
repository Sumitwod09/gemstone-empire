"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProductEditForm } from "./ProductEditForm";
import { VariantList } from "./VariantList";
import type { Product, GemVariant, Category } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductEditPage({ params }: PageProps) {
  const { id } = use(params);
  const isNew = id === "new";
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<GemVariant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const catRes = await fetch("/api/admin/categories");
        if (catRes.ok) setCategories(await catRes.json());

        if (!isNew) {
          const prodRes = await fetch("/api/admin/products");
          if (prodRes.ok) {
            const allProducts: Product[] = await prodRes.json();
            const found = allProducts.find((p) => p.id === id);
            if (found) {
              setProduct(found);
              setVariants(found.variants || []);
            } else {
              router.push("/admin/products");
            }
          }
        }
      } catch (err) {
        console.error("Failed to load edit product data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id, isNew, router]);

  const handleSaveProduct = (updatedProduct: Product) => {
    setProduct(updatedProduct);
  };

  const handleAddVariant = (newVariant: GemVariant) => {
    setVariants((prev) => [...prev, newVariant]);
  };

  const handleDeleteVariant = (variantId: string) => {
    setVariants((prev) => prev.filter((v) => v.id !== variantId));
  };

  if (loading) {
    return <div className="text-gray-400 text-xs py-8">Loading product details...</div>;
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">
          {isNew ? "Add Product" : "Edit Product"}
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          {isNew ? "Create a new gemstone product entry" : `Manage details for ${product?.name}`}
        </p>
      </div>

      <ProductEditForm
        product={product}
        categories={categories}
        onSave={handleSaveProduct}
      />

      {!isNew && product && (
        <section className="mt-10">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-800">Product Variants</h2>
            <p className="text-xs text-gray-400 mt-0.5">Manage weight, price, and cuts for this gemstone</p>
          </div>
          <VariantList
            productId={id}
            variants={variants}
            onAddVariant={handleAddVariant}
            onDeleteVariant={handleDeleteVariant}
          />
        </section>
      )}
    </div>
  );
}
