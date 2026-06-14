"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductFormData } from "@/lib/validators";
import { Input, Textarea, Button, Select } from "@/components/ui";
import { slugify } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product, Category } from "@/types";

interface ProductEditFormProps {
  product: Product | null;
  categories: Category[];
}

export function ProductEditForm({ product, categories }: ProductEditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          slug: product.slug,
          description: product.description ?? "",
          category_id: product.category_id,
          is_active: product.is_active,
          is_featured: product.is_featured,
          meta_title: product.meta_title ?? "",
          meta_description: product.meta_description ?? "",
        }
      : { is_active: true, is_featured: false },
  });

  const nameValue = watch("name");

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);
    try {
      const url = product ? `/api/admin/products/${product.id}` : "/api/admin/products";
      const method = product ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      const result = await res.json();
      toast.success(product ? "Product updated" : "Product created");
      if (!product) router.push(`/admin/products/${result.id}`);
      else router.refresh();
    } catch {
      toast.error("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async () => {
    if (!product || !confirm("Delete this product?")) return;
    try {
      await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
      toast.success("Product deleted");
      router.push("/admin/products");
    } catch {
      toast.error("Failed to delete product");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 bg-white border border-[var(--color-border)] rounded-[8px] p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Input
            label="Product Name"
            {...register("name")}
            error={errors.name?.message}
            onChange={(e) => {
              setValue("name", e.target.value);
              if (!product) setValue("slug", slugify(e.target.value));
            }}
          />
        </div>
        <div className="sm:col-span-2">
          <Input
            label="Slug"
            {...register("slug")}
            error={errors.slug?.message}
          />
        </div>
        <div className="sm:col-span-2">
          <Textarea
            label="Description"
            {...register("description")}
            rows={3}
          />
        </div>
        <div className="sm:col-span-2">
          <Select
            label="Category"
            {...register("category_id")}
            error={errors.category_id?.message}
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
            placeholder="Select category..."
          />
        </div>
        <Input label="Meta Title" {...register("meta_title")} />
        <Input label="Meta Description" {...register("meta_description")} />
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" {...register("is_active")} className="accent-[var(--color-accent)]" />
          Active
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" {...register("is_featured")} className="accent-[var(--color-accent)]" />
          Featured
        </label>
      </div>

      <div className="flex items-center gap-3 pt-2 border-t border-[var(--color-border)]">
        <Button type="submit" loading={loading}>
          {product ? "Save Changes" : "Create Product"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancel
        </Button>
        {product && (
          <Button type="button" variant="danger" className="ml-auto" onClick={deleteProduct}>
            Delete Product
          </Button>
        )}
      </div>
    </form>
  );
}
