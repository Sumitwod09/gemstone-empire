import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { orderId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = body;

  if (!orderId || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  // Verify HMAC signature
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = await createClient();

  // Update order status
  const { error } = await supabase
    .from("orders")
    .update({
      payment_status: "paid",
      status: "processing",
      razorpay_payment_id,
    })
    .eq("id", orderId);

  if (error) {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }

  // Decrement stock for each variant in the order
  const { data: items } = await supabase
    .from("order_items")
    .select("variant_id, quantity")
    .eq("order_id", orderId);

  if (items) {
    for (const item of items) {
      if (item.variant_id) {
        await supabase.rpc("decrement_stock", {
          variant_id: item.variant_id,
          qty: item.quantity,
        });
      }
    }
  }

  return NextResponse.json({ success: true, orderId });
}
