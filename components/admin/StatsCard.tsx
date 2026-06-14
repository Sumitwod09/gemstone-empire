import { Card } from "@/components/ui";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: string;
}

export function StatsCard({ label, value, icon, trend }: StatsCardProps) {
  return (
    <Card className="flex items-start justify-between">
      <div>
        <p className="text-xs text-[var(--color-text-muted)] font-medium uppercase tracking-wide mb-1">
          {label}
        </p>
        <p className="text-2xl font-semibold text-[var(--color-text-primary)]">
          {value}
        </p>
        {trend && (
          <p className="text-xs text-[var(--color-text-muted)] mt-1">{trend}</p>
        )}
      </div>
      {icon && (
        <div className="text-[var(--color-accent)] opacity-60">{icon}</div>
      )}
    </Card>
  );
}
