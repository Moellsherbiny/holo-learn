import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  iconColor = "text-primary",
  iconBg = "bg-primary/10",
  trend,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-5 flex flex-col gap-3",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-muted-foreground font-medium leading-tight">
          {title}
        </p>
        <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", iconBg)}>
          <Icon size={18} className={iconColor} />
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground tracking-tight">
          {value}
        </p>
        {trend && (
          <p
            className={cn(
              "text-xs mt-1",
              trend.positive ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"
            )}
          >
            {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}% {trend.label}
          </p>
        )}
      </div>
    </div>
  );
}