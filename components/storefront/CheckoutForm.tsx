"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, type CheckoutFormData } from "@/lib/validators";
import { Input, Button, Select } from "@/components/ui";
import { useCart } from "@/hooks/useCart";
import { Price } from "@/components/storefront/Price";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { calculateShipping } from "@/lib/utils";
import type { Address } from "@/types";

interface CheckoutFormProps {
  savedAddresses?: Address[];
}

export function CheckoutForm({ savedAddresses = [] }: CheckoutFormProps) {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const applyAddress = (id: string) => {
    setSelectedAddressId(id);
    const addr = savedAddresses.find((a) => a.id === id);
    if (!addr) return;
    setValue("full_name", addr.full_name);
    setValue("phone", addr.phone ?? "");
    setValue("line1", addr.line1);
    setValue("line2", addr.line2 ?? "");
    setValue("city", addr.city);
    setValue("state", addr.state);
    setValue("country", addr.country);
    setValue("zip", addr.zip);
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, subtotal }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setDiscount(data.discount_amount);
        setAppliedCoupon(data.code);
        toast.success(`Coupon applied! You save $${data.discount_amount.toFixed(2)}`);
      } else {
        toast.error(data.error || "Invalid coupon code");
        setDiscount(0);
        setAppliedCoupon(null);
      }
    } catch {
      toast.error("Failed to validate coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const discountedSubtotal = subtotal - discount;
  const shipping = calculateShipping(discountedSubtotal);
  const total = discountedSubtotal + shipping;

  const onSubmit = async (data: CheckoutFormData) => {
    if (!items.length) return;
    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            variantId: i.variantId,
            quantity: i.quantity,
          })),
          shippingAddress: data,
          coupon_code: appliedCoupon,
          guest_email: !user ? data.email : undefined,
        }),
      });

      if (!res.ok) throw new Error("Failed to create order");
      const order = await res.json();

      clearCart();
      router.push(`/order/${order.orderId}`);
    } catch {
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-8">
      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Guest Email */}
        {!user && (
          <div>
            <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-4">
              Contact Information
            </h2>
            <Input
              label="Email Address"
              type="email"
              {...register("email")}
              error={errors.email?.message}
              placeholder="your@email.com"
            />
            <p className="text-xs text-gray-400 mt-1">
              Order confirmation and updates will be sent to this email.
            </p>
          </div>
        )}

        <div>
          <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-4">
            Shipping Address
          </h2>

          {savedAddresses.length > 0 && (
            <div className="mb-4">
              <Select
                label="Use saved address"
                value={selectedAddressId}
                onChange={(e) => applyAddress(e.target.value)}
                options={savedAddresses.map((a) => ({
                  value: a.id,
                  label: `${a.label} — ${a.line1}, ${a.city}`,
                }))}
                placeholder="Select a saved address..."
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Full Name"
                {...register("full_name")}
                error={errors.full_name?.message}
              />
            </div>
            <div className="sm:col-span-2">
              <Input
                label="Phone"
                type="tel"
                {...register("phone")}
                error={errors.phone?.message}
              />
            </div>
            <div className="sm:col-span-2">
              <Input
                label="Address Line 1"
                {...register("line1")}
                error={errors.line1?.message}
              />
            </div>
            <div className="sm:col-span-2">
              <Input
                label="Address Line 2 (optional)"
                {...register("line2")}
              />
            </div>
            <Input
              label="City"
              {...register("city")}
              error={errors.city?.message}
            />
            <Input
              label="State"
              {...register("state")}
              error={errors.state?.message}
            />
            <Input
              label="ZIP Code"
              {...register("zip")}
              error={errors.zip?.message}
            />
            <Input
              label="Country"
              {...register("country")}
              error={errors.country?.message}
            />
          </div>
        </div>

        <div>
          <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-3">
            Order Notes (optional)
          </h2>
          <textarea
            {...register("notes")}
            placeholder="Any special instructions..."
            className="w-full px-3 py-2 border border-[var(--color-border)] rounded-[6px] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none h-20"
          />
        </div>

        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Place Order
        </Button>
        <p className="text-xs text-center text-gray-400">
          Your order will be confirmed after payment is received via bank transfer or UPI.
        </p>
      </form>

      {/* Order Summary */}
      <aside className="bg-[var(--color-surface)] rounded-[8px] border border-[var(--color-border)] p-5 h-fit sticky top-20">
        <h2 className="text-base font-semibold mb-4">Order Summary</h2>
        <div className="flex flex-col gap-3 mb-4">
          {items.map((item) => (
            <div key={item.variantId} className="flex justify-between text-sm">
              <span className="text-[var(--color-text-secondary)]">
                {item.variant.product?.name ?? item.variant.sku} × {item.quantity}
              </span>
              <span className="font-medium">
                <Price amount={item.variant.price * item.quantity} />
              </span>
            </div>
          ))}
        </div>

        {/* Coupon */}
        <div className="border-t border-[var(--color-border)] pt-3 mb-3">
          <label className="text-xs font-medium text-gray-600 mb-1.5 block">Coupon Code</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="WELCOME10"
              disabled={!!appliedCoupon}
              className="flex-1 px-3 py-2 border border-[var(--color-border)] rounded-[6px] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase"
            />
            {appliedCoupon ? (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  setAppliedCoupon(null);
                  setDiscount(0);
                  setCouponCode("");
                }}
              >
                Remove
              </Button>
            ) : (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={applyCoupon}
                loading={couponLoading}
              >
                Apply
              </Button>
            )}
          </div>
        </div>

        <div className="border-t border-[var(--color-border)] pt-3 flex flex-col gap-2">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--color-text-secondary)]">Subtotal</span>
            <span><Price amount={subtotal} /></span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-emerald-600">
              <span>Discount ({appliedCoupon})</span>
              <span>-<Price amount={discount} /></span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-[var(--color-text-secondary)]">Shipping</span>
            <span>{shipping === 0 ? <span className="text-emerald-600 font-medium">Free</span> : <Price amount={shipping} />}</span>
          </div>
          {shipping > 0 && (
            <p className="text-[10px] text-gray-400">Free shipping on orders over $1,000</p>
          )}
          <div className="flex justify-between text-base font-semibold pt-2 border-t border-[var(--color-border)]">
            <span>Total</span>
            <span><Price amount={total} /></span>
          </div>
        </div>
      </aside>
    </div>
  );
}
