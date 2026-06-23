"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatPrice, formatDate } from "@/lib/utils";
import type { Order } from "@/types";

const STATUSES = ["all", "pending", "confirmed", "shipped", "delivered", "cancelled", "refunded"] as const;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      try {
        const url = selectedStatus === "all" ? "/api/admin/orders" : `/api/admin/orders?status=${selectedStatus}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setOrders(data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [selectedStatus]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {loading ? "Loading..." : `${orders.length} total orders`}
          </p>
        </div>
      </div>

      {/* Status filter pills */}
      <div className="flex gap-2 flex-wrap mb-5">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setSelectedStatus(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
              selectedStatus === s
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-white text-gray-500 border border-gray-200 hover:border-emerald-300 hover:text-emerald-700"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Orders table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[650px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-2.5 text-left text-[10px] text-gray-400 font-bold uppercase tracking-wider">Order</th>
                <th className="px-4 py-2.5 text-left text-[10px] text-gray-400 font-bold uppercase tracking-wider">Customer</th>
                <th className="px-4 py-2.5 text-left text-[10px] text-gray-400 font-bold uppercase tracking-wider">Date</th>
                <th className="px-4 py-2.5 text-left text-[10px] text-gray-400 font-bold uppercase tracking-wider">Status</th>
                <th className="px-4 py-2.5 text-left text-[10px] text-gray-400 font-bold uppercase tracking-wider">Payment</th>
                <th className="px-4 py-2.5 text-right text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400 text-xs">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400 text-xs">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order, i) => (
                  <tr
                    key={order.id}
                    className={`border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors ${
                      i % 2 === 1 ? "bg-gray-50/30" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <Link href={`/admin/orders/${order.id}`} className="text-emerald-700 hover:underline font-semibold text-xs font-mono">
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs font-medium text-gray-800">
                        {order.profile?.full_name || order.shipping_address?.full_name || "Guest"}
                      </p>
                      <p className="text-[10px] text-gray-400">{order.guest_email || order.profile?.email || "—"}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">{formatDate(order.created_at)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.payment_status} />
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-gray-800 text-xs">
                      {formatPrice(Number(order.total))}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/orders/${order.id}`}>
                        <button className="text-xs text-emerald-600 hover:text-emerald-800 font-semibold hover:underline">
                          View
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
