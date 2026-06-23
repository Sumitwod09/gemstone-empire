"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewSchema, type ReviewFormData } from "@/lib/validators";
import { Input, Textarea, Button } from "@/components/ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faRegularStar } from "@fortawesome/free-regular-svg-icons";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";

interface ProductReviewsProps {
  productId: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { product_id: productId, rating: 5, title: "", body: "" },
  });

  const rating = watch("rating");

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/reviews?product_id=${productId}`);
        if (res.ok) {
          setReviews(await res.json());
        }

        const supabase = createClient();
        if (supabase) {
          const { data: { user } } = await supabase.auth.getUser();
          setUser(user);
        }
      } catch (err) {
        console.error("Failed to load reviews", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [productId]);

  const onSubmit = async (data: ReviewFormData) => {
    setFormLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to submit review");
      toast.success("Review submitted! It will appear once approved by our moderation team.");
      setShowForm(false);
      reset({ product_id: productId, rating: 5, title: "", body: "" });
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setFormLoading(false);
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-150 pb-5">
        <div>
          <h3 className="text-base font-bold text-gray-900">Client Reviews</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {reviews.length === 0 ? "No reviews yet" : `Based on ${reviews.length} approved client submissions`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {avgRating && (
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3 py-1 rounded font-bold text-sm">
              <FontAwesomeIcon icon={faStar} className="w-3.5 h-3.5 text-emerald-600" />
              {avgRating} / 5.0
            </div>
          )}
          {user ? (
            <Button size="sm" onClick={() => setShowForm(!showForm)}>
              Write a Review
            </Button>
          ) : (
            <p className="text-xs text-gray-400">
              Please <Link href="/login" className="text-emerald-700 hover:underline font-bold">login</Link> to submit a review.
            </p>
          )}
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-50 border border-gray-200 rounded-lg p-5 flex flex-col gap-4 max-w-xl">
          <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">Write Review</p>
          
          {/* Star rating selector */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setValue("rating", star)}
                  className="p-1 hover:scale-110 transition-transform text-amber-400"
                >
                  <FontAwesomeIcon icon={star <= rating ? faStar : faRegularStar} className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          <Input label="Review Title" {...register("title")} error={errors.title?.message} placeholder="e.g., Exquisite cut and fire" />
          <Textarea label="Review Comments" {...register("body")} error={errors.body?.message} rows={3} placeholder="Tell us about the gemstone..." />

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="secondary" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit" size="sm" loading={formLoading} className="bg-emerald-600 hover:bg-emerald-700">Submit Review</Button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-xs text-gray-400">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-xs text-gray-400 italic">No reviews have been written for this gemstone yet.</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="border-b border-gray-100 pb-4 last:border-0">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FontAwesomeIcon key={i} icon={faStar} className={`w-3 h-3 ${i < r.rating ? "text-amber-400" : "text-gray-200"}`} />
                  ))}
                </div>
                <span className="text-[10px] text-gray-400 font-bold">{r.profile?.full_name || "Anonymous Client"}</span>
                <span className="text-[10px] text-gray-300">|</span>
                <span className="text-[10px] text-gray-400">{formatDate(r.created_at)}</span>
              </div>
              <p className="text-xs font-semibold text-gray-900">{r.title}</p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{r.body}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
