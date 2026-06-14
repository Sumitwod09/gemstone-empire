import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getFeaturedProducts, getCategories } from "@/lib/db";
import { ProductCard } from "@/components/storefront/ProductCard";
import { Button } from "@/components/ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGem,
  faShieldHalved,
  faTruck,
  faMedal,
} from "@fortawesome/free-solid-svg-icons";

export const metadata: Metadata = {
  title: "Gemstone Empire — Premium Loose Gemstones",
  description:
    "Shop certified loose precious and semi-precious gemstones. Ruby, sapphire, emerald and more from top origins worldwide.",
};

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative bg-[var(--color-surface)] py-24 px-6 overflow-hidden">
        <div className="max-w-screen-xl mx-auto">
          <div className="max-w-xl">
            <p className="text-sm font-medium text-[var(--color-accent)] uppercase tracking-widest mb-3">
              Premium Loose Gemstones
            </p>
            <h1
              className="text-5xl md:text-6xl font-bold text-[var(--color-text-primary)] leading-tight mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Every Gem Tells a Story
            </h1>
            <p className="text-lg text-[var(--color-text-secondary)] mb-8 leading-relaxed">
              Ethically sourced rubies, sapphires, emeralds, and rare collector
              specimens. Each stone individually graded and photographed.
            </p>
            <Link href="/products">
              <Button size="lg">Shop Now</Button>
            </Link>
          </div>
        </div>
        <div className="absolute -right-16 top-1/2 -translate-y-1/2 w-96 h-96 opacity-5 pointer-events-none">
          <FontAwesomeIcon icon={faGem} className="w-full h-full text-[var(--color-accent)]" />
        </div>
      </section>

      {/* Value propositions */}
      <section className="border-y border-[var(--color-border)] bg-white">
        <div className="max-w-screen-xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: faMedal, title: "Certified Quality", desc: "Every gem graded by experts" },
              { icon: faTruck, title: "Worldwide Shipping", desc: "Insured, tracked delivery" },
              { icon: faShieldHalved, title: "Secure Payment", desc: "Powered by Razorpay" },
              { icon: faGem, title: "Direct Sourcing", desc: "Ethical origin guarantee" },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center text-center gap-2 py-2">
                <FontAwesomeIcon
                  icon={item.icon}
                  className="w-6 h-6 text-[var(--color-accent)]"
                />
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                  {item.title}
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Gems */}
      {featuredProducts.length > 0 && (
        <section className="py-16 px-6">
          <div className="max-w-screen-xl mx-auto">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs uppercase tracking-widest text-[var(--color-accent)] font-medium mb-1">
                  Curated Selection
                </p>
                <h2
                  className="text-3xl font-bold text-[var(--color-text-primary)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Featured Gems
                </h2>
              </div>
              <Link
                href="/products"
                className="text-sm text-[var(--color-accent)] hover:underline font-medium hidden sm:block"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Shop by Category */}
      {categories.length > 0 && (
        <section className="py-16 px-6 bg-[var(--color-surface)]">
          <div className="max-w-screen-xl mx-auto">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest text-[var(--color-accent)] font-medium mb-1">
                Browse
              </p>
              <h2
                className="text-3xl font-bold text-[var(--color-text-primary)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Shop by Category
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="group bg-white border border-[var(--color-border)] hover:border-[var(--color-border-strong)] rounded-[8px] overflow-hidden transition-colors"
                >
                  {cat.image_url ? (
                    <div className="aspect-square relative overflow-hidden bg-[var(--color-surface)]">
                      <Image
                        src={cat.image_url}
                        alt={cat.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square bg-[var(--color-accent-light)] flex items-center justify-center">
                      <FontAwesomeIcon icon={faGem} className="w-10 h-10 text-[var(--color-accent)] opacity-40" />
                    </div>
                  )}
                  <div className="p-3">
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                      {cat.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
