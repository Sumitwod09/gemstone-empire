"use client";

import { use, useState, useEffect } from "react";
import { notFound, useRouter } from "next/navigation";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { OrderStatusUpdater } from "./OrderStatusUpdater";
import { formatPrice, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import type { Order } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadOrder() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders?limit=100");
      if (res.ok) {
        const result = await res.json();
        const found = (result.data || []).find((o: Order) => o.id === id);
        if (found) {
          setOrder(found);
        } else {
          toast.error("Order not found");
          router.push("/admin/orders");
        }
      }
    } catch (err) {
      console.error("Failed to load order detail", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrder();
  }, [id]);

  if (loading) {
    return <div className="text-gray-400 text-xs py-8 text-center">Loading order details...</div>;
  }

  if (!order) {
    return <div className="text-gray-400 text-xs py-8 text-center">Order not found</div>;
  }

  const addr = (order.shipping_address || {}) as any;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 font-mono">{order.order_number}</h1>
          <p className="text-xs text-gray-400 mt-0.5">Order placed on {formatDate(order.created_at)}</p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          <StatusBadge status={order.status} />
          <StatusBadge status={order.payment_status} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-2">Customer Info</p>
          <p className="text-xs font-semibold text-gray-800">
            {order.profile?.full_name || addr.full_name || "Guest User"}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {order.guest_email || order.profile?.email || "No email"}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-2">Shipping Address</p>
          <p className="text-xs font-semibold text-gray-800">{addr.full_name}</p>
          <p className="text-xs text-gray-500 mt-0.5">{addr.line1}</p>
          {addr.line2 && <p className="text-xs text-gray-500">{addr.line2}</p>}
          <p className="text-xs text-gray-500">
            {addr.city}, {addr.state} {addr.zip}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{addr.country}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
        <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-3">Order Items</p>
        <div className="divide-y divide-gray-100">
          {(order.items || []).map((item: any) => (
            <div key={item.id} className="flex justify-between text-xs py-2.5">
              <div>
                <span className="text-gray-600 font-medium">{item.product_name}</span>
                <span className="text-[10px] font-mono text-gray-400 block mt-0.5">SKU: {item.variant_sku}</span>
              </div>
              <span className="font-bold text-gray-800">
                {formatPrice(Number(item.total_price))} ({item.quantity}x)
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-500">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(Number(order.subtotal))}</span></div>
          {Number(order.discount_amount) > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>Discount ({order.coupon_code || "Coupon"})</span>
              <span>-{formatPrice(Number(order.discount_amount))}</span>
            </div>
          )}
          <div className="flex justify-between"><span>Shipping</span><span>{Number(order.shipping_cost) === 0 ? "Free" : formatPrice(Number(order.shipping_cost))}</span></div>
          <div className="flex justify-between font-extrabold text-sm pt-2 border-t border-gray-100 text-gray-900">
            <span>Grand Total</span>
            <span>{formatPrice(Number(order.total))}</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-3">Update Order Status</p>
        <OrderStatusUpdater
          orderId={order.id}
          currentStatus={order.status}
          currentPaymentStatus={order.payment_status}
          currentTrackingUrl={order.tracking_url ?? ""}
          onUpdate={loadOrder}
        />
      </div>
    </div>
  );
}
