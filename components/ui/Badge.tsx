import { cn } from "@/lib/utils";

type BadgeVariant =
  | "default"
  | "accent"
  | "success"
  | "warning"
  | "error";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default:
    "bg-[var(--color-surface)] text-[var(--color-text-secondary)]",
  accent:
    "bg-[var(--color-accent-light)] text-[var(--color-accent)]",
  success:
    "bg-[var(--color-success-light)] text-[var(--color-success)]",
  warning:
    "bg-[var(--color-warning-light)] text-[var(--color-warning)]",
  error:
    "bg-[var(--color-error-light)] text-[var(--color-error)]",
};

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[4px] px-2 py-0.5 text-[11px] font-medium",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
