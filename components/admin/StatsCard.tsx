interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: React.ReactNode;
}

export function StatsCard({ label, value, icon, trend }: StatsCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-5 shadow-sm flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-wider mb-1 truncate">
          {label}
        </p>
        <p className="text-lg md:text-2xl font-extrabold text-gray-900">
          {value}
        </p>
        {trend && (
          <div className="text-[10px] font-semibold mt-1.5">{trend}</div>
        )}
      </div>
      {icon && (
        <div className="text-emerald-500/50 flex-shrink-0 mt-1">{icon}</div>
      )}
    </div>
  );
}
