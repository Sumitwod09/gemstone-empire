"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faSolidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faRegularHeart } from "@fortawesome/free-regular-svg-icons";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface WishlistButtonProps {
  productId: string;
}

export function WishlistButton({ productId }: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function checkAuthAndWishlist() {
      const supabase = createClient();
      if (!supabase) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        // Fetch wishlist status
        try {
          const res = await fetch("/api/wishlist");
          if (res.ok) {
            const wishlist = await res.json();
            setIsWishlisted(wishlist.some((item: any) => item.product_id === productId));
          }
        } catch (err) {
          console.error("Failed to check wishlist status", err);
        }
      }
    }
    checkAuthAndWishlist();
  }, [productId]);

  const toggleWishlist = async () => {
    if (!user) {
      toast.error("Please login to add items to your wishlist");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId }),
      });

      if (!res.ok) throw new Error("Failed to toggle wishlist");
      const result = await res.json();
      setIsWishlisted(result.wishlisted);
      toast.success(result.wishlisted ? "Added to wishlist" : "Removed from wishlist");
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      disabled={loading}
      className={`p-2.5 rounded-full border transition-all duration-200 ${
        isWishlisted
          ? "bg-red-50 border-red-200 text-red-500 hover:bg-red-100"
          : "bg-white border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-500"
      }`}
      title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
    >
      <FontAwesomeIcon icon={isWishlisted ? faSolidHeart : faRegularHeart} className="w-4 h-4" />
    </button>
  );
}
