import { cn } from "@/lib/utils";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Top header bar inside the admin layout.
 * Accepts an optional actions slot for page-level buttons.
 */
export default function AdminHeader({
  title,
  subtitle,
  actions,
  className,
}: AdminHeaderProps) {
  return (
    <header
      className={cn(
        "h-14 shrink-0 flex items-center justify-between px-6",
        "bg-white border-b border-gray-200",
        className
      )}
    >
      <div className="flex items-baseline gap-3">
        <h1 className="text-base font-bold text-gray-900">{title}</h1>
        {subtitle && (
          <span className="text-sm text-gray-400 font-normal">{subtitle}</span>
        )}
      </div>

      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}
