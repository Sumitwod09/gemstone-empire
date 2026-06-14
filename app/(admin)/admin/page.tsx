import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { StatsCard } from "@/components/admin/StatsCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faReceipt,
  faClock,
  faGem,
} from "@fortawesome/free-solid-svg-icons";
import { formatPrice, formatDate } from "@/lib/utils";
import type { Order } from "@/types";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default async function AdminDashboard() {
  const supabase = await createClient();

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    { data: revenueData },
    { count: totalOrders },
    { count: pendingOrders },
    { count: totalProducts },
    { data: recentOrders },
    { data: lowStock },
  ] = await Promise.all([
    supabase
      .from("orders")
      .select("total")
      .eq("payment_status", "paid")
      .gte("created_at", startOfMonth.toISOString()),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
    supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("gem_variants")
      .select(`*, product:products(name)`)
      .lt("stock_qty", 3)
      .eq("is_active", true)
      .limit(5),
  ]);

  const monthRevenue =
    revenueData?.reduce((sum, o) => sum + Number(o.total), 0) ?? 0;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-6">
        Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatsCard
          label="Revenue (this month)"
          value={formatPrice(monthRevenue)}
          icon={<FontAwesomeIcon icon={faChartLine} className="w-6 h-6" />}
        />
        <StatsCard
          label="Total Orders"
          value={totalOrders ?? 0}
          icon={<FontAwesomeIcon icon={faReceipt} className="w-6 h-6" />}
        />
        <StatsCard
          label="Pending Orders"
          value={pendingOrders ?? 0}
          icon={<FontAwesomeIcon icon={faClock} className="w-6 h-6" />}
        />
        <StatsCard
          label="Active Products"
          value={totalProducts ?? 0}
          icon={<FontAwesomeIcon icon={faGem} className="w-6 h-6" />}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        {/* Recent orders */}
        <div className="bg-white border border-[var(--color-border)] rounded-[8px]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
            <p className="text-sm font-semibold">Recent Orders</p>
            <Link href="/admin/orders" className="text-xs text-[var(--color-accent)] hover:underline">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
                  <th className="px-5 py-2.5 text-left text-xs text-[var(--color-text-muted)] font-medium">Order</th>
                  <th className="px-5 py-2.5 text-left text-xs text-[var(--color-text-muted)] font-medium">Date</th>
                  <th className="px-5 py-2.5 text-left text-xs text-[var(--color-text-muted)] font-medium">Status</th>
                  <th className="px-5 py-2.5 text-right text-xs text-[var(--color-text-muted)] font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders?.map((order: Order) => (
                  <tr key={order.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface-hover)]">
                    <td className="px-5 py-2.5">
                      <Link href={`/admin/orders/${order.id}`} className="text-[var(--color-accent)] hover:underline font-medium">
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="px-5 py-2.5 text-[var(--color-text-muted)]">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-5 py-2.5">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-5 py-2.5 text-right font-medium">
                      {formatPrice(order.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low stock */}
        <div className="bg-white border border-[var(--color-border)] rounded-[8px]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
            <p className="text-sm font-semibold">Low Stock Alerts</p>
            <Link href="/admin/inventory" className="text-xs text-[var(--color-accent)] hover:underline">
              Manage
            </Link>
          </div>
          <div className="divide-y divide-[var(--color-border)]">
            {lowStock?.map((variant) => (
              <div key={variant.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium">{(variant as { product?: { name: string } }).product?.name}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{variant.sku}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-[4px] ${variant.stock_qty === 0 ? "bg-[var(--color-error-light)] text-[var(--color-error)]" : "bg-[var(--color-warning-light)] text-[var(--color-warning)]"}`}>
                  {variant.stock_qty === 0 ? "Out of stock" : `${variant.stock_qty} left`}
                </span>
              </div>
            ))}
            {(!lowStock || lowStock.length === 0) && (
              <p className="px-5 py-4 text-sm text-[var(--color-text-muted)]">No low stock alerts.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
