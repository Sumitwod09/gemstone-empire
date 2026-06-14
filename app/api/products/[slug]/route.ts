import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(`*, category:categories(*), variants:gem_variants(*, images:gem_images(*))`)
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !data)
    return NextResponse.json({ error: "Product not found" }, { status: 404 });

  return NextResponse.json(data);
}
