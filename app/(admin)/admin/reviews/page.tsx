"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/admin/StatusBadge";
import type { Review } from "@/types";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<(Review & { product?: { name: string }; profile?: { full_name: string } })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchReviews(); }, []);

  async function fetchReviews() {
    const res = await fetch("/api/admin/reviews");
    if (res.ok) setReviews(await res.json());
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    await fetch("/api/admin/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    toast.success(`Review ${status}`);
    fetchReviews();
  }

  async function deleteReview(id: string) {
    if (!confirm("Delete this review?")) return;
    await fetch("/api/admin/reviews", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    toast.success("Review deleted");
    fetchReviews();
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Reviews</h1>
        <p className="text-xs text-gray-400 mt-0.5">Moderate customer reviews</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-50">
          {loading ? (
            <div className="px-4 py-8 text-center text-gray-400 text-xs">Loading...</div>
          ) : reviews.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-400 text-xs">No reviews yet</div>
          ) : reviews.map((r) => (
            <div key={r.id} className="px-4 py-4 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FontAwesomeIcon key={i} icon={faStar} className={`w-3 h-3 ${i < r.rating ? "text-amber-400" : "text-gray-200"}`} />
                    ))}
                  </div>
                  <StatusBadge status={r.status === "approved" ? "delivered" : r.status === "rejected" ? "cancelled" : "pending"} />
                </div>
                <p className="text-xs font-semibold text-gray-900">{r.title || "Untitled Review"}</p>
                <p className="text-xs text-gray-500 mt-0.5">{r.body}</p>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400">
                  <span>By: {(r as any).profile?.full_name || "Unknown"}</span>
                  <span>Product: {(r as any).product?.name || "Unknown"}</span>
                  <span>{formatDate(r.created_at)}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {r.status !== "approved" && (
                  <button onClick={() => updateStatus(r.id, "approved")} className="px-2 py-1 text-[10px] bg-emerald-50 text-emerald-700 rounded hover:bg-emerald-100 font-medium">
                    Approve
                  </button>
                )}
                {r.status !== "rejected" && (
                  <button onClick={() => updateStatus(r.id, "rejected")} className="px-2 py-1 text-[10px] bg-red-50 text-red-600 rounded hover:bg-red-100 font-medium">
                    Reject
                  </button>
                )}
                <button onClick={() => deleteReview(r.id)} className="p-1.5 text-gray-400 hover:text-red-600">
                  <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
