"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBagShopping,
  faMagnifyingGlass,
  faCircleUser,
  faBars,
  faXmark,
  faChevronDown,
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
  const [catOpen, setCatOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { itemCount } = useCart();
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
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
      <header className="sticky top-0 z-40 h-16 bg-white border-b border-[var(--color-border)] flex items-center">
        <div className="w-full max-w-screen-xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="font-[var(--font-display)] text-[20px] font-bold text-[var(--color-text-primary)] tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Gemstone Empire
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              href="/products"
              className="text-sm font-medium text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors"
            >
              Products
            </Link>
            <div className="relative">
              <button
                className="flex items-center gap-1 text-sm font-medium text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors"
                onClick={() => setCatOpen(!catOpen)}
                onBlur={() => setTimeout(() => setCatOpen(false), 150)}
              >
                Categories
                <FontAwesomeIcon icon={faChevronDown} className="w-3 h-3" />
              </button>
              {catOpen && categories.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-[var(--color-border)] rounded-[6px] shadow-sm py-1 z-50">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.slug}`}
                      className="block px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]"
                      onClick={() => setCatOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link
              href="/contact"
              className="text-sm font-medium text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-3">
            <button
              aria-label="Search"
              className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} className="w-[18px] h-[18px]" />
            </button>

            <Link
              href={user ? "/account" : "/login"}
              aria-label="Account"
              className="hidden lg:flex p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              <FontAwesomeIcon icon={faCircleUserReg} className="w-[18px] h-[18px]" />
            </Link>

            <Link
              href="/cart"
              aria-label={`Cart (${itemCount} items)`}
              className="relative p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              <FontAwesomeIcon icon={faBagShopping} className="w-[18px] h-[18px]" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[var(--color-accent)] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </Link>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 text-[var(--color-text-secondary)]"
              aria-label="Menu"
              onClick={() => setMobileOpen(true)}
            >
              <FontAwesomeIcon icon={faBars} className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search bar dropdown */}
        {searchOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-[var(--color-border)] px-6 py-3 z-50">
            <form onSubmit={handleSearch} className="max-w-screen-xl mx-auto flex gap-2">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search gemstones..."
                className="flex-1 rounded-[6px] border border-[var(--color-border)] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[var(--color-accent)] text-white text-sm rounded-[6px] font-medium"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="px-2 py-2 text-[var(--color-text-muted)]"
              >
                <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-0 left-0 h-full w-72 bg-white flex flex-col">
            <div className="flex items-center justify-between px-5 h-16 border-b border-[var(--color-border)]">
              <span
                className="text-[18px] font-bold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Gemstone Empire
              </span>
              <button onClick={() => setMobileOpen(false)}>
                <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex flex-col px-5 py-4 gap-1">
              <Link
                href="/products"
                className="py-3 text-sm font-medium border-b border-[var(--color-border)]"
                onClick={() => setMobileOpen(false)}
              >
                Products
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="py-2 text-sm text-[var(--color-text-secondary)] pl-2"
                  onClick={() => setMobileOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
              <Link
                href="/contact"
                className="py-3 text-sm font-medium border-t border-[var(--color-border)] mt-2"
                onClick={() => setMobileOpen(false)}
              >
                Contact
              </Link>
              <Link
                href={user ? "/account" : "/login"}
                className="py-3 text-sm font-medium"
                onClick={() => setMobileOpen(false)}
              >
                {user ? "My Account" : "Sign In"}
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
