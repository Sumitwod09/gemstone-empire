"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { toast } from "sonner";
import type { OrderStatus, PaymentStatus } from "@/types";

const STATUSES: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered", "cancelled", "refunded"];
const PAYMENT_STATUSES: PaymentStatus[] = ["pending", "paid", "refunded", "failed"];

interface OrderStatusUpdaterProps {
  orderId: string;
  currentStatus: OrderStatus;
  currentPaymentStatus: PaymentStatus;
  currentTrackingUrl?: string;
  onUpdate?: () => void;
}

export function OrderStatusUpdater({
  orderId,
  currentStatus,
  currentPaymentStatus,
  currentTrackingUrl = "",
  onUpdate,
}: OrderStatusUpdaterProps) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(currentPaymentStatus);
  const [trackingUrl, setTrackingUrl] = useState<string>(currentTrackingUrl);
  const [loading, setLoading] = useState(false);

  const save = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId,
          status,
          payment_status: paymentStatus,
          tracking_url: trackingUrl || null,
        }),
      });

      if (!res.ok) throw new Error("Failed to update order");
      toast.success("Order updated successfully");
      if (onUpdate) onUpdate();
    } catch (err: any) {
      toast.error(err.message || "Failed to update order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Order Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as OrderStatus)}
            className="w-full border border-gray-200 rounded px-3 py-2 text-xs outline-none focus:border-emerald-400 capitalize bg-white text-gray-800 font-medium"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s} className="capitalize">
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Payment Status</label>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
            className="w-full border border-gray-200 rounded px-3 py-2 text-xs outline-none focus:border-emerald-400 capitalize bg-white text-gray-800 font-medium"
          >
            {PAYMENT_STATUSES.map((p) => (
              <option key={p} value={p} className="capitalize">
                {p}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Tracking URL</label>
          <input
            type="text"
            value={trackingUrl}
            onChange={(e) => setTrackingUrl(e.target.value)}
            placeholder="https://track.dhl.com/..."
            className="w-full border border-gray-200 rounded px-3 py-2 text-xs outline-none focus:border-emerald-400 bg-white"
          />
        </div>
      </div>
      <Button onClick={save} loading={loading} className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto self-end">
        Save Order Changes
      </Button>
    </div>
  );
}
