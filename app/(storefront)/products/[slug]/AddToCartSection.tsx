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
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          size="lg"
          onClick={handleAdd}
          disabled={!inStock}
          className="w-full sm:flex-1 !bg-[#006B3F] hover:!bg-[#005432] text-white font-semibold transition-colors duration-200"
        >
          {inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
        {inStock && (
          <Link href="/checkout" className="w-full sm:flex-1 flex">
            <Button
              variant="secondary"
              size="lg"
              className="w-full !border-[#006B3F] !text-[#006B3F] hover:!bg-[#E6F5EE] font-semibold transition-colors duration-200"
              onClick={handleAdd}
            >
              Buy Now
            </Button>
          </Link>
        )}
      </div>
      <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)] font-medium mt-1">
        <span className="flex items-center gap-1">
          <span className="text-[#006B3F]">✓</span> Insured shipping
        </span>
        <span className="flex items-center gap-1">
          <span className="text-[#006B3F]">✓</span> Certificate of authenticity
        </span>
      </div>
    </div>
  );
}
