import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const { code, subtotal } = await request.json();

  if (!code) {
    return NextResponse.json({ valid: false, error: "Coupon code is required" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: coupon } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", code.toUpperCase())
    .eq("is_active", true)
    .single();

  if (!coupon) {
    return NextResponse.json({ valid: false, error: "Invalid coupon code" }, { status: 404 });
  }

  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return NextResponse.json({ valid: false, error: "Coupon has expired" }, { status: 400 });
  }

  if (coupon.max_uses && coupon.current_uses >= coupon.max_uses) {
    return NextResponse.json({ valid: false, error: "Coupon usage limit reached" }, { status: 400 });
  }

  if (subtotal < Number(coupon.min_order_value)) {
    return NextResponse.json({
      valid: false,
      error: `Minimum order of $${Number(coupon.min_order_value).toFixed(2)} required`,
    }, { status: 400 });
  }

  let discount_amount = 0;
  if (coupon.discount_type === "percentage") {
    discount_amount = Math.round(subtotal * Number(coupon.discount_value) / 100 * 100) / 100;
  } else {
    discount_amount = Math.min(Number(coupon.discount_value), subtotal);
  }

  return NextResponse.json({
    valid: true,
    code: coupon.code,
    discount_type: coupon.discount_type,
    discount_value: Number(coupon.discount_value),
    discount_amount,
  });
}
