"use client";

import * as React from "react";
import { Calendar, Pencil, Trash2, User } from "lucide-react";
import { PriorityBadge } from "@/components/project/badges";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { Task } from "@/lib/types";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export const TaskCard = React.memo(function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  return (
    <Card className="group cursor-grab p-3 transition-shadow hover:shadow-md active:cursor-grabbing">
      <div className="mb-2 flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium leading-snug">{task.title}</h4>
        <div className="flex shrink-0 gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => onEdit(task)}
            className="rounded p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Edit task"
          >
            <Pencil className="size-3.5" />
          </button>
          <button
            onClick={() => onDelete(task)}
            className="rounded p-1 text-muted-foreground transition-colors hover:bg-rose-500/10 hover:text-rose-500"
            aria-label="Delete task"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>

      {task.description ? (
        <p className="mb-2 line-clamp-2 text-xs text-muted-foreground">{task.description}</p>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <PriorityBadge priority={task.priority} />
        {task.dueDate ? (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="size-3" />
            {formatDate(task.dueDate)}
          </span>
        ) : null}
        {task.assignedToUsername ? (
          <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
            <User className="size-3" />
            {task.assignedToUsername}
          </span>
        ) : null}
      </div>
    </Card>
  );
});
