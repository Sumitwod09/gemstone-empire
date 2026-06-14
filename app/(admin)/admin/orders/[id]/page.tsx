import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { OrderStatusUpdater } from "./OrderStatusUpdater";
import { formatPrice, formatDate } from "@/lib/utils";
import type { Order } from "@/types";

export const metadata: Metadata = { title: "Order Detail — Admin" };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select(`*, items:order_items(*), profile:profiles(full_name, phone)`)
    .eq("id", id)
    .single();

  if (!order) notFound();
  const typedOrder = order as Order;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">{typedOrder.order_number}</h1>
        <StatusBadge status={typedOrder.status} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-[var(--color-border)] rounded-[8px] p-4">
          <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] mb-2">Customer</p>
          <p className="text-sm font-medium">{(typedOrder.profile as { full_name: string; phone?: string } | null)?.full_name ?? "Guest"}</p>
          {(typedOrder.profile as { full_name: string; phone?: string } | null)?.phone && (
            <p className="text-xs text-[var(--color-text-secondary)]">{(typedOrder.profile as { phone?: string } | null)?.phone}</p>
          )}
        </div>
        <div className="bg-white border border-[var(--color-border)] rounded-[8px] p-4">
          <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] mb-2">Shipping Address</p>
          <p className="text-sm">{typedOrder.shipping_address.full_name}</p>
          <p className="text-xs text-[var(--color-text-secondary)]">{typedOrder.shipping_address.line1}</p>
          <p className="text-xs text-[var(--color-text-secondary)]">
            {typedOrder.shipping_address.city}, {typedOrder.shipping_address.state} {typedOrder.shipping_address.zip}
          </p>
        </div>
      </div>

      <div className="bg-white border border-[var(--color-border)] rounded-[8px] p-4 mb-6">
        <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] mb-3">Order Items</p>
        {typedOrder.items?.map((item) => (
          <div key={item.id} className="flex justify-between text-sm py-2 border-b border-[var(--color-border)] last:border-0">
            <span className="text-[var(--color-text-secondary)]">{item.product_name} × {item.quantity}</span>
            <span className="font-medium">{formatPrice(item.total_price)}</span>
          </div>
        ))}
        <div className="flex justify-between font-semibold pt-2 mt-1">
          <span>Total</span>
          <span>{formatPrice(typedOrder.total)}</span>
        </div>
      </div>

      <div className="bg-white border border-[var(--color-border)] rounded-[8px] p-4">
        <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] mb-3">Update Status</p>
        <OrderStatusUpdater orderId={id} currentStatus={typedOrder.status} />
      </div>
    </div>
  );
}
