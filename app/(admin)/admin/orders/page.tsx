import type { Metadata } from "next";
import Link from "next/link";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Orders — Admin" };

const MOCK_ORDERS = [
  { id: "ord-1", order_number: "GE-2026-001", customer: "James Richardson", email: "james@example.com", date: "2026-06-18", status: "delivered", payment: "paid", total: 4200 },
  { id: "ord-2", order_number: "GE-2026-002", customer: "Sarah Chen", email: "sarah@example.com", date: "2026-06-17", status: "shipped", payment: "paid", total: 3800 },
  { id: "ord-3", order_number: "GE-2026-003", customer: "Marco Bellini", email: "marco@example.com", date: "2026-06-16", status: "processing", payment: "paid", total: 8500 },
  { id: "ord-4", order_number: "GE-2026-004", customer: "Emma Thompson", email: "emma@example.com", date: "2026-06-15", status: "pending", payment: "pending", total: 2900 },
  { id: "ord-5", order_number: "GE-2026-005", customer: "David Park", email: "david@example.com", date: "2026-06-14", status: "delivered", payment: "paid", total: 1800 },
  { id: "ord-6", order_number: "GE-2026-006", customer: "Lisa Müller", email: "lisa@example.com", date: "2026-06-13", status: "delivered", payment: "paid", total: 6200 },
  { id: "ord-7", order_number: "GE-2026-007", customer: "Hiroshi Tanaka", email: "hiroshi@example.com", date: "2026-06-12", status: "cancelled", payment: "refunded", total: 18500 },
  { id: "ord-8", order_number: "GE-2026-008", customer: "Katarina Petrova", email: "katarina@example.com", date: "2026-06-11", status: "shipped", payment: "paid", total: 9800 },
  { id: "ord-9", order_number: "GE-2026-009", customer: "Arthur Pendelton", email: "arthur@example.com", date: "2026-06-10", status: "processing", payment: "paid", total: 22800 },
  { id: "ord-10", order_number: "GE-2026-010", customer: "Guest Buyer", email: "guest@example.com", date: "2026-06-09", status: "pending", payment: "pending", total: 7200 },
];

const STATUSES = ["all", "pending", "processing", "shipped", "delivered", "cancelled", "refunded"] as const;

export default function AdminOrdersPage() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-xs text-gray-400 mt-0.5">{MOCK_ORDERS.length} total orders</p>
        </div>
      </div>

      {/* Status filter pills */}
      <div className="flex gap-2 flex-wrap mb-5">
        {STATUSES.map((s) => (
          <button
            key={s}
            className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
              s === "all"
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
              {MOCK_ORDERS.map((order, i) => (
                <tr key={order.id} className={`border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors ${i % 2 === 1 ? "bg-gray-50/30" : ""}`}>
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="text-emerald-700 hover:underline font-semibold text-xs">
                      {order.order_number}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs font-medium text-gray-800">{order.customer}</p>
                    <p className="text-[10px] text-gray-400">{order.email}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">{order.date}</td>
                  <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                  <td className="px-4 py-3"><StatusBadge status={order.payment} /></td>
                  <td className="px-4 py-3 text-right font-bold text-gray-800 text-xs">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${order.id}`}>
                      <button className="text-xs text-emerald-600 hover:text-emerald-800 font-semibold hover:underline">
                        View
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
