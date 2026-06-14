import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatPrice, formatDate } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import type { Order } from "@/types";

export const metadata: Metadata = { title: "Order Confirmation" };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderConfirmationPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const query = supabase
    .from("orders")
    .select(`*, items:order_items(*)`)
    .eq("id", id)
    .single();

  const { data: order } = await query;
  if (!order) notFound();

  const typedOrder = order as Order;

  return (
    <div className="max-w-screen-md mx-auto px-6 py-16 text-center">
      <FontAwesomeIcon
        icon={faCircleCheck}
        className="w-16 h-16 text-[var(--color-success)] mx-auto mb-6"
      />
      <h1
        className="text-4xl font-bold text-[var(--color-text-primary)] mb-2"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Order Confirmed
      </h1>
      <p className="text-[var(--color-text-secondary)] mb-8">
        Thank you for your purchase. Your order number is{" "}
        <span className="font-semibold text-[var(--color-text-primary)]">
          {typedOrder.order_number}
        </span>
        .
      </p>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[8px] p-6 text-left mb-8">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold">{typedOrder.order_number}</p>
          <StatusBadge status={typedOrder.status} />
        </div>
        <p className="text-xs text-[var(--color-text-muted)] mb-4">
          Placed on {formatDate(typedOrder.created_at)}
        </p>

        {typedOrder.items && typedOrder.items.length > 0 && (
          <div className="flex flex-col gap-2 mb-4">
            {typedOrder.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-[var(--color-text-secondary)]">
                  {item.product_name} × {item.quantity}
                </span>
                <span className="font-medium">{formatPrice(item.total_price)}</span>
              </div>
            ))}
          </div>
        )}

        <div className="border-t border-[var(--color-border)] pt-3 text-sm font-semibold flex justify-between">
          <span>Total</span>
          <span>{formatPrice(typedOrder.total)}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {user && (
          <Link href="/account/orders">
            <Button variant="secondary">View Order History</Button>
          </Link>
        )}
        <Link href="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}
