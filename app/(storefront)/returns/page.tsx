import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "Return Policy — Gemstone Empire",
  description: "Learn about our worry-free 30-day return policy and step-by-step return instructions.",
};

export default function ReturnsPage() {
  return (
    <div className="max-w-screen-md mx-auto px-6 py-16 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl font-logo text-[#004D2B]">
          RETURN & REFUND POLICY
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          We want you to be completely spellbound by your gemstone. If not, enjoy our hassle-free 30-day returns.
        </p>
        <div className="w-16 h-1 bg-[#00A896] mx-auto rounded-full mt-4"></div>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-3 font-logo">
          30-Day Inspection Window
        </h2>
        <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
          <p>
            You have a full 30 days from the date of receiving your parcel to inspect the gemstone. We recommend examining the stone under natural day-light conditions and using a standard 10x gemological loupe.
          </p>
          <p>
            To qualify for a full refund, the gemstone must be in its <strong>original, unaltered, and undamaged condition</strong>. Stones that have been set in jewelry, recut, chipped, heated, or altered in any manner cannot be accepted for returns.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-3 font-logo">
          How to Process a Return
        </h2>
        <ol className="list-decimal list-inside text-sm text-gray-600 space-y-3 leading-relaxed">
          <li>
            <strong>Contact Support:</strong> Email us at <a href="mailto:returns@gemstoneempire.com" className="text-emerald-700 underline font-medium">returns@gemstoneempire.com</a> with your order number to request a Return Authorization Number (RAN).
          </li>
          <li>
            <strong>Receive Insured Return Label:</strong> We will provide a fully insured pre-paid FedEx return shipping label and package instructions.
          </li>
          <li>
            <strong>Package Securely:</strong> Pack the gemstone, the original laboratory certificate, and invoice in the original box. Note: Returning a stone without its original certificate will incur a $150 replacement fee.
          </li>
          <li>
            <strong>Inspection & Refund:</strong> Upon receipt, our in-house gemologists will verify that the gemstone matches our database records. Once cleared, your refund is processed to your original payment method within 3-5 business days.
          </li>
        </ol>
      </section>

      <div className="text-center pt-6">
        <Link href="/contact">
          <Button size="lg" className="px-8 font-bold">
            Contact Return Department
          </Button>
        </Link>
      </div>
    </div>
  );
}
