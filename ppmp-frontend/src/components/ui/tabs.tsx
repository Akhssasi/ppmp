"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  tabs: ReadonlyArray<{ value: string; label: string; count?: number }>;
  className?: string;
}

export function Tabs({ value, onValueChange, tabs, className }: TabsProps) {
  return (
    <div
      className={cn(
        "inline-flex h-10 items-center justify-start gap-1 rounded-lg bg-muted p-1",
        className,
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onValueChange(tab.value)}
          className={cn(
            "inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors",
            value === tab.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {tab.label}
          {tab.count !== undefined ? (
            <span
              className={cn(
                "rounded-full px-1.5 text-xs",
                value === tab.value
                  ? "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300"
                  : "bg-muted-foreground/10",
              )}
            >
              {tab.count}
            </span>
          ) : null}
        </button>
      ))}
    </div>
  );
}
