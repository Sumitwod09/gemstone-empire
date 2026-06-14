import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui";
import { formatPrice, formatDate } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";

export const metadata: Metadata = { title: "Orders — Admin" };

interface PageProps {
  searchParams: Promise<{ status?: string; page?: string }>;
}

const PAGE_SIZE = 20;
const STATUSES: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled", "refunded"];

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  const page = Math.max(1, parseInt(params.page ?? "1"));
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("orders")
    .select(`*, profile:profiles(full_name)`, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (params.status) query = query.eq("status", params.status);

  const { data: orders, count } = await query;
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-6">Orders</h1>

      {/* Status filter */}
      <div className="flex gap-2 flex-wrap mb-5">
        <Link href="/admin/orders">
          <Button variant={!params.status ? "primary" : "secondary"} size="sm">All</Button>
        </Link>
        {STATUSES.map((s) => (
          <Link key={s} href={`/admin/orders?status=${s}`}>
            <Button variant={params.status === s ? "primary" : "secondary"} size="sm" className="capitalize">
              {s}
            </Button>
          </Link>
        ))}
      </div>

      <div className="bg-white border border-[var(--color-border)] rounded-[8px] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
              <th className="px-4 py-2.5 text-left text-xs text-[var(--color-text-muted)] font-medium">Order</th>
              <th className="px-4 py-2.5 text-left text-xs text-[var(--color-text-muted)] font-medium">Customer</th>
              <th className="px-4 py-2.5 text-left text-xs text-[var(--color-text-muted)] font-medium">Date</th>
              <th className="px-4 py-2.5 text-left text-xs text-[var(--color-text-muted)] font-medium">Status</th>
              <th className="px-4 py-2.5 text-right text-xs text-[var(--color-text-muted)] font-medium">Total</th>
              <th className="px-4 py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order: Order) => (
              <tr key={order.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface-hover)]">
                <td className="px-4 py-2.5">
                  <Link href={`/admin/orders/${order.id}`} className="text-[var(--color-accent)] hover:underline font-medium">
                    {order.order_number}
                  </Link>
                </td>
                <td className="px-4 py-2.5 text-[var(--color-text-secondary)]">
                  {(order.profile as { full_name: string } | null)?.full_name ?? "Guest"}
                </td>
                <td className="px-4 py-2.5 text-[var(--color-text-muted)]">{formatDate(order.created_at)}</td>
                <td className="px-4 py-2.5"><StatusBadge status={order.status} /></td>
                <td className="px-4 py-2.5 text-right font-medium">{formatPrice(order.total)}</td>
                <td className="px-4 py-2.5">
                  <Link href={`/admin/orders/${order.id}`}>
                    <Button size="sm" variant="secondary">View</Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {page > 1 && <Link href={`?${params.status ? `status=${params.status}&` : ""}page=${page - 1}`}><Button variant="secondary" size="sm">Previous</Button></Link>}
          <span className="text-sm text-[var(--color-text-muted)]">Page {page} of {totalPages}</span>
          {page < totalPages && <Link href={`?${params.status ? `status=${params.status}&` : ""}page=${page + 1}`}><Button variant="secondary" size="sm">Next</Button></Link>}
        </div>
      )}
    </div>
  );
}
