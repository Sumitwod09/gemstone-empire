import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { getRazorpay } from "@/lib/razorpay";
import { generateOrderNumber } from "@/lib/utils";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { items, shippingAddress } = body;

  if (!items?.length || !shippingAddress) {
    return NextResponse.json({ error: "Missing items or shipping address" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch variant prices from DB to avoid client-side price manipulation
  const variantIds: string[] = items.map((i: { variantId: string }) => i.variantId);
  const { data: variants } = await supabase
    .from("gem_variants")
    .select("id, price, stock_qty, product:products(name), sku")
    .in("id", variantIds);

  if (!variants?.length) {
    return NextResponse.json({ error: "Invalid items" }, { status: 400 });
  }

  // Calculate totals server-side
  let subtotal = 0;
  const orderItems = items.map((item: { variantId: string; quantity: number }) => {
    const variant = variants.find((v: any) => v.id === item.variantId);
    if (!variant) throw new Error(`Variant ${item.variantId} not found`);
    const unitPrice = Number(variant.price);
    const totalPrice = unitPrice * item.quantity;
    subtotal += totalPrice;
    return {
      variant_id: item.variantId,
      product_name: (variant as unknown as { product?: { name: string } }).product?.name ?? variant.sku,
      variant_sku: variant.sku,
      variant_snapshot: variant,
      quantity: item.quantity,
      unit_price: unitPrice,
      total_price: totalPrice,
    };
  });

  const shippingCost = subtotal > 500 ? 0 : 25;
  const total = subtotal + shippingCost;
  const orderNumber = generateOrderNumber();

  // Create Razorpay order (amount in paise for INR, cents for USD)
  // Using amount in USD cents
  const razorpayOrder = await getRazorpay().orders.create({
    amount: Math.round(total * 100),
    currency: "USD",
    receipt: orderNumber,
  });

  // Create order in Supabase
  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      user_id: user?.id ?? null,
      status: "pending",
      subtotal,
      shipping_cost: shippingCost,
      total,
      currency: "USD",
      razorpay_order_id: razorpayOrder.id,
      payment_status: "pending",
      shipping_address: shippingAddress,
    })
    .select()
    .single();

  if (error || !order) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }

  // Insert order items
  await supabase.from("order_items").insert(
    orderItems.map((item: typeof orderItems[number]) => ({ ...item, order_id: order.id }))
  );

  return NextResponse.json({
    orderId: order.id,
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: "USD",
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  });
}
