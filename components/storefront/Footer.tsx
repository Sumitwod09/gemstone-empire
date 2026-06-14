import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faPhone } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-surface)] border-t border-[var(--color-border)] mt-auto">
      <div className="max-w-screen-xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <p
              className="text-[18px] font-bold mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Gemstone Empire
            </p>
            <p className="text-sm text-[var(--color-text-secondary)] mb-4 max-w-xs">
              Premium loose gemstones sourced directly from origin. Certified quality, worldwide shipping.
            </p>
            <ul className="flex flex-col gap-2">
              <li className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                <FontAwesomeIcon icon={faLocationDot} className="w-4 h-4 mt-0.5 text-[var(--color-accent)]" />
                Hampshire, United States
              </li>
              <li className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                <FontAwesomeIcon icon={faPhone} className="w-4 h-4 text-[var(--color-accent)]" />
                +1 (603) 814-8360
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-4 uppercase tracking-wide">
              Quick Links
            </p>
            <ul className="flex flex-col gap-2">
              {[
                { href: "/products", label: "All Gemstones" },
                { href: "/search", label: "Search" },
                { href: "/account/orders", label: "Order History" },
                { href: "/account", label: "My Account" },
                { href: "/contact", label: "Contact Us" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories placeholder */}
          <div>
            <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-4 uppercase tracking-wide">
              Shop by Category
            </p>
            <ul className="flex flex-col gap-2">
              {[
                "Ruby",
                "Sapphire",
                "Emerald",
                "Alexandrite",
                "Tourmaline",
              ].map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/products?category=${cat.toLowerCase()}`}
                    className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--color-border)] px-6 py-4">
        <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[var(--color-text-muted)]">
            © {year} Gemstone Empire. All rights reserved.
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">
            Secure checkout powered by Razorpay
          </p>
        </div>
      </div>
    </footer>
  );
}
