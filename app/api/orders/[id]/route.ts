import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("orders")
    .select(`*, items:order_items(*)`)
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !data)
    return NextResponse.json({ error: "Order not found" }, { status: 404 });

  return NextResponse.json(data);
}
