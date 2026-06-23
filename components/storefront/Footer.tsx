import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faPhone,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

export function Footer() {
  const year = new Date().getFullYear();

  const columns = {
    shop: [
      { label: "All Gemstones", href: "/products" },
      { label: "Sapphire", href: "/products?category=sapphire" },
      { label: "Ruby", href: "/products?category=ruby" },
      { label: "Emerald", href: "/products?category=emerald" },
      { label: "Spinel", href: "/products?category=spinel" },
    ],
    policies: [
      { label: "Shipping Info", href: "/shipping" },
      { label: "Return Policy", href: "/returns" },
      { label: "Payment Options", href: "/payments" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
    about: [
      { label: "Who We Are", href: "/about" },
      { label: "Customer Reviews", href: "/" },
      { label: "Contact Us", href: "/contact" },
    ],
    resources: [
      { label: "Gemstone Info", href: "/products" },
      { label: "Education & Guides", href: "/products" },
      { label: "Sitemap", href: "/sitemap" },
    ],
  };

  const languages = [
    "English",
    "Français",
    "Español",
    "Italiano",
    "Deutsch",
    "Русский",
    "中文",
    "日本語",
    "Svenska",
    "Português",
    "Polski",
  ];

  return (
    <footer className="text-white mt-auto text-left" style={{ backgroundColor: "#004D2B" }}>
      {/* Top Main Section */}
      <div className="max-w-screen-xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Shop */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider mb-4 text-emerald-300">Shop</h4>
            <ul className="space-y-2 text-xs text-emerald-100/80">
              {columns.shop.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:underline hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider mb-4 text-emerald-300">Policies</h4>
            <ul className="space-y-2 text-xs text-emerald-100/80">
              {columns.policies.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:underline hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Who We Are */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider mb-4 text-emerald-300">Who We Are</h4>
            <ul className="space-y-2 text-xs text-emerald-100/80">
              {columns.about.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:underline hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider mb-4 text-emerald-300">Resources</h4>
            <ul className="space-y-2 text-xs text-emerald-100/80">
              {columns.resources.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:underline hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Located At */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="text-xs font-black uppercase tracking-wider mb-4 text-emerald-300">Located At</h4>
            <ul className="space-y-3 text-xs text-emerald-100/80">
              <li className="flex items-start gap-2">
                <FontAwesomeIcon icon={faLocationDot} className="w-3.5 h-3.5 mt-0.5 text-emerald-300" />
                <span>Hampshire, United States</span>
              </li>
              <li className="flex items-center gap-2">
                <FontAwesomeIcon icon={faPhone} className="w-3.5 h-3.5 text-emerald-300" />
                <span>+1 (603) 814-8360</span>
              </li>
              <li className="flex items-center gap-2">
                <FontAwesomeIcon icon={faEnvelope} className="w-3.5 h-3.5 text-emerald-300" />
                <span>info@gemstoneempire.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="text-xs font-black uppercase tracking-wider mb-4 text-emerald-300">Stay in Touch</h4>
            <p className="text-[10px] text-emerald-200/70 mb-3 leading-relaxed">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full bg-white text-gray-800 text-xs px-3 py-2 rounded-l-md outline-none"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold px-3 py-2 rounded-r-md transition-colors"
              >
                Go
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Language translation selector row */}
      <div className="border-t border-white/10 py-4 bg-black/10">
        <div className="max-w-screen-xl mx-auto px-6 text-center text-[10px] text-emerald-200/60 flex flex-wrap justify-center gap-x-2 gap-y-1">
          {languages.map((lang, idx) => (
            <span key={lang}>
              <span className="hover:underline hover:text-white cursor-pointer">{lang}</span>
              {idx < languages.length - 1 && <span className="text-white/10 ml-2">|</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Copyright Disclaimer Bar */}
      <div className="border-t border-white/10 py-6 text-center">
        <div className="max-w-screen-xl mx-auto px-6 space-y-2">
          <p className="text-[10px] text-emerald-200/50">
            Copyright © {year === 2026 ? "2026" : `2026-${year}`} GemstoneEmpire.com. All rights reserved.
          </p>
          <p className="text-[9px] text-emerald-200/30 max-w-xl mx-auto leading-relaxed">
            Reproduction or reuse of any photos, graphics or written text without written consent of GemstoneEmpire.com is strictly prohibited. All items are shipped with fully insured tracking.
          </p>
        </div>
      </div>
    </footer>
  );
}
