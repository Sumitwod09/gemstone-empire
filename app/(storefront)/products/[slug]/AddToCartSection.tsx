"use client";

import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui";
import type { GemVariant } from "@/types";
import { toast } from "sonner";
import Link from "next/link";

interface AddToCartSectionProps {
  variant: GemVariant;
}

export function AddToCartSection({ variant }: AddToCartSectionProps) {
  const { addItem } = useCart();

  const inStock = variant.stock_qty > 0;

  const handleAdd = () => {
    addItem(variant);
    toast.success("Added to cart");
  };

  return (
    <div className="flex flex-col gap-3">
      <Button
        size="lg"
        onClick={handleAdd}
        disabled={!inStock}
        className="w-full sm:w-auto"
      >
        {inStock ? "Add to Cart" : "Out of Stock"}
      </Button>
      {inStock && (
        <Link href="/checkout">
          <Button variant="secondary" size="lg" className="w-full sm:w-auto" onClick={handleAdd}>
            Buy Now
          </Button>
        </Link>
      )}
      <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
        <span>✓ Insured shipping</span>
        <span>✓ Certificate of authenticity</span>
      </div>
    </div>
  );
}
