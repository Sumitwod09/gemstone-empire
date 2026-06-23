import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase: null, error: "Unauthorized" };
  const isAdmin = user.app_metadata?.role === "admin";
  if (!isAdmin) return { supabase: null, error: "Forbidden" };
  return { supabase, error: null, user };
}

export async function GET() {
  const { supabase, error } = await requireAdmin();
  if (error || !supabase) return NextResponse.json({ error }, { status: 403 });

  const [
    { count: totalOrders },
    { count: pendingOrders },
    { count: totalProducts },
    { count: totalCustomers },
    { data: revenueData },
  ] = await Promise.all([
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("products").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("total").eq("payment_status", "paid"),
  ]);

  const totalRevenue = (revenueData ?? []).reduce((sum: number, o: any) => sum + Number(o.total), 0);

  return NextResponse.json({
    total_revenue: totalRevenue,
    total_orders: totalOrders ?? 0,
    pending_orders: pendingOrders ?? 0,
    total_products: totalProducts ?? 0,
    total_customers: totalCustomers ?? 0,
  });
}
