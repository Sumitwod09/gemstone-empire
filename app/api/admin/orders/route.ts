import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.app_metadata?.role !== "admin") return { supabase: null, user: null };
  return { supabase, user };
}

export async function GET(request: NextRequest) {
  const { supabase } = await requireAdmin();
  if (!supabase) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const from = (page - 1) * limit;

  let query = supabase
    .from("orders")
    .select("*, items:order_items(*), profile:profiles(full_name)", { count: "exact" });

  if (status && status !== "all") query = query.eq("status", status);

  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(from, from + limit - 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    data: data ?? [],
    total: count ?? 0,
    page,
    limit,
    totalPages: Math.ceil((count ?? 0) / limit),
  });
}

export async function PATCH(request: NextRequest) {
  const { supabase, user } = await requireAdmin();
  if (!supabase || !user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const { order_id, status, payment_status, tracking_url } = body;

  if (!order_id) return NextResponse.json({ error: "order_id required" }, { status: 400 });

  const updates: Record<string, any> = { updated_at: new Date().toISOString() };
  if (status) {
    updates.status = status;
    if (status === "confirmed") updates.confirmed_at = new Date().toISOString();
    if (status === "shipped") updates.shipped_at = new Date().toISOString();
    if (status === "delivered") updates.delivered_at = new Date().toISOString();
  }
  if (payment_status) updates.payment_status = payment_status;
  if (tracking_url !== undefined) updates.tracking_url = tracking_url;

  const { data, error } = await supabase
    .from("orders")
    .update(updates)
    .eq("id", order_id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Log status change
  if (status) {
    await supabase.from("order_status_history").insert({
      order_id,
      status,
      changed_by: user.id,
      note: `Status updated to ${status}` + (tracking_url ? ` — tracking: ${tracking_url}` : ""),
    });
  }

  return NextResponse.json(data);
}
