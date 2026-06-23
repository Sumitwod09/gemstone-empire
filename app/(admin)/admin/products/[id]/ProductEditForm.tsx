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
  onSave?: (product: Product) => void;
}

export function ProductEditForm({ product, categories, onSave }: ProductEditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
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
      : { is_active: true, is_featured: false, name: "", slug: "", description: "", category_id: categories[0]?.id || "" },
  });

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);
    try {
      if (product) {
        // Update product
        const res = await fetch("/api/admin/products", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: product.id,
            name: data.name,
            slug: data.slug,
            description: data.description || null,
            category_id: data.category_id,
            is_active: !!data.is_active,
            is_featured: !!data.is_featured,
            meta_title: data.meta_title || null,
            meta_description: data.meta_description || null,
          }),
        });

        if (!res.ok) throw new Error("Failed to update product");
        const updated = await res.json();
        if (onSave) onSave(updated);
        toast.success("Product updated successfully");
      } else {
        // Create product
        const res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            slug: data.slug,
            description: data.description || null,
            category_id: data.category_id,
            is_active: !!data.is_active,
            is_featured: !!data.is_featured,
            meta_title: data.meta_title || null,
            meta_description: data.meta_description || null,
          }),
        });

        if (!res.ok) throw new Error("Failed to create product");
        const created = await res.json();
        toast.success("Product created successfully");
        router.push(`/admin/products/${created.id}`);
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async () => {
    if (!product || !confirm("Delete this product? All variants and history will be lost.")) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id }),
      });
      if (!res.ok) throw new Error("Failed to delete product");
      toast.success("Product deleted successfully");
      router.push("/admin/products");
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
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

      <div className="flex gap-6 mt-2">
        <label className="flex items-center gap-2 text-sm cursor-pointer text-gray-600 font-medium">
          <input type="checkbox" {...register("is_active")} className="accent-emerald-600 rounded" />
          Active
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer text-gray-600 font-medium">
          <input type="checkbox" {...register("is_featured")} className="accent-emerald-600 rounded" />
          Featured on Homepage
        </label>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-gray-100 justify-end">
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" loading={loading} className="bg-emerald-600 hover:bg-emerald-700">
          {product ? "Save Changes" : "Create Product"}
        </Button>
        {product && (
          <Button type="button" variant="danger" className="bg-red-50 text-red-600 hover:bg-red-100 border-none mr-auto sm:mr-0" onClick={deleteProduct}>
            Delete Product
          </Button>
        )}
      </div>
    </form>
  );
}
