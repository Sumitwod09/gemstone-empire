"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { formatDate } from "@/lib/utils";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await fetch("/api/admin/customers");
        if (res.ok) {
          setCustomers(await res.json());
        }
      } catch (err) {
        console.error("Failed to load customers", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {loading ? "Loading..." : `${customers.length} total registered customers`}
          </p>
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
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400 text-xs">
                    Loading customers...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400 text-xs">
                    No customers found
                  </td>
                </tr>
              ) : (
                customers.map((profile, i) => (
                  <tr
                    key={profile.id}
                    className={`border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors ${
                      i % 2 === 1 ? "bg-gray-50/30" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <p className="text-xs font-semibold text-gray-800">{profile.full_name || "No Name"}</p>
                      <p className="text-[10px] text-gray-400">{profile.email || "—"}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{profile.phone ?? "—"}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{formatDate(profile.created_at)}</td>
                    <td className="px-4 py-3 text-center text-xs font-semibold text-gray-700">
                      {profile.orders?.[0]?.count ?? 0}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/orders?customer=${profile.id}`}>
                        <Button size="sm" variant="secondary">View Orders</Button>
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
