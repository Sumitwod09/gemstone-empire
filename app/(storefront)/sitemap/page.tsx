import type { Metadata } from "next";
import Link from "next/link";
import { getCategories } from "@/lib/db";

export const metadata: Metadata = {
  title: "Sitemap — Gemstone Empire",
  description: "Navigate all pages, gemstone catalogs, and account folders on Gemstone Empire.",
};

export default async function SitemapPage() {
  const categories = await getCategories();

  const primaryPages = [
    { label: "Home", href: "/" },
    { label: "Gemstone Catalog", href: "/products" },
    { label: "Shopping Cart", href: "/cart" },
    { label: "Contact Us", href: "/contact" },
    { label: "Client Account Login / Register", href: "/login" },
  ];

  const adminPages = [
    { label: "Admin Dashboard", href: "/admin" },
    { label: "Product Management", href: "/admin/products" },
    { label: "Category Settings", href: "/admin/categories" },
    { label: "Orders Hub", href: "/admin/orders" },
    { label: "Customer List", href: "/admin/customers" },
    { label: "Inventory Warehouse", href: "/admin/inventory" },
  ];

  const policyPages = [
    { label: "Shipping Info", href: "/shipping" },
    { label: "Return Policy", href: "/returns" },
    { label: "Payment Options", href: "/payments" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Who We Are", href: "/about" },
  ];

  return (
    <div className="max-w-screen-md mx-auto px-6 py-16 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl font-logo text-[#004D2B]">
          WEBSITE SITEMAP
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          Navigate and find any directory, gemstone collection, or informational page.
        </p>
        <div className="w-16 h-1 bg-[#00A896] mx-auto rounded-full mt-4"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm">
        {/* Storefront Pages */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 font-logo">
            Main Pages
          </h2>
          <ul className="space-y-2">
            {primaryPages.map((page) => (
              <li key={page.href}>
                <Link href={page.href} className="text-gray-600 hover:text-emerald-700 transition-colors font-medium">
                  {page.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 font-logo">
            Gemstone Collections
          </h2>
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link href={`/products?category=${cat.slug}`} className="text-gray-600 hover:text-emerald-700 transition-colors capitalize font-medium">
                  Natural {cat.name} Collection
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Care */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 font-logo">
            Customer Information
          </h2>
          <ul className="space-y-2">
            {policyPages.map((page) => (
              <li key={page.href}>
                <Link href={page.href} className="text-gray-600 hover:text-emerald-700 transition-colors font-medium">
                  {page.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Administrative */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 font-logo">
            Administrative Panel
          </h2>
          <ul className="space-y-2">
            {adminPages.map((page) => (
              <li key={page.href}>
                <Link href={page.href} className="text-gray-600 hover:text-emerald-700 transition-colors font-medium">
                  {page.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
