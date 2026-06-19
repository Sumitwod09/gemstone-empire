import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/db";
import { GemImageGallery } from "@/components/storefront/GemImageGallery";
import { Breadcrumb } from "@/components/storefront/Breadcrumb";
import { ProductCard } from "@/components/storefront/ProductCard";
import { AddToCartSection } from "./AddToCartSection";
import { formatCarat, formatDimensions } from "@/lib/utils";
import { Price } from "@/components/storefront/Price";

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
        { label: "Product ID", value: primaryVariant.sku },
        { label: "Gemstone Cut", value: primaryVariant.shape },
        { label: "Carat Weight", value: formatCarat(primaryVariant.carat_weight) },
        {
          label: "Size (mm)",
          value: formatDimensions(primaryVariant.length_mm, primaryVariant.width_mm, primaryVariant.depth_mm),
        },
        { label: "Color", value: primaryVariant.color },
        { label: "Color Grade", value: primaryVariant.color_grade },
        { label: "Clarity", value: primaryVariant.clarity },
        { label: "Treatment", value: primaryVariant.treatment },
        { label: "Origin", value: primaryVariant.origin },
      ].filter((s) => s.value)
    : [];

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-6 text-left">
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

      {/* Main product title above the columns */}
      <div className="mt-4 border-b border-gray-200 pb-4">
        <h1
          className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {primaryVariant
            ? `${formatCarat(primaryVariant.carat_weight)} Natural ${product.name}, ${primaryVariant.shape} Cut, ${primaryVariant.length_mm}x${primaryVariant.width_mm} mm`
            : product.name}
        </h1>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image/Video gallery + magnification warning (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-gray-200 rounded-md overflow-hidden p-2 shadow-sm">
            <GemImageGallery images={allImages} productName={product.name} />
          </div>

          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-xs text-yellow-800 flex items-start gap-2 shadow-sm">
            <svg
              className="w-4 h-4 mt-0.5 text-yellow-600 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>
              <strong>Warning:</strong> Gemstones shown in images/videos are magnified to display details. Please refer to specifications table for exact millimeter dimensions.
            </span>
          </div>
        </div>

        {/* Right Column: Spec Table + Purchase Box (lg:col-span-7) */}
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Specifications Table */}
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">
              SPECIFICATIONS
            </p>
            <table className="w-full text-xs border border-gray-200 rounded overflow-hidden shadow-sm">
              <tbody>
                {specs.map((spec, i) => (
                  <tr
                    key={spec.label}
                    className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50"} border-b border-gray-100 last:border-0`}
                  >
                    <td className="px-3 py-2 font-bold text-gray-700 w-32 border-r border-gray-100">
                      {spec.label}
                    </td>
                    <td className="px-3 py-2 text-gray-900 capitalize font-medium">
                      {spec.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Trust box & Add to Cart */}
          <div className="space-y-4">
            {/* Purchase / Price block */}
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4 shadow-sm space-y-3">
              <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">
                PRICING & STATUS
              </p>
              {primaryVariant && (
                <div className="space-y-1">
                  <p className="text-3xl font-extrabold text-[#006B3F]">
                    <Price amount={primaryVariant.price} />
                  </p>
                  <p className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block animate-pulse"></span>
                    Item in Stock — Ready to Ship
                  </p>
                </div>
              )}

              {primaryVariant && <AddToCartSection variant={primaryVariant} />}
            </div>

            {/* Check all details box */}
            <div className="bg-white border border-gray-200 rounded-md p-4 shadow-sm space-y-3">
              <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                ✓ Check all details
              </p>
              <ul className="text-xs text-gray-600 space-y-2">
                <li className="flex items-center gap-1.5 font-semibold text-emerald-800">
                  <span className="text-[#006B3F]">✓</span> Insured certified gemstone
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-[#006B3F]">✓</span> Item status: <span className="font-bold text-gray-800">AVAILABLE</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#006B3F]">✓</span> Accepted methods: <span className="font-bold text-gray-800">Alipay, PayPal, Visa, Western Union</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-[#006B3F]">✓</span> Insured worldwide shipping
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Description section full-width below */}
      {product.description && (
        <section className="mt-10 border-t border-gray-200 pt-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Product Description</h2>
          <p className="text-sm text-gray-600 leading-relaxed max-w-4xl">
            {product.description}
          </p>
        </section>
      )}

      {/* Related Gems */}
      {related.length > 0 && (
        <section className="mt-12 border-t border-gray-200 pt-8">
          <h2
            className="text-lg font-bold text-gray-900 mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Related Gemstones
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
