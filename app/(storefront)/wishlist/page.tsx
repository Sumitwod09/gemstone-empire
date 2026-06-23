"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faTrash, faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const { addItem } = useCart();

  async function loadWishlist() {
    setLoading(true);
    try {
      const res = await fetch("/api/wishlist");
      if (res.ok) {
        setWishlist(await res.json());
      }
    } catch (err) {
      console.error("Failed to load wishlist", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      if (!supabase) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setAuthenticated(true);
        loadWishlist();
      } else {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const removeWishlist = async (productId: string) => {
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId }),
      });
      if (res.ok) {
        setWishlist((prev) => prev.filter((item) => item.product_id !== productId));
        toast.success("Removed from wishlist");
      }
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  const handleAddToCart = (item: any) => {
    const variant = item.product?.variants?.[0];
    if (variant) {
      addItem(variant);
      toast.success("Added to cart");
    } else {
      toast.error("No variants available for this product");
    }
  };

  if (loading) {
    return (
      <div className="max-w-screen-xl mx-auto px-6 py-24 text-center">
        <p className="text-gray-500 text-sm">Loading wishlist...</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="max-w-screen-sm mx-auto px-6 py-24 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
          <FontAwesomeIcon icon={faHeart} className="w-6 h-6 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Your Wishlist</h1>
        <p className="text-gray-500 text-sm max-w-xs mx-auto">
          Please login or create an account to view and manage your wishlisted luxury gemstones.
        </p>
        <Link href="/login">
          <Button className="px-8 bg-emerald-600 hover:bg-emerald-700">Login to Account</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#004D2B] font-logo">YOUR WISHLIST</h1>
        <p className="text-xs text-gray-400 mt-1">Saved premium gemstones and diamonds</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 bg-gray-50/55 border border-dashed border-gray-200 rounded-lg space-y-4">
          <p className="text-gray-500 text-sm">No items in your wishlist yet.</p>
          <Link href="/products">
            <Button className="bg-emerald-600 hover:bg-emerald-700">Explore Collection</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => {
            const prod = item.product;
            const primaryVar = prod?.variants?.[0];
            return (
              <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-200">
                <div className="p-4 flex gap-4">
                  <div className="w-20 h-20 bg-gray-50 rounded overflow-hidden flex-shrink-0 border border-gray-100 flex items-center justify-center">
                    {/* Fallback box / Image */}
                    {primaryVar?.images?.[0] ? (
                      <img src={primaryVar.images[0].url} alt={prod.name} className="object-cover w-full h-full" />
                    ) : (
                      <span className="text-[10px] text-gray-400">No Image</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-xs font-bold text-gray-900 truncate">{prod.name}</h2>
                    <p className="text-[10px] text-gray-400 mt-0.5">{prod.category?.name}</p>
                    {primaryVar && (
                      <p className="text-sm font-extrabold text-[#006B3F] mt-2">
                        {formatPrice(Number(primaryVar.price))}
                      </p>
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex justify-between items-center gap-2">
                  <button onClick={() => removeWishlist(item.product_id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors" title="Delete">
                    <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                  </button>
                  <Button size="sm" onClick={() => handleAddToCart(item)} className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5 py-1 px-3">
                    <FontAwesomeIcon icon={faShoppingBag} className="w-3 h-3" /> Add to Cart
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
