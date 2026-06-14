"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema, type CategoryFormData } from "@/lib/validators";
import { Input, Textarea, Button, Badge } from "@/components/ui";
import { slugify } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Category } from "@/types";

interface CategoryManagerProps {
  categories: Category[];
}

export function CategoryManager({ categories }: CategoryManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { is_active: true, sort_order: 0 },
  });

  const openNew = () => {
    setEditing(null);
    reset({ is_active: true, sort_order: 0 });
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
      const url = editing ? `/api/admin/categories/${editing.id}` : "/api/admin/categories";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast.success(editing ? "Category updated" : "Category created");
      setShowForm(false);
      router.refresh();
    } catch {
      toast.error("Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    try {
      await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      toast.success("Category deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <Button onClick={openNew}>+ Add Category</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white border border-[var(--color-border)] rounded-[8px] p-4 flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold">{cat.name}</p>
              <Badge variant={cat.is_active ? "success" : "default"}>
                {cat.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
            <p className="text-xs text-[var(--color-text-muted)]">/products?category={cat.slug}</p>
            {cat.description && (
              <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2">{cat.description}</p>
            )}
            <div className="flex gap-2 mt-2">
              <Button size="sm" variant="secondary" onClick={() => openEdit(cat)}>Edit</Button>
              <Button size="sm" variant="danger" onClick={() => deleteCategory(cat.id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40">
          <div className="bg-white rounded-[8px] border border-[var(--color-border)] p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-base font-semibold mb-4">{editing ? "Edit Category" : "New Category"}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <Input label="Name" {...register("name")} error={errors.name?.message}
                onChange={(e) => { setValue("name", e.target.value); if (!editing) setValue("slug", slugify(e.target.value)); }}
              />
              <Input label="Slug" {...register("slug")} error={errors.slug?.message} />
              <Textarea label="Description" {...register("description")} rows={2} />
              <Input label="Image URL" {...register("image_url")} />
              <Input label="Sort Order" type="number" {...register("sort_order", { valueAsNumber: true })} />
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" {...register("is_active")} className="accent-[var(--color-accent)]" />
                Active
              </label>
              <div className="flex gap-2 pt-2 border-t border-[var(--color-border)]">
                <Button type="submit" loading={loading}>Save</Button>
                <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
