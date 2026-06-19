import { createBrowserClient } from "@supabase/ssr";

const CONFIGURED =
  typeof process !== "undefined" &&
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 10;

export function createClient() {
  if (!CONFIGURED) return null;
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
