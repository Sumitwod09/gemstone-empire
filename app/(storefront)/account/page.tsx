import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AccountProfileForm } from "./AccountProfileForm";
import { AddressManager } from "./AddressManager";
import type { Profile, Address } from "@/types";

export const metadata: Metadata = { title: "My Account" };

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: addresses }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("addresses").select("*").eq("user_id", user.id).order("is_default", { ascending: false }),
  ]);

  return (
    <div className="max-w-screen-md mx-auto px-6 py-10">
      <h1
        className="text-3xl font-bold text-[var(--color-text-primary)] mb-8"
        style={{ fontFamily: "var(--font-display)" }}
      >
        My Account
      </h1>
      <div className="flex flex-col gap-10">
        <section>
          <h2 className="text-base font-semibold mb-4 border-b border-[var(--color-border)] pb-3">
            Profile
          </h2>
          <AccountProfileForm
            profile={(profile as Profile) ?? { id: user.id, full_name: "", created_at: "", updated_at: "" }}
            email={user.email ?? ""}
          />
        </section>
        <section>
          <h2 className="text-base font-semibold mb-4 border-b border-[var(--color-border)] pb-3">
            Saved Addresses
          </h2>
          <AddressManager
            addresses={(addresses as Address[]) ?? []}
            userId={user.id}
          />
        </section>
      </div>
    </div>
  );
}
