"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBagShopping,
  faMagnifyingGlass,
  faBars,
  faXmark,
  faChevronDown,
  faPhone,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { faCircleUser as faCircleUserReg } from "@fortawesome/free-regular-svg-icons";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import type { Category } from "@/types";

interface HeaderProps {
  categories?: Category[];
}

export function Header({ categories = [] }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { itemCount } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Top utility bar — dark green */}
      <div className="text-white bg-[#004D2B]">
        <div className="max-w-screen-xl mx-auto px-6 h-9 flex items-center justify-between text-xs">
          <div className="hidden sm:flex items-center gap-4">
            <a
              href="tel:+16038148360"
              className="flex items-center gap-1.5 hover:text-emerald-200 transition-colors"
            >
              <FontAwesomeIcon icon={faPhone} className="w-3 h-3 text-emerald-300" />
              +1 (603) 814-8360
            </a>
            <a
              href="mailto:info@gemstoneempire.com"
              className="flex items-center gap-1.5 hover:text-emerald-200 transition-colors"
            >
              <FontAwesomeIcon icon={faEnvelope} className="w-3 h-3 text-emerald-300" />
              info@gemstoneempire.com
            </a>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <Link
              href={user ? "/account" : "/login"}
              className="hover:text-emerald-200 transition-colors"
            >
              {user ? "My Account" : "Sign In / Register"}
            </Link>
            <Link
              href="/contact"
              className="hover:text-emerald-200 transition-colors hidden sm:inline"
            >
              Help & Contact
            </Link>
          </div>
        </div>
      </div>

      {/* Main header — white */}
      <header className="sticky top-0 z-40 bg-white border-b border-[var(--color-border)] shadow-sm">
        <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2L24.5 10L16 30L7.5 10L16 2Z" fill="#00A896" />
              <path d="M16 2L20.5 10H11.5L16 2Z" fill="#028090" />
              <path d="M7.5 10H11.5L16 30L7.5 10Z" fill="#004D2B" />
              <path d="M24.5 10H20.5L16 30L24.5 10Z" fill="#008C52" />
            </svg>
            <div className="flex items-center">
              <span className="text-xl font-extrabold text-[#00A896] tracking-tight uppercase">Gemstone</span>
              <span className="text-xl font-medium text-[#004D2B] tracking-tight uppercase ml-1">Empire</span>
            </div>
          </Link>

          {/* Search bar in middle — Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-lg mx-6 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gemstones by name, shape, origin, color..."
              className="w-full border-2 border-[#004D2B] rounded-l-md px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-200"
            />
            <button
              type="submit"
              className="bg-[#004D2B] hover:bg-[#00331C] text-white px-5 py-2 border-2 border-[#004D2B] rounded-r-md transition-colors"
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} className="w-4 h-4" />
            </button>
          </form>

          {/* Right icons */}
          <div className="flex items-center gap-6 flex-shrink-0">
            {/* Mobile Search Toggle */}
            <button
              aria-label="Search"
              className="md:hidden p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} className="w-5 h-5" />
            </button>

            {/* Account */}
            <Link
              href={user ? "/account" : "/login"}
              className="hidden sm:flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[#006B3F] transition-colors"
            >
              <FontAwesomeIcon icon={faCircleUserReg} className="w-5 h-5" />
              <span className="hidden lg:inline text-xs font-semibold uppercase tracking-wider">
                {user ? "My Account" : "Sign In"}
              </span>
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[#006B3F] transition-colors"
            >
              <div className="relative">
                <FontAwesomeIcon icon={faBagShopping} className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-[#FF6B35] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="hidden lg:inline text-xs font-semibold uppercase tracking-wider">Cart</span>
            </Link>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 text-[var(--color-text-secondary)] hover:text-[#006B3F]"
              aria-label="Menu"
              onClick={() => setMobileOpen(true)}
            >
              <FontAwesomeIcon icon={faBars} className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search bar dropdown — Mobile only */}
        {searchOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-[var(--color-border)] px-6 py-3 z-50 shadow-sm">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search gemstones..."
                className="flex-1 rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2 bg-[#004D2B] text-white text-sm rounded-lg font-medium"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="px-2 text-[var(--color-text-muted)]"
              >
                <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Solid green navigation bar — Desktop only */}
        <div className="hidden md:block bg-[#004D2B] text-white">
          <div className="max-w-screen-xl mx-auto px-6 h-10 flex items-center justify-between text-sm font-semibold">
            <div className="flex items-center gap-8">
              <Link href="/" className="hover:text-emerald-200 transition-colors py-2">Home</Link>
              <Link href="/products" className="hover:text-emerald-200 transition-colors py-2">All Gemstones</Link>
              <div className="relative group py-2">
                <button className="flex items-center gap-1 hover:text-emerald-200 transition-colors cursor-pointer">
                  Categories
                  <FontAwesomeIcon icon={faChevronDown} className="w-2.5 h-2.5" />
                </button>
                <div className="absolute top-full left-0 mt-0 w-52 bg-white border border-gray-200 rounded-b-md shadow-lg py-1 z-50 hidden group-hover:block text-[var(--color-text-primary)] font-normal">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.slug}`}
                      className="block px-4 py-2 text-sm hover:bg-[#E6F5EE] hover:text-[#006B3F] transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
              <Link href="/contact" className="hover:text-emerald-200 transition-colors py-2">Contact</Link>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-emerald-200/90">
              <span>Free Worldwide Shipping on Orders Over $500</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-0 left-0 h-full w-80 bg-white flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 h-16 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-2">
                <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 2L24.5 10L16 30L7.5 10L16 2Z" fill="#00A896" />
                  <path d="M16 2L20.5 10H11.5L16 2Z" fill="#028090" />
                  <path d="M7.5 10H11.5L16 30L7.5 10Z" fill="#004D2B" />
                  <path d="M24.5 10H20.5L16 30L24.5 10Z" fill="#008C52" />
                </svg>
                <div className="flex items-center">
                  <span className="text-base font-extrabold text-[#00A896] tracking-tight uppercase">Gemstone</span>
                  <span className="text-base font-medium text-[#004D2B] tracking-tight uppercase ml-1">Empire</span>
                </div>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 hover:bg-[var(--color-surface)] rounded-lg"
              >
                <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex flex-col px-5 py-4 gap-1 flex-1 overflow-y-auto">
              <Link
                href="/"
                className="py-3 px-2 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-[#E6F5EE] hover:text-[#006B3F] rounded-lg transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/products"
                className="py-3 px-2 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-[#E6F5EE] hover:text-[#006B3F] rounded-lg transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                All Gemstones
              </Link>
              <div className="py-2 px-2">
                <p className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-semibold mb-2">
                  Categories
                </p>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/products?category=${cat.slug}`}
                    className="block py-2 px-2 text-sm text-[var(--color-text-secondary)] hover:text-[#006B3F] hover:bg-[#E6F5EE] rounded-lg"
                    onClick={() => setMobileOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
              <Link
                href="/contact"
                className="py-3 px-2 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-[#E6F5EE] hover:text-[#006B3F] rounded-lg transition-colors border-t border-[var(--color-border)] mt-2"
                onClick={() => setMobileOpen(false)}
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
