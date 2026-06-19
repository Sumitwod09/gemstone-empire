"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/mock-data";
import { ProductEditForm } from "./ProductEditForm";
import { VariantList } from "./VariantList";
import type { Product, GemVariant } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductEditPage({ params }: PageProps) {
  const { id } = use(params);
  const isNew = id === "new";

  const initialProduct = isNew ? null : MOCK_PRODUCTS.find((p) => p.id === id);
  const [product, setProduct] = useState<Product | null>(initialProduct || null);
  const [variants, setVariants] = useState<GemVariant[]>(initialProduct?.variants || []);

  if (!isNew && !initialProduct) {
    notFound();
  }

  const handleSaveProduct = (updatedProduct: Product) => {
    setProduct(updatedProduct);
  };

  const handleAddVariant = (newVariant: GemVariant) => {
    setVariants((prev) => [...prev, newVariant]);
  };

  const handleDeleteVariant = (variantId: string) => {
    setVariants((prev) => prev.filter((v) => v.id !== variantId));
  };

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
        categories={MOCK_CATEGORIES}
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
