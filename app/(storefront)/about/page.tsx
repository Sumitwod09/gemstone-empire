import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "Who We Are — Gemstone Empire",
  description: "Learn about the heritage, commitment, and master-certified sourcing behind Gemstone Empire.",
};

export default function AboutPage() {
  return (
    <div className="max-w-screen-md mx-auto px-6 py-16 space-y-12">
      {/* Hero section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl font-logo text-[#004D2B]">
          WHO WE ARE
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          Since 2005, Gemstone Empire has curated the world's most exceptional loose natural gemstones for collectors and connoisseurs.
        </p>
        <div className="w-16 h-1 bg-[#00A896] mx-auto rounded-full mt-4"></div>
      </div>

      {/* Legacy and Heritage */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-3 font-logo">
          Our Legacy & Sourcing
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600 leading-relaxed">
          <p>
            For over two decades, our experts have traveled directly to the legendary mines of Colombia, Sri Lanka (Ceylon), Mozambique, Madagascar, and Burma to select only the finest rubies, sapphires, emeralds, and spinels. By procuring gemstones directly at the source, we ensure absolute natural origin and offer unbeatable pricing.
          </p>
          <p>
            We believe that every precious gemstone tells a story. Our collection strictly comprises natural, certified stones that are chosen for their outstanding brilliance, rarity, and crystal purity. We maintain standard ethical-sourcing protocols for every single item.
          </p>
        </div>
      </section>

      {/* The Empire Standard */}
      <section className="bg-emerald-50 rounded-xl p-8 border border-emerald-100 space-y-6">
        <h2 className="text-2xl font-bold text-[#004D2B] font-logo">
          The Empire Standard
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h3 className="font-bold text-[#004D2B] text-sm uppercase">100% Certified</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Every gemstone is accompanied by an independent, world-renowned laboratory certificate (GIA, GRS, SSEF) verifying its authenticity and treatment profile.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-[#004D2B] text-sm uppercase">Fully Insured</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              All international shipments are fully insured and sent via secured couriers (FedEx/DHL) with end-to-end tracking to your doorstep.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-[#004D2B] text-sm uppercase">30-Day Returns</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Enjoy complete peace of mind with our no-questions-asked 30-day return policy. If you aren't completely captivated, return it for a full refund.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <div className="text-center pt-6">
        <Link href="/products">
          <Button size="lg" className="px-8 font-bold">
            Explore the Collection
          </Button>
        </Link>
      </div>
    </div>
  );
}
