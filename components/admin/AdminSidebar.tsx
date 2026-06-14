"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faGem,
  faReceipt,
  faUsers,
  faWarehouse,
  faTag,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: faChartLine, exact: true },
  { href: "/admin/products", label: "Products", icon: faGem },
  { href: "/admin/categories", label: "Categories", icon: faTag },
  { href: "/admin/orders", label: "Orders", icon: faReceipt },
  { href: "/admin/customers", label: "Customers", icon: faUsers },
  { href: "/admin/inventory", label: "Inventory", icon: faWarehouse },
];

interface AdminSidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const content = (
    <div className="flex flex-col h-full">
      <div className="h-12 flex items-center px-5 border-b border-[var(--color-border)] flex-shrink-0 justify-between">
        <span
          className="text-[16px] font-bold text-[var(--color-text-primary)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Gemstone Empire
        </span>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-[var(--color-text-muted)]">
            <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
          </button>
        )}
      </div>
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-[6px] text-sm font-medium mb-0.5 transition-colors",
                active
                  ? "bg-[var(--color-accent-light)] text-[var(--color-accent)]"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)]"
              )}
            >
              <FontAwesomeIcon icon={item.icon} className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-[var(--color-border)]">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
        >
          ← Back to Storefront
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-col w-[240px] flex-shrink-0 h-screen sticky top-0 bg-white border-r border-[var(--color-border)]">
        {content}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
          />
          <div className="absolute top-0 left-0 h-full w-[240px] bg-white">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
