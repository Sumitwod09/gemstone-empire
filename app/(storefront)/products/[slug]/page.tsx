import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/db";
import { GemImageGallery } from "@/components/storefront/GemImageGallery";
import { Breadcrumb } from "@/components/storefront/Breadcrumb";
import { ProductCard } from "@/components/storefront/ProductCard";
import { AddToCartSection } from "./AddToCartSection";
import { formatPrice, formatCarat, formatDimensions } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.meta_title ?? product.name,
    description: product.meta_description ?? undefined,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const primaryVariant = product.variants?.find((v) => v.is_active) ?? product.variants?.[0];
  const allImages = primaryVariant?.images ?? [];

  const related = product.category_id
    ? await getRelatedProducts(product.category_id, product.id)
    : [];

  const specs = primaryVariant
    ? [
        { label: "Shape", value: primaryVariant.shape },
        { label: "Carat Weight", value: formatCarat(primaryVariant.carat_weight) },
        {
          label: "Dimensions",
          value: formatDimensions(primaryVariant.length_mm, primaryVariant.width_mm, primaryVariant.depth_mm),
        },
        { label: "Color", value: primaryVariant.color },
        { label: "Color Grade", value: primaryVariant.color_grade },
        { label: "Clarity", value: primaryVariant.clarity },
        { label: "Treatment", value: primaryVariant.treatment },
        { label: "Origin", value: primaryVariant.origin },
        { label: "Cut Grade", value: primaryVariant.cut_grade },
      ].filter((s) => s.value)
    : [];

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-10">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          {
            label: product.category?.name ?? "Products",
            href: `/products?category=${product.category?.slug ?? ""}`,
          },
          { label: product.name },
        ]}
      />

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <GemImageGallery images={allImages} productName={product.name} />
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <h1
              className="text-[32px] md:text-[40px] font-bold text-[var(--color-text-primary)] leading-tight mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {product.name}
            </h1>
            {primaryVariant && (
              <p className="text-2xl font-semibold text-[var(--color-text-primary)]">
                {formatPrice(primaryVariant.price)}
                {primaryVariant.compare_at_price && (
                  <span className="text-base text-[var(--color-text-muted)] line-through ml-3">
                    {formatPrice(primaryVariant.compare_at_price)}
                  </span>
                )}
              </p>
            )}
          </div>

          {product.variants && product.variants.length > 1 && (
            <div>
              <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] font-medium mb-2">
                Available Variants
              </p>
              <div className="flex flex-wrap gap-2">
                {product.variants.filter((v) => v.is_active).map((v) => (
                  <div
                    key={v.id}
                    className="px-3 py-1.5 border border-[var(--color-border)] rounded-[6px] text-sm cursor-pointer hover:border-[var(--color-accent)]"
                  >
                    {v.shape} / {formatCarat(v.carat_weight)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {primaryVariant && <AddToCartSection variant={primaryVariant} />}

          {specs.length > 0 && (
            <div className="mt-2">
              <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] font-medium mb-3">
                Specifications
              </p>
              <table className="w-full text-sm border border-[var(--color-border)] rounded-[8px] overflow-hidden">
                <tbody>
                  {specs.map((spec, i) => (
                    <tr
                      key={spec.label}
                      className={`${i % 2 === 0 ? "bg-white" : "bg-[var(--color-surface)]"} border-b border-[var(--color-border)] last:border-0`}
                    >
                      <td className="px-4 py-2.5 font-medium text-[var(--color-text-secondary)] w-36">
                        {spec.label}
                      </td>
                      <td className="px-4 py-2.5 text-[var(--color-text-primary)] capitalize">
                        {spec.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {product.description && (
            <div>
              <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] font-medium mb-2">
                Description
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2
            className="text-2xl font-bold text-[var(--color-text-primary)] mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Related Gems
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
