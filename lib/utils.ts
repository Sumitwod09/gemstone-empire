export function formatPrice(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `GE-${year}-${random}`;
}

export function formatCarat(carat: number): string {
  return `${carat.toFixed(2)} ct`;
}

export function formatDimensions(
  l?: number,
  w?: number,
  d?: number
): string | null {
  if (!l || !w || !d) return null;
  return `${l.toFixed(1)} × ${w.toFixed(1)} × ${d.toFixed(1)} mm`;
}

export function calculateShipping(subtotal: number): number {
  return subtotal >= 1000 ? 0 : 50;
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    pending: "warning",
    confirmed: "accent",
    shipped: "accent",
    delivered: "success",
    cancelled: "error",
    refunded: "error",
    paid: "success",
    failed: "error",
  };
  return map[status] ?? "default";
}
