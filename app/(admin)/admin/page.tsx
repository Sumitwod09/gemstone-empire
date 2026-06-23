"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { StatsCard } from "@/components/admin/StatsCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faReceipt,
  faClock,
  faGem,
  faArrowTrendUp,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { formatPrice, formatDate } from "@/lib/utils";
import type { AdminStats, Order, GemVariant } from "@/types";

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [lowStock, setLowStock] = useState<(GemVariant & { product?: { name: string } })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, ordersRes, variantsRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/orders?limit=7"),
          fetch("/api/admin/variants"),
        ]);

        if (statsRes.ok) setStats(await statsRes.json());
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setRecentOrders(ordersData.data || []);
        }
        if (variantsRes.ok) {
          const variantsData = await variantsRes.json();
          // Filter to show variants with stock <= 2
          setLowStock((variantsData || []).filter((v: any) => v.stock_qty <= 2).slice(0, 5));
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-xs text-gray-400 mt-0.5">Overview of your store performance</p>
        </div>
        <p className="text-xs text-gray-400">
          Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4 mb-8">
        <StatsCard
          label="Revenue"
          value={loading ? "..." : formatPrice(stats?.total_revenue ?? 0)}
          icon={<FontAwesomeIcon icon={faChartLine} className="w-5 h-5 text-emerald-600" />}
          trend={
            <span className="text-emerald-600 flex items-center gap-1 text-[10px]">
              <FontAwesomeIcon icon={faArrowTrendUp} className="w-2.5 h-2.5" />
              Live DB
            </span>
          }
        />
        <StatsCard
          label="Total Orders"
          value={loading ? "..." : String(stats?.total_orders ?? 0)}
          icon={<FontAwesomeIcon icon={faReceipt} className="w-5 h-5 text-emerald-600" />}
          trend={
            <span className="text-emerald-600 flex items-center gap-1 text-[10px]">
              Active count
            </span>
          }
        />
        <StatsCard
          label="Pending Orders"
          value={loading ? "..." : String(stats?.pending_orders ?? 0)}
          icon={<FontAwesomeIcon icon={faClock} className="w-5 h-5 text-amber-500" />}
          trend={
            <span className="text-amber-600 flex items-center gap-1 text-[10px]">
              Awaiting payment
            </span>
          }
        />
        <StatsCard
          label="Total Customers"
          value={loading ? "..." : String(stats?.total_customers ?? 0)}
          icon={<FontAwesomeIcon icon={faUsers} className="w-5 h-5 text-emerald-600" />}
          trend={
            <span className="text-emerald-600 flex items-center gap-1 text-[10px]">
              Registered users
            </span>
          }
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">
        {/* Recent orders */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 md:px-5 py-4 border-b border-gray-100">
            <p className="text-sm font-bold text-gray-800">Recent Orders</p>
            <Link href="/admin/orders" className="text-xs text-emerald-600 hover:underline font-medium">
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[500px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 md:px-5 py-2.5 text-left text-[10px] text-gray-400 font-bold uppercase tracking-wider">Order</th>
                  <th className="px-4 md:px-5 py-2.5 text-left text-[10px] text-gray-400 font-bold uppercase tracking-wider">Customer</th>
                  <th className="px-4 md:px-5 py-2.5 text-left text-[10px] text-gray-400 font-bold uppercase tracking-wider">Status</th>
                  <th className="px-4 md:px-5 py-2.5 text-right text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-4 md:px-5 py-8 text-center text-gray-400 text-xs">
                      Loading recent orders...
                    </td>
                  </tr>
                ) : recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 md:px-5 py-8 text-center text-gray-400 text-xs">
                      No orders yet
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order, i) => (
                    <tr
                      key={order.id}
                      className={`border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors ${
                        i % 2 === 1 ? "bg-gray-50/30" : ""
                      }`}
                    >
                      <td className="px-4 md:px-5 py-3">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-emerald-700 hover:underline font-semibold text-xs font-mono"
                        >
                          {order.order_number}
                        </Link>
                        <p className="text-[10px] text-gray-400 mt-0.5">{formatDate(order.created_at)}</p>
                      </td>
                      <td className="px-4 md:px-5 py-3 text-gray-600 text-xs">
                        {order.profile?.full_name || order.shipping_address?.full_name || "Guest User"}
                      </td>
                      <td className="px-4 md:px-5 py-3">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-4 md:px-5 py-3 text-right font-bold text-gray-800 text-xs">
                        {formatPrice(order.total)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low stock */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 md:px-5 py-4 border-b border-gray-100">
            <p className="text-sm font-bold text-gray-800">Low Stock Alerts</p>
            <Link href="/admin/inventory" className="text-xs text-emerald-600 hover:underline font-medium">
              Manage →
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {loading ? (
              <div className="px-4 md:px-5 py-8 text-center text-gray-400 text-xs">
                Checking inventory...
              </div>
            ) : lowStock.length === 0 ? (
              <div className="px-4 md:px-5 py-8 text-center text-emerald-600 font-medium text-xs">
                All inventory is fully stocked!
              </div>
            ) : (
              lowStock.map((item) => (
                <div key={item.id} className="px-4 md:px-5 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">
                      {item.product?.name ?? item.sku}
                    </p>
                    <p className="text-[10px] text-gray-400 font-mono">{item.sku}</p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0 ${
                      item.stock_qty === 0
                        ? "bg-red-50 text-red-600 border border-red-100"
                        : "bg-amber-50 text-amber-700 border border-amber-100"
                    }`}
                  >
                    {item.stock_qty === 0 ? "Out of stock" : `${item.stock_qty} left`}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
