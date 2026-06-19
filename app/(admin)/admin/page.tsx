import type { Metadata } from "next";
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
  faArrowTrendDown,
} from "@fortawesome/free-solid-svg-icons";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin Dashboard — Gemstone Empire" };

const MOCK_RECENT_ORDERS = [
  { id: "ord-1", order_number: "GE-2026-001", customer: "James Richardson", date: "2026-06-18", status: "delivered", total: 4200 },
  { id: "ord-2", order_number: "GE-2026-002", customer: "Sarah Chen", date: "2026-06-17", status: "shipped", total: 3800 },
  { id: "ord-3", order_number: "GE-2026-003", customer: "Marco Bellini", date: "2026-06-16", status: "processing", total: 8500 },
  { id: "ord-4", order_number: "GE-2026-004", customer: "Emma Thompson", date: "2026-06-15", status: "pending", total: 2900 },
  { id: "ord-5", order_number: "GE-2026-005", customer: "David Park", date: "2026-06-14", status: "delivered", total: 1800 },
  { id: "ord-6", order_number: "GE-2026-006", customer: "Lisa Müller", date: "2026-06-13", status: "delivered", total: 6200 },
  { id: "ord-7", order_number: "GE-2026-007", customer: "Hiroshi Tanaka", date: "2026-06-12", status: "cancelled", total: 18500 },
];

const MOCK_LOW_STOCK = [
  { id: "ls-1", product: "Kashmir Sapphire 1.05ct", sku: "SAP-OV-105K", stock: 1 },
  { id: "ls-2", product: "Brazilian Alexandrite 0.95ct", sku: "ALX-RD-095", stock: 1 },
  { id: "ls-3", product: "Emerald Cut Diamond 2.33ct", sku: "DIA-EM-233", stock: 1 },
  { id: "ls-4", product: "Round Brilliant Diamond 1.52ct", sku: "DIA-RD-152", stock: 0 },
];

export default function AdminDashboard() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-xs text-gray-400 mt-0.5">Overview of your store performance</p>
        </div>
        <p className="text-xs text-gray-400">Last updated: June 19, 2026</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4 mb-8">
        <StatsCard
          label="Revenue (this month)"
          value={formatPrice(47800)}
          icon={<FontAwesomeIcon icon={faChartLine} className="w-5 h-5" />}
          trend={
            <span className="text-emerald-600 flex items-center gap-1">
              <FontAwesomeIcon icon={faArrowTrendUp} className="w-3 h-3" />
              +12.5%
            </span>
          }
        />
        <StatsCard
          label="Total Orders"
          value="142"
          icon={<FontAwesomeIcon icon={faReceipt} className="w-5 h-5" />}
          trend={
            <span className="text-emerald-600 flex items-center gap-1">
              <FontAwesomeIcon icon={faArrowTrendUp} className="w-3 h-3" />
              +8.3%
            </span>
          }
        />
        <StatsCard
          label="Pending Orders"
          value="7"
          icon={<FontAwesomeIcon icon={faClock} className="w-5 h-5" />}
          trend={
            <span className="text-red-500 flex items-center gap-1">
              <FontAwesomeIcon icon={faArrowTrendDown} className="w-3 h-3" />
              -2
            </span>
          }
        />
        <StatsCard
          label="Active Products"
          value="18"
          icon={<FontAwesomeIcon icon={faGem} className="w-5 h-5" />}
          trend={
            <span className="text-emerald-600 flex items-center gap-1">
              <FontAwesomeIcon icon={faArrowTrendUp} className="w-3 h-3" />
              +6 new
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
                {MOCK_RECENT_ORDERS.map((order, i) => (
                  <tr key={order.id} className={`border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors ${i % 2 === 1 ? "bg-gray-50/30" : ""}`}>
                    <td className="px-4 md:px-5 py-3">
                      <Link href={`/admin/orders/${order.id}`} className="text-emerald-700 hover:underline font-semibold text-xs">
                        {order.order_number}
                      </Link>
                      <p className="text-[10px] text-gray-400 mt-0.5">{order.date}</p>
                    </td>
                    <td className="px-4 md:px-5 py-3 text-gray-600 text-xs">{order.customer}</td>
                    <td className="px-4 md:px-5 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 md:px-5 py-3 text-right font-bold text-gray-800 text-xs">
                      {formatPrice(order.total)}
                    </td>
                  </tr>
                ))}
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
            {MOCK_LOW_STOCK.map((item) => (
              <div key={item.id} className="px-4 md:px-5 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">{item.product}</p>
                  <p className="text-[10px] text-gray-400 font-mono">{item.sku}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0 ${
                  item.stock === 0
                    ? "bg-red-50 text-red-600 border border-red-100"
                    : "bg-amber-50 text-amber-700 border border-amber-100"
                }`}>
                  {item.stock === 0 ? "Out of stock" : `${item.stock} left`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
