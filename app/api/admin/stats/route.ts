import { createServiceClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.app_metadata?.role !== "admin") return null;
  return user;
}

export async function GET() {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabase = await createServiceClient();
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    { data: revenueData },
    { count: totalOrders },
    { count: pendingOrders },
    { count: totalProducts },
  ] = await Promise.all([
    supabase.from("orders").select("total").eq("payment_status", "paid").gte("created_at", startOfMonth.toISOString()),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("products").select("*", { count: "exact", head: true }).eq("is_active", true),
  ]);

  const total_revenue = revenueData?.reduce((sum, o) => sum + Number(o.total), 0) ?? 0;

  return NextResponse.json({ total_revenue, total_orders: totalOrders, pending_orders: pendingOrders, total_products: totalProducts });
}
