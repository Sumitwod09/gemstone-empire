import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import { Price } from "@/components/storefront/Price";
import type { Order } from "@/types";

export const metadata: Metadata = { title: "Order History" };

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

const PAGE_SIZE = 10;

export default async function OrderHistoryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const page = Math.max(1, parseInt(params.page ?? "1"));
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data: orders, count } = await supabase
    .from("orders")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(from, to);

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  return (
    <div className="max-w-screen-md mx-auto px-6 py-10">
      <h1
        className="text-3xl font-bold text-[var(--color-text-primary)] mb-8"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Order History
      </h1>

      {orders && orders.length > 0 ? (
        <div className="flex flex-col gap-3">
          {(orders as Order[]).map((order) => (
            <div
              key={order.id}
              className="bg-white border border-[var(--color-border)] rounded-[8px] p-4 flex items-center justify-between gap-4 flex-wrap"
            >
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                  {order.order_number}
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {formatDate(order.created_at)}
                </p>
              </div>
              <StatusBadge status={order.status} />
              <p className="text-sm font-semibold"><Price amount={order.total} /></p>
              <Link href={`/order/${order.id}`}>
                <Button variant="secondary" size="sm">View</Button>
              </Link>
            </div>
          ))}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              {page > 1 && (
                <Link href={`?page=${page - 1}`}>
                  <Button variant="secondary" size="sm">Previous</Button>
                </Link>
              )}
              <span className="text-sm text-[var(--color-text-muted)]">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <Link href={`?page=${page + 1}`}>
                  <Button variant="secondary" size="sm">Next</Button>
                </Link>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="py-16 text-center text-[var(--color-text-muted)]">
          <p className="text-lg font-medium mb-2">No orders yet</p>
          <p className="text-sm mb-6">Your purchase history will appear here.</p>
          <Link href="/products">
            <Button>Browse Gems</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
