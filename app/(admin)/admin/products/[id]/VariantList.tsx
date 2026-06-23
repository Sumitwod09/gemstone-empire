"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { variantSchema, type VariantFormData } from "@/lib/validators";
import { Input, Button, Select } from "@/components/ui";
import { toast } from "sonner";
import { formatPrice, formatCarat } from "@/lib/utils";
import type { GemVariant } from "@/types";

const SHAPES = ["oval", "round", "cushion", "pear", "marquise", "emerald", "heart", "trillion", "octagon"];
const GRADES = ["AAA", "AA", "A", "B"];
const CUT_GRADES = ["excellent", "very good", "good", "fair"];
const TREATMENTS = ["heat", "unheated", "beryllium", "none"];

interface VariantListProps {
  productId: string;
  variants: GemVariant[];
  onAddVariant?: (variant: GemVariant) => void;
  onDeleteVariant?: (variantId: string) => void;
}

export function VariantList({ productId, variants, onAddVariant, onDeleteVariant }: VariantListProps) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<VariantFormData>({
    resolver: zodResolver(variantSchema),
    defaultValues: { stock_qty: 1, is_active: true },
  });

  const onSubmit = async (data: VariantFormData) => {
    setLoading(true);

    try {
      const res = await fetch("/api/admin/variants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          sku: data.sku,
          price: data.price,
          stock_qty: data.stock_qty,
          shape: data.shape,
          carat_weight: data.carat_weight,
          color: data.color,
          color_grade: data.color_grade ?? "AAA",
          clarity: data.clarity ?? "Eye-clean",
          treatment: data.treatment ?? "none",
          origin: data.origin ?? "Unknown",
          cut_grade: data.cut_grade ?? "excellent",
          length_mm: data.length_mm ?? null,
          width_mm: data.width_mm ?? null,
          depth_mm: data.depth_mm ?? null,
          is_active: true,
        }),
      });

      if (!res.ok) throw new Error("Failed to add variant");
      const created = await res.json();

      if (onAddVariant) onAddVariant(created);
      toast.success("Variant added successfully");
      reset();
      setShowForm(false);
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const deleteVariant = async (id: string) => {
    if (!confirm("Are you sure you want to delete this variant?")) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/variants", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete variant");
      if (onDeleteVariant) onDeleteVariant(id);
      toast.success("Variant deleted");
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {variants.map((v) => (
        <div key={v.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between gap-4 flex-wrap hover:shadow-sm transition-shadow">
          <div>
            <p className="text-xs font-mono font-bold text-gray-700">{v.sku}</p>
            <p className="text-xs text-gray-500 mt-0.5 capitalize">
              {v.shape} / {formatCarat(v.carat_weight)} ct / {v.color}
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="font-extrabold text-gray-900">{formatPrice(Number(v.price))}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              v.stock_qty === 0 
                ? "bg-red-50 text-red-700 border border-red-100" 
                : "bg-emerald-50 text-emerald-700 border border-emerald-100"
            }`}>
              {v.stock_qty === 0 ? "Out of stock" : `${v.stock_qty} in stock`}
            </span>
            <Button size="sm" variant="danger" className="bg-red-50 text-red-600 hover:bg-red-100 border-none" onClick={() => deleteVariant(v.id)}>Delete</Button>
          </div>
        </div>
      ))}

      {showForm ? (
        <form onSubmit={handleSubmit(onSubmit)} className="border border-gray-200 rounded-lg p-5 bg-gray-50/50">
          <p className="text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-4">Add Variant Detail</p>
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
          <div className="flex gap-2 mt-5 justify-end">
            <Button type="button" variant="secondary" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit" size="sm" loading={loading} className="bg-emerald-600 hover:bg-emerald-700">Add Variant</Button>
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
