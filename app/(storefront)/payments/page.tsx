import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "Payment Options — Gemstone Empire",
  description: "Find secure online payment options, bank wire details, and zero-liability merchant protection.",
};

export default function PaymentsPage() {
  return (
    <div className="max-w-screen-md mx-auto px-6 py-16 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl font-logo text-[#004D2B]">
          PAYMENT OPTIONS
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          We offer secure, encrypted transaction methods to accommodate collectors worldwide.
        </p>
        <div className="w-16 h-1 bg-[#00A896] mx-auto rounded-full mt-4"></div>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-3 font-logo">
          Supported Checkout Methods
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-600 leading-relaxed">
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 space-y-3">
            <h3 className="font-bold text-[#004D2B] text-base">Credit / Debit Cards</h3>
            <p className="text-xs">
              We accept Visa, Mastercard, American Express, and Discover. All transactions are securely processed through Stripe with 256-bit SSL encryption.
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 space-y-3">
            <h3 className="font-bold text-[#004D2B] text-base">Bank Wire Transfer</h3>
            <p className="text-xs">
              For purchases exceeding $10,000, we recommend bank wire transfers. Wire transfers qualify for a <strong>2% direct discount</strong> on the total purchase price. Contact support to request bank routing numbers.
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 space-y-3">
            <h3 className="font-bold text-[#004D2B] text-base">UPI & NetBanking</h3>
            <p className="text-xs">
              For collectors in India, we support seamless instant UPI and NetBanking payments. Payment details are provided on the order confirmation page.
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 space-y-3">
            <h3 className="font-bold text-[#004D2B] text-base">Cryptocurrency Payments</h3>
            <p className="text-xs">
              We accept Bitcoin (BTC) and Ethereum (ETH) via Coinbase Commerce. Cryptographic payments are processed instantly and require adult signature verification on dispatch.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-3 font-logo">
          Fraud & Security Auditing
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          To protect our clients and prevent unauthorized credit card usage, all orders are subject to a standard security review. If your order requires additional identification verification, a member of our security team will contact you. We appreciate your cooperation in maintaining a safe trading environment.
        </p>
      </section>

      <div className="text-center pt-6">
        <Link href="/products">
          <Button size="lg" className="px-8 font-bold">
            Proceed to Collection
          </Button>
        </Link>
      </div>
    </div>
  );
}
