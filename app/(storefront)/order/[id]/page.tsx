import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatPrice, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faBuilding } from "@fortawesome/free-solid-svg-icons";

export const metadata: Metadata = {
  title: "Order Confirmation — Gemstone Empire",
};

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .eq("id", id)
    .single();

  if (!order) {
    return (
      <div className="max-w-screen-sm mx-auto px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
        <p className="text-gray-500 text-sm mb-6">This order does not exist or you don&apos;t have access.</p>
        <Link href="/products"><Button>Continue Shopping</Button></Link>
      </div>
    );
  }

  const addr = order.shipping_address as Record<string, string>;

  return (
    <div className="max-w-screen-md mx-auto px-6 py-12">
      {/* Success Banner */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FontAwesomeIcon icon={faCheckCircle} className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Order Placed Successfully!</h1>
        <p className="text-gray-500 text-sm">Your order <span className="font-mono font-bold text-emerald-700">{order.order_number}</span> has been received.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 mb-3">Order Details</h2>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-gray-400">Order Number</span><span className="font-mono font-bold">{order.order_number}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Date</span><span>{formatDate(order.created_at)}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Status</span><StatusBadge status={order.status} /></div>
            <div className="flex justify-between"><span className="text-gray-400">Payment</span><StatusBadge status={order.payment_status} /></div>
            {order.tracking_url && (
              <div className="flex justify-between"><span className="text-gray-400">Tracking</span><a href={order.tracking_url} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Track Shipment →</a></div>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 mb-3">Shipping To</h2>
          <div className="text-xs text-gray-600 space-y-1">
            <p className="font-semibold text-gray-900">{addr.full_name}</p>
            <p>{addr.line1}</p>
            {addr.line2 && <p>{addr.line2}</p>}
            <p>{addr.city}, {addr.state} {addr.zip}</p>
            <p>{addr.country}</p>
            {addr.phone && <p className="text-gray-400">{addr.phone}</p>}
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-8">
        <div className="px-5 py-4 border-b border-gray-100"><h2 className="text-sm font-bold text-gray-800">Items Ordered</h2></div>
        <div className="divide-y divide-gray-50">
          {(order.items ?? []).map((item: any) => (
            <div key={item.id} className="px-5 py-3 flex justify-between items-center">
              <div>
                <p className="text-xs font-semibold text-gray-900">{item.product_name}</p>
                <p className="text-[10px] text-gray-400 font-mono">{item.variant_sku} × {item.quantity}</p>
              </div>
              <p className="text-xs font-bold text-gray-800">{formatPrice(Number(item.total_price))}</p>
            </div>
          ))}
        </div>
        <div className="px-5 py-4 border-t border-gray-200 bg-gray-50 space-y-1.5">
          <div className="flex justify-between text-xs"><span className="text-gray-500">Subtotal</span><span>{formatPrice(Number(order.subtotal))}</span></div>
          {Number(order.discount_amount) > 0 && (
            <div className="flex justify-between text-xs text-emerald-600">
              <span>Discount{order.coupon_code ? ` (${order.coupon_code})` : ""}</span>
              <span>-{formatPrice(Number(order.discount_amount))}</span>
            </div>
          )}
          <div className="flex justify-between text-xs"><span className="text-gray-500">Shipping</span><span>{Number(order.shipping_cost) === 0 ? "Free" : formatPrice(Number(order.shipping_cost))}</span></div>
          <div className="flex justify-between text-sm font-bold pt-2 border-t border-gray-200"><span>Total</span><span>{formatPrice(Number(order.total))}</span></div>
        </div>
      </div>

      {/* Payment Instructions */}
      {order.payment_status === "pending" && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <FontAwesomeIcon icon={faBuilding} className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h2 className="text-sm font-bold text-amber-900 mb-2">Payment Instructions</h2>
              <p className="text-xs text-amber-800 mb-4">
                Please send payment using one of the methods below. Include order number <span className="font-mono font-bold">{order.order_number}</span> as the reference.
              </p>
              <div className="space-y-4">
                <div className="bg-white rounded-md border border-amber-100 p-4">
                  <h3 className="text-xs font-bold text-gray-900 mb-2">Bank Wire Transfer (USD)</h3>
                  <div className="grid grid-cols-[100px_1fr] gap-y-1.5 text-[11px]">
                    <span className="text-gray-400">Bank</span><span className="text-gray-700">Gemstone Empire Inc.</span>
                    <span className="text-gray-400">Account</span><span className="text-gray-700 font-mono">XXXX-XXXX-XXXX</span>
                    <span className="text-gray-400">SWIFT</span><span className="text-gray-700 font-mono">XXXXXXXXX</span>
                    <span className="text-gray-400">Reference</span><span className="text-gray-700 font-bold">{order.order_number}</span>
                  </div>
                </div>
                <div className="bg-white rounded-md border border-amber-100 p-4">
                  <h3 className="text-xs font-bold text-gray-900 mb-2">UPI Payment (INR)</h3>
                  <div className="grid grid-cols-[100px_1fr] gap-y-1.5 text-[11px]">
                    <span className="text-gray-400">UPI ID</span><span className="text-gray-700 font-mono">gemstoneempire@upi</span>
                    <span className="text-gray-400">Reference</span><span className="text-gray-700 font-bold">{order.order_number}</span>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-amber-700 mt-3">
                Once payment is received, your order will be updated to &quot;Confirmed&quot;.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="text-center space-y-3">
        <Link href="/products"><Button size="lg" className="px-10">Continue Shopping</Button></Link>
        <p className="text-xs text-gray-400">Track your order status from your account page.</p>
      </div>
    </div>
  );
}
