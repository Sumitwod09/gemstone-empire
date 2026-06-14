import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Customers — Admin" };

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

const PAGE_SIZE = 20;

export default async function AdminCustomersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  const page = Math.max(1, parseInt(params.page ?? "1"));
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data: profiles, count } = await supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-6">Customers</h1>

      <div className="bg-white border border-[var(--color-border)] rounded-[8px] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
              <th className="px-4 py-2.5 text-left text-xs text-[var(--color-text-muted)] font-medium">Name</th>
              <th className="px-4 py-2.5 text-left text-xs text-[var(--color-text-muted)] font-medium">Phone</th>
              <th className="px-4 py-2.5 text-left text-xs text-[var(--color-text-muted)] font-medium">Joined</th>
              <th className="px-4 py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            {profiles?.map((profile) => (
              <tr key={profile.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface-hover)]">
                <td className="px-4 py-2.5 font-medium">{profile.full_name}</td>
                <td className="px-4 py-2.5 text-[var(--color-text-muted)]">{profile.phone ?? "—"}</td>
                <td className="px-4 py-2.5 text-[var(--color-text-muted)]">{formatDate(profile.created_at)}</td>
                <td className="px-4 py-2.5">
                  <Link href={`/admin/orders?customer=${profile.id}`}>
                    <Button size="sm" variant="secondary">View Orders</Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {page > 1 && <Link href={`?page=${page - 1}`}><Button variant="secondary" size="sm">Previous</Button></Link>}
          <span className="text-sm text-[var(--color-text-muted)]">Page {page} of {totalPages}</span>
          {page < totalPages && <Link href={`?page=${page + 1}`}><Button variant="secondary" size="sm">Next</Button></Link>}
        </div>
      )}
    </div>
  );
}
