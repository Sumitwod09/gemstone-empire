import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";

  if (!q) return NextResponse.json({ data: [], total: 0 });

  const supabase = await createClient();

  const { data, count, error } = await supabase
    .from("products")
    .select(
      `*, category:categories(id,name,slug), variants:gem_variants(*, images:gem_images(*))`,
      { count: "exact" }
    )
    .eq("is_active", true)
    .or(`name.ilike.%${q}%,description.ilike.%${q}%`)
    .limit(48);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data, total: count ?? 0 });
}
