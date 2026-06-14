import Link from "next/link";
import Image from "next/image";
import type { Product, GemVariant } from "@/types";
import { formatPrice, formatCarat } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryVariant: GemVariant | undefined = product.variants?.[0];
  const primaryImage = primaryVariant?.images?.find((img) => img.is_primary) ?? primaryVariant?.images?.[0];

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="bg-white border border-[var(--color-border)] group-hover:border-[var(--color-border-strong)] rounded-[8px] overflow-hidden transition-colors">
        {/* Image */}
        <div className="aspect-[4/3] bg-[var(--color-surface)] relative overflow-hidden">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt_text ?? product.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[var(--color-text-muted)]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 opacity-30"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M6.5 5h11l3 5-8.5 9.5L3.5 10z" />
              </svg>
            </div>
          )}
          {primaryVariant?.compare_at_price && (
            <span className="absolute top-2 left-2 bg-[var(--color-accent-light)] text-[var(--color-accent)] text-[10px] font-semibold px-2 py-0.5 rounded-[4px]">
              Sale
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate leading-tight">
            {product.name}
          </p>
          {primaryVariant && (
            <p className="text-xs text-[var(--color-text-secondary)] mt-1 capitalize">
              {primaryVariant.shape} / {formatCarat(primaryVariant.carat_weight)}
            </p>
          )}
          {primaryVariant?.origin && (
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              {primaryVariant.origin}
            </p>
          )}
          {primaryVariant && (
            <p className="text-[15px] font-semibold text-[var(--color-text-primary)] mt-2">
              {formatPrice(primaryVariant.price)}
              {primaryVariant.compare_at_price && (
                <span className="text-xs text-[var(--color-text-muted)] line-through ml-2">
                  {formatPrice(primaryVariant.compare_at_price)}
                </span>
              )}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
