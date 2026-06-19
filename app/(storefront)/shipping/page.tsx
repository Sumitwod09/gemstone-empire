import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "Shipping Information — Gemstone Empire",
  description: "Read details on our secured, fully insured worldwide courier delivery and packaging standards.",
};

export default function ShippingPage() {
  return (
    <div className="max-w-screen-md mx-auto px-6 py-16 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl font-logo text-[#004D2B]">
          SHIPPING INFORMATION
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          Every purchase is shipped with maximum security, discrete packaging, and full value insurance.
        </p>
        <div className="w-16 h-1 bg-[#00A896] mx-auto rounded-full mt-4"></div>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-3 font-logo">
          Rates & Delivery Estimates
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-gray-800 font-semibold">
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Courier Service</th>
                <th className="py-3 px-4">Est. Delivery</th>
                <th className="py-3 px-4">Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-900">United States</td>
                <td className="py-3 px-4">FedEx Priority Insured</td>
                <td className="py-3 px-4">2 - 3 Business Days</td>
                <td className="py-3 px-4">Free ($500+ orders) / $25</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-900">Canada / Europe / Australia</td>
                <td className="py-3 px-4">DHL Express Secured</td>
                <td className="py-3 px-4">3 - 5 Business Days</td>
                <td className="py-3 px-4">Free ($500+ orders) / $45</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-900">India / Russia / South Africa</td>
                <td className="py-3 px-4">Insured Express Courier</td>
                <td className="py-3 px-4">5 - 8 Business Days</td>
                <td className="py-3 px-4">Free ($500+ orders) / $55</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-3 font-logo">
          Security & Handling Protocols
        </h2>
        <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
          <p>
            <strong>Discrete & Tamper-Proof Packaging:</strong> To safeguard your valuable assets, all gemstones are shipped inside high-security, heavy-duty tamper-evident parcels. The external packaging is completely neutral, listing no mention of "Gemstone", "Jewelry" or "Empire" on the shipping label.
          </p>
          <p>
            <strong>Full Value Insurance:</strong> All orders are covered by our comprehensive private cargo insurance from the moment they leave our facility in Hampshire, US, until they are signed for at your address. An adult signature is strictly required upon delivery.
          </p>
          <p>
            <strong>Customs & Import Duties:</strong> For international orders outside the United States, customs clearances and regional duties are the buyer's responsibility. We provide correct HS customs codes and documentation to ensure swift customs clearance.
          </p>
        </div>
      </section>

      <div className="text-center pt-6">
        <Link href="/products">
          <Button size="lg" className="px-8 font-bold">
            Start Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}
