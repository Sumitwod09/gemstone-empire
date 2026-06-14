"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, type CheckoutFormData } from "@/lib/validators";
import { Input, Button, Select } from "@/components/ui";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Address } from "@/types";

interface CheckoutFormProps {
  savedAddresses?: Address[];
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void };
  }
}

export function CheckoutForm({ savedAddresses = [] }: CheckoutFormProps) {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");

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

  const shipping = subtotal > 500 ? 0 : 25;
  const total = subtotal + shipping;

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
        }),
      });

      if (!res.ok) throw new Error("Failed to create order");
      const order = await res.json();

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        const rzp = new window.Razorpay({
          key: order.key,
          amount: order.amount,
          currency: order.currency,
          order_id: order.razorpayOrderId,
          name: "Gemstone Empire",
          description: `Order ${order.orderId}`,
          handler: async (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) => {
            const verifyRes = await fetch("/api/orders/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: order.orderId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            if (verifyRes.ok) {
              clearCart();
              router.push(`/order/${order.orderId}`);
            } else {
              toast.error("Payment verification failed. Please contact support.");
              setLoading(false);
            }
          },
          modal: {
            ondismiss: () => setLoading(false),
          },
          prefill: {
            name: data.full_name,
            contact: data.phone,
          },
          theme: { color: "#92400E" },
        });
        rzp.open();
      };
      document.body.appendChild(script);
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-8">
      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Place Order & Pay
        </Button>
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
                {formatPrice(item.variant.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-[var(--color-border)] pt-3 flex flex-col gap-2">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--color-text-secondary)]">Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--color-text-secondary)]">Shipping</span>
            <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold pt-2 border-t border-[var(--color-border)]">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
