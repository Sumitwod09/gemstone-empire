import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { getFeaturedProducts } from "@/lib/db";
import { MOCK_REVIEWS } from "@/lib/mock-data";
import { TrustBar } from "@/components/storefront/TrustBar";
import { Button } from "@/components/ui";

// Dynamically import below-the-fold components with fallback placeholders for instant initial page paint
const ReviewCard = dynamic(
  () => import("@/components/storefront/ReviewCard").then((mod) => mod.ReviewCard),
  {
    loading: () => <div className="h-48 bg-white border border-gray-100 rounded-md animate-pulse" />,
    ssr: true,
  }
);

const PartnerLogos = dynamic(
  () => import("@/components/storefront/PartnerLogos").then((mod) => mod.PartnerLogos),
  {
    loading: () => <div className="h-28 bg-white animate-pulse" />,
    ssr: true,
  }
);

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";

export const metadata: Metadata = {
  title: "Gemstone Empire — Premium Loose Gemstones",
  description:
    "Shop certified loose precious and semi-precious gemstones. Ruby, sapphire, emerald and more from top origins worldwide.",
};

const BEST_SELLING_CATEGORIES = [
  { name: "Sapphire", count: "1,273", slug: "sapphire", img1: "https://picsum.photos/seed/sapphire1/120/120", img2: "https://picsum.photos/seed/sapphire2/120/120" },
  { name: "Citrine", count: "485", slug: "citrine", img1: "https://picsum.photos/seed/citrine1/120/120", img2: "https://picsum.photos/seed/citrine2/120/120" },
  { name: "Topaz", count: "931", slug: "topaz", img1: "https://picsum.photos/seed/topaz1/120/120", img2: "https://picsum.photos/seed/topaz2/120/120" },
  { name: "Amethyst", count: "654", slug: "amethyst", img1: "https://picsum.photos/seed/amethyst1/120/120", img2: "https://picsum.photos/seed/amethyst2/120/120" },
  { name: "Ruby", count: "1,102", slug: "ruby", img1: "https://picsum.photos/seed/ruby1/120/120", img2: "https://picsum.photos/seed/ruby2/120/120" },
  { name: "Diamond", count: "1,524", slug: "diamond", img1: "https://picsum.photos/seed/diamond1/120/120", img2: "https://picsum.photos/seed/diamond2/120/120" },
  { name: "Peridot", count: "349", slug: "peridot", img1: "https://picsum.photos/seed/peridot1/120/120", img2: "https://picsum.photos/seed/peridot2/120/120" },
  { name: "Spinel", count: "512", slug: "spinel", img1: "https://picsum.photos/seed/spinel1/120/120", img2: "https://picsum.photos/seed/spinel2/120/120" },
];

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      {/* Hero Section */}
      <section className="bg-white py-12 px-6 border-b border-gray-100">
        <div className="max-w-screen-xl mx-auto">
          {/* Main Centered Heading */}
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 text-center leading-tight mb-8"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Natural Loose Gemstones for Jewelry & Collecting
          </h1>

          {/* 2-Column Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mt-6">
            {/* Left text */}
            <div className="space-y-6 text-center lg:text-left">
              <h2 className="text-xl md:text-2xl font-bold text-[#004D2B] leading-snug">
                Trusted by Jewelers, Designers, Collectors & Gem Enthusiasts Worldwide
              </h2>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                Ethically sourced rubies, sapphires, emeralds, and rare collector
                specimens. Each stone is individually graded and photographed to ensure complete transparency.
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-4 flex-wrap">
                <Link href="/products">
                  <Button size="lg" className="bg-[#004D2B] hover:bg-[#00331C] text-white font-bold px-8 py-3 rounded-md transition-all">
                    Shop Now
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="border-2 border-[#004D2B] text-[#004D2B] hover:bg-emerald-50 font-bold px-8 py-3 rounded-md transition-all"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right gemstone collage */}
            <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
              <Image
                src="/images/gemstone_collage.png"
                alt="Natural Loose Gemstones Collage"
                fill
                priority
                className="object-contain p-4"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <TrustBar />

      {/* Best Selling Gems Categories */}
      <section className="py-14 px-6 bg-white">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-[3px] text-gray-400 font-bold mb-2">
              BEST SELLING GEMS — LAST 30 DAYS
            </p>
            <div className="w-16 h-0.5 bg-[#006B3F] mx-auto mt-2" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {BEST_SELLING_CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={`/products?category=${cat.slug}`}
                className="group bg-white border border-gray-200 hover:border-[#006B3F] rounded-md p-4 transition-all hover:shadow-md flex flex-col items-center justify-between text-center"
              >
                {/* Two Overlapping Gemstone Images */}
                <div className="flex justify-center -space-x-4 mb-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden shadow-md border-2 border-white relative z-10">
                    <Image
                      src={cat.img1}
                      alt={`${cat.name} Sample 1`}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  </div>
                  <div className="w-14 h-14 rounded-full overflow-hidden shadow-md border-2 border-white relative">
                    <Image
                      src={cat.img2}
                      alt={`${cat.name} Sample 2`}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  </div>
                </div>

                <div>
                  <p className="text-sm font-bold text-gray-900 group-hover:text-[#006B3F] transition-colors">
                    {cat.name}
                  </p>
                  <p className="text-xs text-[#006B3F] font-bold mt-1">
                    {cat.count} items
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-14 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-[3px] text-gray-400 font-bold mb-2">
              CERTIFIED CUSTOMER REVIEWS
            </p>
            <div className="w-16 h-0.5 bg-[#006B3F] mx-auto mt-2" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {MOCK_REVIEWS.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </section>

      {/* Partners & Trust */}
      <PartnerLogos />

      {/* CTA Banner */}
      <section className="py-16 px-6 bg-gray-50 border-t border-b border-gray-100">
        <div className="max-w-screen-xl mx-auto text-center space-y-6">
          <h2
            className="text-2xl md:text-3xl font-extrabold text-gray-900"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Enjoy the Largest Online Shop for Natural Gemstones
          </h2>
          <div className="pt-2">
            <Link href="/products">
              <Button
                size="lg"
                className="bg-[#FF6B35] hover:bg-[#E0531F] text-white font-bold px-12 py-4 text-base rounded-md transition-all shadow-md"
              >
                DISCOVER NOW
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* SEO Content / Education */}
      <section className="py-14 px-6 bg-white">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Explore a World of Gems</h2>
              <p>
                Our collection features only authentic, naturally occurring gemstones sourced
                directly from top producing regions including Burma, Sri Lanka, Colombia, Brazil,
                and East Africa. Every stone is individually examined, graded, and photographed.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Gemstones for Sale: A Unique Opportunity</h3>
              <p>
                Whether you&apos;re a jeweller looking for centre stones, a designer seeking
                unique colours, or a collector building an investment portfolio, Gemstone Empire
                offers a curated inventory of rubies, sapphires, emeralds, alexandrites, spinels,
                and tourmalines.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Loose Gemstones for Customized Jewelry</h3>
              <p>
                Buying loose gemstones gives you complete creative freedom. Select the perfect
                stone by shape, carat weight, colour, and origin, then work with your trusted
                jeweller to create a truly bespoke piece.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Invest in Precious Gemstones</h3>
              <p>
                With the value of rare gemstones appreciating over time, purchasing premium loose gems can serve as a wise investment. Our experts are here to guide you in selecting heirloom-quality gemstones.
              </p>
            </div>
          </div>

          {/* Education Banner */}
          <div className="bg-gray-50 border border-gray-200 rounded-md p-8 flex flex-col justify-between items-center text-center">
            <div>
              <p className="text-xs uppercase tracking-[3px] text-gray-400 font-bold mb-4">
                GEMSTONE INFORMATION
              </p>
              <p className="text-xs text-gray-600 leading-relaxed max-w-md">
                The biggest selection of gemstone articles online. Find technical, historical, spiritual and much more details on almost any gemstone available. We cover virtually every topic surrounding gemstones. Free gemstone education is just one click away.
              </p>
            </div>

            <Link href="/products" className="w-full max-w-sm bg-white border border-gray-300 hover:border-[#006B3F] hover:shadow-md rounded p-6 flex items-center justify-center gap-4 transition-all mt-8">
              <div className="w-12 h-12 bg-emerald-50 text-[#006B3F] rounded-full flex items-center justify-center flex-shrink-0">
                <FontAwesomeIcon icon={faBookOpen} className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black text-gray-800 tracking-widest uppercase">
                EDUCATION
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
