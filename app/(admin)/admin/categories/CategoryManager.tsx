"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema, type CategoryFormData } from "@/lib/validators";
import { Input, Textarea, Button } from "@/components/ui";
import { slugify } from "@/lib/utils";
import { toast } from "sonner";
import type { Category } from "@/types";

interface CategoryManagerProps {
  categories: Category[];
}

export function CategoryManager({ categories: initialCategories }: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { is_active: true, sort_order: 0 },
  });

  const openNew = () => {
    setEditing(null);
    reset({ is_active: true, sort_order: 0, name: "", slug: "", description: "", image_url: "", meta_title: "", meta_description: "" });
    setShowForm(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    reset({
      name: cat.name,
      slug: cat.slug,
      description: cat.description ?? "",
      image_url: cat.image_url ?? "",
      sort_order: cat.sort_order,
      is_active: cat.is_active,
      meta_title: cat.meta_title ?? "",
      meta_description: cat.meta_description ?? "",
    });
    setShowForm(true);
  };

  const onSubmit = async (data: CategoryFormData) => {
    setLoading(true);

    try {
      if (editing) {
        const res = await fetch("/api/admin/categories", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editing.id,
            name: data.name,
            slug: data.slug,
            description: data.description || null,
            image_url: data.image_url || null,
            sort_order: data.sort_order ?? 0,
            is_active: !!data.is_active,
            meta_title: data.meta_title || null,
            meta_description: data.meta_description || null,
          }),
        });

        if (!res.ok) throw new Error("Failed to update category");
        const updated = await res.json();
        setCategories((prev) => prev.map((c) => (c.id === editing.id ? updated : c)));
        toast.success("Category updated successfully");
      } else {
        const res = await fetch("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            slug: data.slug,
            description: data.description || null,
            image_url: data.image_url || null,
            sort_order: data.sort_order ?? 0,
            is_active: !!data.is_active,
            meta_title: data.meta_title || null,
            meta_description: data.meta_description || null,
          }),
        });

        if (!res.ok) throw new Error("Failed to create category");
        const created = await res.json();
        setCategories((prev) => [...prev, created]);
        toast.success("Category created successfully");
      }
      setShowForm(false);
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? All products using it will be affected.")) return;
    try {
      const res = await fetch("/api/admin/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete category");
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success("Category deleted");
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <Button onClick={openNew} className="bg-emerald-600 hover:bg-emerald-700">
          + Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col justify-between min-h-[160px] hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-gray-800">{cat.name}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  cat.is_active
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    : "bg-gray-100 text-gray-500 border border-gray-200"
                }`}>
                  {cat.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="text-[10px] font-mono text-gray-400">/products?category={cat.slug}</p>
              {cat.description && (
                <p className="text-xs text-gray-500 line-clamp-2 mt-1">{cat.description}</p>
              )}
            </div>
            <div className="flex gap-2 mt-4 pt-3 border-t border-gray-50">
              <Button size="sm" variant="secondary" onClick={() => openEdit(cat)}>Edit</Button>
              <Button size="sm" variant="danger" className="bg-red-50 text-red-600 hover:bg-red-100 border-none" onClick={() => deleteCategory(cat.id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm">
          <div className="bg-white rounded-lg border border-gray-200 p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-base font-bold text-gray-800 mb-4">{editing ? "Edit Category" : "New Category"}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <Input
                label="Name"
                {...register("name")}
                error={errors.name?.message}
                onChange={(e) => {
                  setValue("name", e.target.value);
                  if (!editing) setValue("slug", slugify(e.target.value));
                }}
              />
              <Input label="Slug" {...register("slug")} error={errors.slug?.message} />
              <Textarea label="Description" {...register("description")} rows={2} />
              <Input label="Image URL" {...register("image_url")} />
              <Input label="Sort Order" type="number" {...register("sort_order", { valueAsNumber: true })} />
              <label className="flex items-center gap-2 text-sm cursor-pointer text-gray-600 font-medium">
                <input type="checkbox" {...register("is_active")} className="accent-emerald-600 rounded" />
                Active
              </label>
              <div className="flex gap-2 pt-4 mt-2 border-t border-gray-100 justify-end">
                <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit" loading={loading} className="bg-emerald-600 hover:bg-emerald-700">Save</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
