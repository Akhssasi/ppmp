import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  accent?: string;
}

export function StatCard({ title, value, icon: Icon, description, accent }: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div
          className={cn(
            "flex size-9 items-center justify-center rounded-lg",
            accent ?? "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
          )}
        >
          <Icon className="size-4.5" />
        </div>
      </div>
      <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
      {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}
    </Card>
  );
}
