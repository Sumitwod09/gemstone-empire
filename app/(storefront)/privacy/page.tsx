import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy Policy — Gemstone Empire",
  description: "Read about our client privacy commitments, security standards, and personal data management policies.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-screen-md mx-auto px-6 py-16 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl font-logo text-[#004D2B]">
          PRIVACY POLICY
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          Your personal details, purchases, and security are held in absolute confidentiality.
        </p>
        <div className="w-16 h-1 bg-[#00A896] mx-auto rounded-full mt-4"></div>
      </div>

      <section className="space-y-6 text-sm text-gray-600 leading-relaxed">
        <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-3 font-logo">
          1. Information We Collect
        </h2>
        <p>
          We collect information you provide directly to us when making a purchase, creating an account, subscribing to our newsletters, or contacting client services. This includes name, email address, postal address, billing address, phone number, and payment details.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-3 pt-4 font-logo">
          2. How We Use Your Information
        </h2>
        <p>
          We use your data strictly to process and ship orders, handle secure payouts, manage accounts, prevent fraudulent attempts, respond to customer inquiries, and send promotional newsletters (which you can opt-out of at any time). We will <strong>never sell or rent your personal information</strong> to third parties.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-3 pt-4 font-logo">
          3. Security Measures
        </h2>
        <p>
          We implement industry-grade security measures including Secure Socket Layer (SSL) encryption, firewalls, and tokens to shield your data. Financial checkout details are securely processed directly by our merchant bank providers (Stripe/Razorpay) and are never stored on our servers.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-3 pt-4 font-logo">
          4. Cookies and Location Detection
        </h2>
        <p>
          Our store utilizes standard cookies to remember items in your cart, persist currency preferences, and detect user region/location to display prices in local currency. You can disable cookies in your browser settings if preferred.
        </p>
      </section>

      <div className="text-center pt-6">
        <Link href="/products">
          <Button size="lg" className="px-8 font-bold">
            Return to Store
          </Button>
        </Link>
      </div>
    </div>
  );
}
