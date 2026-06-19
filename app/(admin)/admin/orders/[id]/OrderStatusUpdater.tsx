"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { toast } from "sonner";
import type { OrderStatus } from "@/types";

const STATUSES: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled", "refunded"];

interface OrderStatusUpdaterProps {
  orderId: string;
  currentStatus: OrderStatus;
  onUpdate?: (status: OrderStatus) => void;
}

export function OrderStatusUpdater({ orderId, currentStatus, onUpdate }: OrderStatusUpdaterProps) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [loading, setLoading] = useState(false);

  const save = async () => {
    setLoading(true);
    // Simulate server latency
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (onUpdate) onUpdate(status);
    toast.success("Order status updated (Local Mock Mode)");
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-3">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as OrderStatus)}
        className="border border-gray-200 rounded px-3 py-1.5 text-xs outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100 transition-all capitalize bg-white text-gray-800 font-medium"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s} className="capitalize">{s}</option>
        ))}
      </select>
      <Button size="sm" onClick={save} loading={loading} className="bg-emerald-600 hover:bg-emerald-700">
        Update Status
      </Button>
    </div>
  );
}
