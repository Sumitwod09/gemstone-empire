"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faGem,
  faLayerGroup,
  faReceipt,
  faUsers,
  faBoxes,
  faTag,
  faEnvelope,
  faStar,
  faXmark,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

const NAV_ITEMS: { label: string; href: string; icon: IconDefinition }[] = [
  { label: "Dashboard", href: "/admin", icon: faChartLine },
  { label: "Products", href: "/admin/products", icon: faGem },
  { label: "Categories", href: "/admin/categories", icon: faLayerGroup },
  { label: "Orders", href: "/admin/orders", icon: faReceipt },
  { label: "Customers", href: "/admin/customers", icon: faUsers },
  { label: "Inventory", href: "/admin/inventory", icon: faBoxes },
  { label: "Coupons", href: "/admin/coupons", icon: faTag },
  { label: "Reviews", href: "/admin/reviews", icon: faStar },
  { label: "Contacts", href: "/admin/contacts", icon: faEnvelope },
];

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-60 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-gray-100 flex-shrink-0">
          <Link href="/admin" className="flex items-center gap-2 group">
            <div className="w-7 h-7 bg-emerald-600 rounded flex items-center justify-center">
              <FontAwesomeIcon icon={faGem} className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
              Gemstone Empire
            </span>
          </Link>
          <button
            className="lg:hidden p-1 text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all mb-0.5 ${
                isActive(item.href)
                  ? "bg-emerald-50 text-emerald-700 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <FontAwesomeIcon
                icon={item.icon}
                className={`w-4 h-4 ${
                  isActive(item.href) ? "text-emerald-600" : "text-gray-400"
                }`}
              />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-gray-100 flex-shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" />
            Back to Store
          </Link>
        </div>
      </aside>
    </>
  );
}
