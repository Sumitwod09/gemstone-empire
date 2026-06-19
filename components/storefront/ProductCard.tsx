import Link from "next/link";
import Image from "next/image";
import type { Product, GemVariant } from "@/types";
import { formatCarat } from "@/lib/utils";
import { Price } from "@/components/storefront/Price";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGem } from "@fortawesome/free-solid-svg-icons";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryVariant: GemVariant | undefined = product.variants?.[0];
  const primaryImage =
    primaryVariant?.images?.find((img) => img.is_primary) ??
    primaryVariant?.images?.[0];

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="bg-white border border-[var(--color-border)] group-hover:border-[var(--color-accent)] rounded-xl overflow-hidden transition-all group-hover:shadow-lg">
        {/* Image */}
        <div className="aspect-[4/3] bg-[var(--color-surface)] relative overflow-hidden">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt_text ?? product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[var(--color-text-muted)]">
              <FontAwesomeIcon icon={faGem} className="w-12 h-12 opacity-20" />
            </div>
          )}
          {primaryVariant?.compare_at_price && (
            <span className="absolute top-2.5 left-2.5 bg-[var(--color-error)] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
              Sale
            </span>
          )}
          {primaryVariant?.treatment === "Unheated" && (
            <span className="absolute top-2.5 right-2.5 bg-[var(--color-accent)] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
              Unheated
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4 text-center">
          <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate leading-tight group-hover:text-[var(--color-accent)] transition-colors">
            {product.name}
          </p>
          {primaryVariant && (
            <p className="text-xs text-[var(--color-text-secondary)] mt-1.5 capitalize">
              {primaryVariant.shape} · {formatCarat(primaryVariant.carat_weight)}
            </p>
          )}
          {primaryVariant?.origin && (
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              {primaryVariant.origin}
            </p>
          )}
          {primaryVariant && (
            <p className="text-base font-bold mt-3" style={{ color: "#006B3F" }}>
              <Price amount={primaryVariant.price} />
              {primaryVariant.compare_at_price && (
                <span className="text-xs text-[var(--color-text-muted)] line-through ml-2 font-normal">
                  <Price amount={primaryVariant.compare_at_price} />
                </span>
              )}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
