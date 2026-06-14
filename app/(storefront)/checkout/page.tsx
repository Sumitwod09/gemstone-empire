import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { CheckoutForm } from "@/components/storefront/CheckoutForm";
import type { Address } from "@/types";

export const metadata: Metadata = {
  title: "Checkout",
};

export default async function CheckoutPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let addresses: Address[] = [];
  if (user) {
    const { data } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false });
    addresses = (data as Address[]) ?? [];
  }

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-10">
      <h1
        className="text-3xl font-bold text-[var(--color-text-primary)] mb-8"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Checkout
      </h1>
      <CheckoutForm savedAddresses={addresses} />
    </div>
  );
}
