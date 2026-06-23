import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { generateOrderNumber, calculateShipping } from "@/lib/utils";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { items, shippingAddress, coupon_code, guest_email } = body;

  if (!items?.length || !shippingAddress) {
    return NextResponse.json({ error: "Missing items or shipping address" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Guest checkout requires email
  if (!user && !guest_email) {
    return NextResponse.json({ error: "Email is required for guest checkout" }, { status: 400 });
  }

  // Fetch variant prices server-side to prevent price manipulation
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

  // Coupon validation
  let discountAmount = 0;
  let appliedCoupon: string | null = null;

  if (coupon_code) {
    const { data: coupon } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", coupon_code.toUpperCase())
      .eq("is_active", true)
      .single();

    if (coupon) {
      const isExpired = coupon.expires_at && new Date(coupon.expires_at) < new Date();
      const isMaxedOut = coupon.max_uses && coupon.current_uses >= coupon.max_uses;
      const meetsMinimum = subtotal >= Number(coupon.min_order_value);

      if (!isExpired && !isMaxedOut && meetsMinimum) {
        if (coupon.discount_type === "percentage") {
          discountAmount = Math.round(subtotal * Number(coupon.discount_value) / 100 * 100) / 100;
        } else {
          discountAmount = Math.min(Number(coupon.discount_value), subtotal);
        }
        appliedCoupon = coupon.code;

        // Increment usage
        await supabase
          .from("coupons")
          .update({ current_uses: coupon.current_uses + 1 })
          .eq("id", coupon.id);
      }
    }
  }

  const discountedSubtotal = subtotal - discountAmount;
  const shippingCost = calculateShipping(discountedSubtotal);
  const total = discountedSubtotal + shippingCost;
  const orderNumber = generateOrderNumber();

  // Create order — always pending (offline payment model)
  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      user_id: user?.id ?? null,
      guest_email: guest_email || null,
      status: "pending",
      subtotal,
      discount_amount: discountAmount,
      coupon_code: appliedCoupon,
      shipping_cost: shippingCost,
      total,
      currency: "USD",
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

  // Log initial status
  await supabase.from("order_status_history").insert({
    order_id: order.id,
    status: "pending",
    changed_by: user?.id ?? null,
    note: "Order placed" + (guest_email ? ` (guest: ${guest_email})` : ""),
  });

  // Decrement stock
  for (const item of orderItems) {
    await supabase.rpc("decrement_stock", {
      p_variant_id: item.variant_id,
      p_qty: item.quantity,
    });
  }

  return NextResponse.json({
    orderId: order.id,
    orderNumber: order.order_number,
    total,
    subtotal,
    discountAmount,
    shippingCost,
    currency: "USD",
  });
}
