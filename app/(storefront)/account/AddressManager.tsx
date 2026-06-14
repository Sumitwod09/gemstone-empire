"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, type AddressFormData } from "@/lib/validators";
import { Input, Button, Select } from "@/components/ui";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Address } from "@/types";

interface AddressManagerProps {
  addresses: Address[];
  userId: string;
}

export function AddressManager({ addresses, userId }: AddressManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: { country: "United States", label: "home" },
  });

  const onSubmit = async (data: AddressFormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/account/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast.success("Address saved");
      reset();
      setShowForm(false);
      router.refresh();
    } catch {
      toast.error("Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (id: string) => {
    try {
      const res = await fetch(`/api/account/addresses/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Address removed");
      router.refresh();
    } catch {
      toast.error("Failed to remove address");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {addresses.map((addr) => (
        <div
          key={addr.id}
          className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[8px] p-4 flex justify-between items-start gap-4"
        >
          <div>
            <p className="text-sm font-semibold capitalize">
              {addr.label}
              {addr.is_default && (
                <span className="ml-2 text-[10px] bg-[var(--color-accent-light)] text-[var(--color-accent)] px-1.5 py-0.5 rounded-[4px] font-medium">
                  Default
                </span>
              )}
            </p>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
              {addr.full_name}
            </p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}, {addr.city}, {addr.state} {addr.zip}
            </p>
          </div>
          <button
            onClick={() => deleteAddress(addr.id)}
            className="text-xs text-[var(--color-error)] hover:underline flex-shrink-0"
          >
            Remove
          </button>
        </div>
      ))}

      {showForm ? (
        <form onSubmit={handleSubmit(onSubmit)} className="border border-[var(--color-border)] rounded-[8px] p-5 flex flex-col gap-4">
          <h3 className="text-sm font-semibold">New Address</h3>
          <Select
            label="Label"
            {...register("label")}
            options={[
              { value: "home", label: "Home" },
              { value: "office", label: "Office" },
              { value: "other", label: "Other" },
            ]}
            error={errors.label?.message}
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Input label="Full Name" {...register("full_name")} error={errors.full_name?.message} />
            </div>
            <div className="col-span-2">
              <Input label="Phone (optional)" type="tel" {...register("phone")} />
            </div>
            <div className="col-span-2">
              <Input label="Address Line 1" {...register("line1")} error={errors.line1?.message} />
            </div>
            <div className="col-span-2">
              <Input label="Address Line 2 (optional)" {...register("line2")} />
            </div>
            <Input label="City" {...register("city")} error={errors.city?.message} />
            <Input label="State" {...register("state")} error={errors.state?.message} />
            <Input label="ZIP" {...register("zip")} error={errors.zip?.message} />
            <Input label="Country" {...register("country")} error={errors.country?.message} />
          </div>
          <div className="flex gap-2">
            <Button type="submit" loading={loading} size="sm">Save Address</Button>
            <Button type="button" variant="secondary" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      ) : (
        <Button variant="secondary" size="sm" onClick={() => setShowForm(true)} className="self-start">
          + Add New Address
        </Button>
      )}
    </div>
  );
}
