import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui";

export const metadata: Metadata = { title: "Customers — Admin" };

const MOCK_CUSTOMERS = [
  { id: "cust-1", full_name: "James Richardson", email: "james@example.com", phone: "+1 (555) 019-2834", joined: "2026-05-12", total_orders: 5 },
  { id: "cust-2", full_name: "Sarah Chen", email: "sarah.c@example.com", phone: "+86 186 1234 5678", joined: "2026-05-18", total_orders: 3 },
  { id: "cust-3", full_name: "Marco Bellini", email: "marco@bellini.it", phone: "+39 02 1234567", joined: "2026-05-24", total_orders: 8 },
  { id: "cust-4", full_name: "Emma Thompson", email: "emma.t@example.co.uk", phone: "+44 7700 900077", joined: "2026-06-01", total_orders: 2 },
  { id: "cust-5", full_name: "David Park", email: "david.park@example.com", phone: "+82 10 1234 5678", joined: "2026-06-05", total_orders: 1 },
  { id: "cust-6", full_name: "Lisa Müller", email: "lisa.m@example.de", phone: "+49 170 1234567", joined: "2026-06-10", total_orders: 4 },
  { id: "cust-7", full_name: "Hiroshi Tanaka", email: "hiroshi.t@example.jp", phone: "+81 90 1234 5678", joined: "2026-06-12", total_orders: 12 },
  { id: "cust-8", full_name: "Katarina Petrova", email: "katarina.p@example.com", phone: "+359 2 987 6543", joined: "2026-06-14", total_orders: 6 },
  { id: "cust-9", full_name: "Arthur Pendelton", email: "arthur.p@example.com", phone: "+1 (555) 765-4321", joined: "2026-06-15", total_orders: 1 },
];

export default function AdminCustomersPage() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-xs text-gray-400 mt-0.5">{MOCK_CUSTOMERS.length} total registered customers</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-2.5 text-left text-[10px] text-gray-400 font-bold uppercase tracking-wider">Customer</th>
                <th className="px-4 py-2.5 text-left text-[10px] text-gray-400 font-bold uppercase tracking-wider">Phone</th>
                <th className="px-4 py-2.5 text-left text-[10px] text-gray-400 font-bold uppercase tracking-wider">Joined</th>
                <th className="px-4 py-2.5 text-center text-[10px] text-gray-400 font-bold uppercase tracking-wider">Orders</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {MOCK_CUSTOMERS.map((profile, i) => (
                <tr key={profile.id} className={`border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors ${i % 2 === 1 ? "bg-gray-50/30" : ""}`}>
                  <td className="px-4 py-3">
                    <p className="text-xs font-semibold text-gray-800">{profile.full_name}</p>
                    <p className="text-[10px] text-gray-400">{profile.email}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{profile.phone ?? "—"}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">{profile.joined}</td>
                  <td className="px-4 py-3 text-center text-xs font-semibold text-gray-700">{profile.total_orders}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders?customer=${profile.id}`}>
                      <Button size="sm" variant="secondary">View Orders</Button>
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
