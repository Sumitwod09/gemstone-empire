"use client";

import { useState, useEffect } from "react";
import { Button, Input } from "@/components/ui";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faToggleOn, faToggleOff } from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import type { Coupon } from "@/types";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    code: "", discount_type: "percentage" as "percentage" | "flat",
    discount_value: "", min_order_value: "0", max_uses: "", expires_at: "",
  });

  useEffect(() => { fetchCoupons(); }, []);

  async function fetchCoupons() {
    const res = await fetch("/api/admin/coupons");
    if (res.ok) setCoupons(await res.json());
    setLoading(false);
  }

  async function createCoupon() {
    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: form.code.toUpperCase(),
        discount_type: form.discount_type,
        discount_value: parseFloat(form.discount_value),
        min_order_value: parseFloat(form.min_order_value) || 0,
        max_uses: form.max_uses ? parseInt(form.max_uses) : null,
        is_active: true,
        expires_at: form.expires_at || null,
      }),
    });
    if (res.ok) {
      toast.success("Coupon created");
      setShowForm(false);
      setForm({ code: "", discount_type: "percentage", discount_value: "", min_order_value: "0", max_uses: "", expires_at: "" });
      fetchCoupons();
    } else toast.error("Failed to create coupon");
  }

  async function toggleActive(coupon: Coupon) {
    await fetch("/api/admin/coupons", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: coupon.id, is_active: !coupon.is_active }),
    });
    fetchCoupons();
  }

  async function deleteCoupon(id: string) {
    if (!confirm("Delete this coupon?")) return;
    await fetch("/api/admin/coupons", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    toast.success("Coupon deleted");
    fetchCoupons();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Coupons</h1>
          <p className="text-xs text-gray-400 mt-0.5">Manage discount codes</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} size="sm">
          <FontAwesomeIcon icon={faPlus} className="w-3 h-3 mr-1" /> New Coupon
        </Button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6 shadow-sm">
          <h2 className="text-sm font-bold text-gray-800 mb-4">Create Coupon</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input label="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="WELCOME10" />
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm" value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value as any })}>
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Amount ($)</option>
              </select>
            </div>
            <Input label="Discount Value" type="number" value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: e.target.value })} placeholder="10" />
            <Input label="Min Order ($)" type="number" value={form.min_order_value} onChange={(e) => setForm({ ...form, min_order_value: e.target.value })} />
            <Input label="Max Uses (empty = unlimited)" type="number" value={form.max_uses} onChange={(e) => setForm({ ...form, max_uses: e.target.value })} />
            <Input label="Expires At" type="date" value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })} />
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={createCoupon} size="sm">Create</Button>
            <Button variant="secondary" onClick={() => setShowForm(false)} size="sm">Cancel</Button>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-4 py-2.5 text-left text-[10px] text-gray-400 font-bold uppercase">Code</th>
              <th className="px-4 py-2.5 text-left text-[10px] text-gray-400 font-bold uppercase">Discount</th>
              <th className="px-4 py-2.5 text-left text-[10px] text-gray-400 font-bold uppercase">Min Order</th>
              <th className="px-4 py-2.5 text-center text-[10px] text-gray-400 font-bold uppercase">Uses</th>
              <th className="px-4 py-2.5 text-center text-[10px] text-gray-400 font-bold uppercase">Status</th>
              <th className="px-4 py-2.5 text-right text-[10px] text-gray-400 font-bold uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-xs">Loading...</td></tr>
            ) : coupons.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-xs">No coupons yet</td></tr>
            ) : coupons.map((c) => (
              <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-4 py-3 font-mono font-bold text-emerald-700 text-xs">{c.code}</td>
                <td className="px-4 py-3 text-xs">{c.discount_type === "percentage" ? `${c.discount_value}%` : `$${c.discount_value}`}</td>
                <td className="px-4 py-3 text-xs text-gray-500">${c.min_order_value}</td>
                <td className="px-4 py-3 text-center text-xs">{c.current_uses}{c.max_uses ? `/${c.max_uses}` : ""}</td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge status={c.is_active ? "delivered" : "cancelled"} />
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => toggleActive(c)} className="p-1.5 text-gray-400 hover:text-emerald-600" title={c.is_active ? "Deactivate" : "Activate"}>
                      <FontAwesomeIcon icon={c.is_active ? faToggleOn : faToggleOff} className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteCoupon(c.id)} className="p-1.5 text-gray-400 hover:text-red-600">
                      <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
