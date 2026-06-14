import { Badge } from "@/components/ui";
import type { OrderStatus, PaymentStatus } from "@/types";

interface StatusBadgeProps {
  status: OrderStatus | PaymentStatus | string;
}

const statusMap: Record<string, "default" | "accent" | "success" | "warning" | "error"> = {
  pending: "warning",
  processing: "accent",
  shipped: "accent",
  delivered: "success",
  cancelled: "error",
  refunded: "error",
  paid: "success",
  failed: "error",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const variant = statusMap[status] ?? "default";
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return <Badge variant={variant}>{label}</Badge>;
}
