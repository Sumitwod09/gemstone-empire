"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { variantSchema, type VariantFormData } from "@/lib/validators";
import { Input, Button, Select } from "@/components/ui";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatPrice, formatCarat } from "@/lib/utils";
import type { GemVariant } from "@/types";

const SHAPES = ["oval", "round", "cushion", "pear", "marquise", "emerald", "heart", "trillion", "octagon"];
const GRADES = ["AAA", "AA", "A", "B"];
const CUT_GRADES = ["excellent", "very good", "good", "fair"];
const TREATMENTS = ["heat", "unheated", "beryllium", "none"];

interface VariantListProps {
  productId: string;
  variants: GemVariant[];
}

export function VariantList({ productId, variants }: VariantListProps) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<VariantFormData>({
    resolver: zodResolver(variantSchema),
    defaultValues: { stock_qty: 1, is_active: true },
  });

  const onSubmit = async (data: VariantFormData) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}/variants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast.success("Variant added");
      reset();
      setShowForm(false);
      router.refresh();
    } catch {
      toast.error("Failed to add variant");
    } finally {
      setLoading(false);
    }
  };

  const deleteVariant = async (id: string) => {
    if (!confirm("Delete this variant?")) return;
    try {
      await fetch(`/api/admin/variants/${id}`, { method: "DELETE" });
      toast.success("Variant deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete variant");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {variants.map((v) => (
        <div key={v.id} className="bg-white border border-[var(--color-border)] rounded-[8px] p-4 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm font-semibold">{v.sku}</p>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5 capitalize">
              {v.shape} / {formatCarat(v.carat_weight)} / {v.color}
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="font-semibold">{formatPrice(v.price)}</span>
            <span className={`text-xs px-2 py-0.5 rounded-[4px] ${v.stock_qty === 0 ? "bg-[var(--color-error-light)] text-[var(--color-error)]" : "bg-[var(--color-success-light)] text-[var(--color-success)]"}`}>
              {v.stock_qty === 0 ? "Out of stock" : `${v.stock_qty} in stock`}
            </span>
          </div>
          <Button size="sm" variant="danger" onClick={() => deleteVariant(v.id)}>Delete</Button>
        </div>
      ))}

      {showForm ? (
        <form onSubmit={handleSubmit(onSubmit)} className="border border-[var(--color-border)] rounded-[8px] p-5 bg-[var(--color-surface)]">
          <p className="text-sm font-semibold mb-4">Add Variant</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Input label="SKU" {...register("sku")} error={errors.sku?.message} />
            <Input label="Price (USD)" type="number" step="0.01" {...register("price", { valueAsNumber: true })} error={errors.price?.message} />
            <Input label="Stock Qty" type="number" {...register("stock_qty", { valueAsNumber: true })} error={errors.stock_qty?.message} />
            <Select label="Shape" {...register("shape")} error={errors.shape?.message} options={SHAPES.map(s => ({ value: s, label: s }))} placeholder="Select shape..." />
            <Input label="Carat Weight" type="number" step="0.001" {...register("carat_weight", { valueAsNumber: true })} error={errors.carat_weight?.message} />
            <Input label="Color" {...register("color")} error={errors.color?.message} />
            <Input label="Origin" {...register("origin")} />
            <Select label="Treatment" {...register("treatment")} options={TREATMENTS.map(t => ({ value: t, label: t }))} placeholder="Select..." />
            <Select label="Color Grade" {...register("color_grade")} options={GRADES.map(g => ({ value: g, label: g }))} placeholder="Select..." />
            <Input label="Clarity" {...register("clarity")} />
            <Select label="Cut Grade" {...register("cut_grade")} options={CUT_GRADES.map(g => ({ value: g, label: g }))} placeholder="Select..." />
            <Input label="Length (mm)" type="number" step="0.01" {...register("length_mm", { valueAsNumber: true })} />
            <Input label="Width (mm)" type="number" step="0.01" {...register("width_mm", { valueAsNumber: true })} />
            <Input label="Depth (mm)" type="number" step="0.01" {...register("depth_mm", { valueAsNumber: true })} />
          </div>
          <div className="flex gap-2 mt-4">
            <Button type="submit" size="sm" loading={loading}>Add Variant</Button>
            <Button type="button" variant="secondary" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      ) : (
        <Button variant="secondary" size="sm" onClick={() => setShowForm(true)} className="self-start">
          + Add Variant
        </Button>
      )}
    </div>
  );
}
