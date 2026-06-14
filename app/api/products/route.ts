import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(48, parseInt(searchParams.get("limit") ?? "24"));
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("products")
    .select(
      `*, category:categories(id,name,slug), variants:gem_variants(*, images:gem_images(*))`,
      { count: "exact" }
    )
    .eq("is_active", true);

  const category = searchParams.get("category");
  if (category) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", category)
      .single();
    if (cat) query = query.eq("category_id", cat.id);
  }

  const sort = searchParams.get("sort") ?? "newest";
  if (sort === "newest") query = query.order("created_at", { ascending: false });
  else if (sort === "price_asc") query = query.order("created_at", { ascending: true });
  else if (sort === "price_desc") query = query.order("created_at", { ascending: false });

  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    data,
    total: count ?? 0,
    page,
    limit,
    totalPages: Math.ceil((count ?? 0) / limit),
  });
}
