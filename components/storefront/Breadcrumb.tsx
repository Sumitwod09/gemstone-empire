import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={index} className="flex items-center gap-1.5">
            {!isLast && index > 0 && (
              <FontAwesomeIcon
                icon={faChevronRight}
                className="w-2.5 h-2.5 text-[var(--color-text-muted)]"
              />
            )}
            {index > 0 && isLast && (
              <FontAwesomeIcon
                icon={faChevronRight}
                className="w-2.5 h-2.5 text-[var(--color-text-muted)]"
              />
            )}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={
                  isLast
                    ? "text-[var(--color-text-primary)] font-medium"
                    : "text-[var(--color-text-secondary)]"
                }
              >
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
