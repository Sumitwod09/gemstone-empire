"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { OrderStatusUpdater } from "./OrderStatusUpdater";
import { formatPrice } from "@/lib/utils";
import type { OrderStatus } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

const MOCK_ORDERS_DETAILS = [
  {
    id: "ord-1",
    order_number: "GE-2026-001",
    status: "delivered" as OrderStatus,
    created_at: "2026-06-18T10:30:00Z",
    total: 4200,
    profile: { full_name: "James Richardson", phone: "+1 (555) 019-2834" },
    shipping_address: { full_name: "James Richardson", line1: "123 Fifth Ave, Apt 4B", city: "New York", state: "NY", zip: "10003" },
    items: [
      { id: "item-1", product_name: "Kashmir Sapphire 1.05ct", quantity: 1, total_price: 3800 },
      { id: "item-2", product_name: "Insured Premium Shipping", quantity: 1, total_price: 400 },
    ],
  },
  {
    id: "ord-2",
    order_number: "GE-2026-002",
    status: "shipped" as OrderStatus,
    created_at: "2026-06-17T14:15:00Z",
    total: 3800,
    profile: { full_name: "Sarah Chen", phone: "+86 186 1234 5678" },
    shipping_address: { full_name: "Sarah Chen", line1: "No. 88 Nanjing Road", city: "Shanghai", state: "SH", zip: "200001" },
    items: [
      { id: "item-3", product_name: "Colombian Emerald 0.85ct", quantity: 1, total_price: 3800 },
    ],
  },
  {
    id: "ord-3",
    order_number: "GE-2026-003",
    status: "processing" as OrderStatus,
    created_at: "2026-06-16T09:00:00Z",
    total: 8500,
    profile: { full_name: "Marco Bellini", phone: "+39 02 1234567" },
    shipping_address: { full_name: "Marco Bellini", line1: "Via Montenapoleone 10", city: "Milan", state: "MI", zip: "20121" },
    items: [
      { id: "item-4", product_name: "Royal Blue Sapphire 2.10ct", quantity: 1, total_price: 8500 },
    ],
  },
];

export default function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = use(params);

  // Fallback to first order if custom ID is requested
  const orderData = MOCK_ORDERS_DETAILS.find((o) => o.id === id) || MOCK_ORDERS_DETAILS[0];

  const [status, setStatus] = useState<OrderStatus>(orderData.status);

  if (!orderData) notFound();

  const handleStatusChange = (newStatus: OrderStatus) => {
    setStatus(newStatus);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">{orderData.order_number}</h1>
          <p className="text-xs text-gray-400 mt-0.5">Order placed on {new Date(orderData.created_at).toLocaleDateString()}</p>
        </div>
        <div className="self-start sm:self-auto">
          <StatusBadge status={status} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-2">Customer Info</p>
          <p className="text-xs font-semibold text-gray-800">{orderData.profile?.full_name ?? "Guest"}</p>
          {orderData.profile?.phone && (
            <p className="text-xs text-gray-500 mt-0.5">{orderData.profile.phone}</p>
          )}
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-2">Shipping Address</p>
          <p className="text-xs font-semibold text-gray-800">{orderData.shipping_address.full_name}</p>
          <p className="text-xs text-gray-500 mt-0.5">{orderData.shipping_address.line1}</p>
          <p className="text-xs text-gray-500">
            {orderData.shipping_address.city}, {orderData.shipping_address.state} {orderData.shipping_address.zip}
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
        <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-3">Order Items</p>
        <div className="divide-y divide-gray-100">
          {orderData.items?.map((item) => (
            <div key={item.id} className="flex justify-between text-xs py-2.5">
              <span className="text-gray-600 font-medium">{item.product_name} × {item.quantity}</span>
              <span className="font-bold text-gray-800">{formatPrice(item.total_price)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-extrabold text-sm pt-3 mt-1 border-t border-gray-100 text-gray-900">
          <span>Grand Total</span>
          <span>{formatPrice(orderData.total)}</span>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-3">Update Order Status</p>
        <OrderStatusUpdater orderId={id} currentStatus={status} onUpdate={handleStatusChange} />
      </div>
    </div>
  );
}
