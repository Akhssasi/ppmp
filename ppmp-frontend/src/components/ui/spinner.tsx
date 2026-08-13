import { cn } from "@/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "size-5 animate-spin rounded-full border-2 border-current border-t-transparent text-violet-600",
        className,
      )}
      role="status"
      aria-label="Loading"
    />
  );
}

export function FullPageLoader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-muted-foreground">
      <Spinner className="size-8" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
