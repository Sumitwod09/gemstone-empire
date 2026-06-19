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
  faArrowLeft,
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
      <div className="h-14 flex items-center px-5 border-b border-gray-200 flex-shrink-0 justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
            <path d="M16 2L24.5 10L16 30L7.5 10L16 2Z" fill="#00A896" />
            <path d="M16 2L20.5 10H11.5L16 2Z" fill="#028090" />
            <path d="M7.5 10H11.5L16 30L7.5 10Z" fill="#004D2B" />
            <path d="M24.5 10H20.5L16 30L24.5 10Z" fill="#008C52" />
          </svg>
          <span className="text-sm font-extrabold text-gray-800 tracking-tight">
            GEM ADMIN
          </span>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1.5 text-gray-400 hover:text-gray-600 rounded">
            <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
          </button>
        )}
      </div>
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                active
                  ? "bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              )}
            >
              <FontAwesomeIcon
                icon={item.icon}
                className={cn("w-4 h-4 flex-shrink-0", active ? "text-emerald-600" : "text-gray-400")}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-gray-200">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" />
          Back to Storefront
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-col w-[250px] flex-shrink-0 h-screen sticky top-0 bg-white border-r border-gray-200">
        {content}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="absolute top-0 left-0 h-full w-[260px] bg-white shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
