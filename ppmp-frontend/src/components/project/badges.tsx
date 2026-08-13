import { Badge } from "@/components/ui/badge";
import {
  PRIORITY_META,
  PROJECT_STATUS_META,
  ROLE_META,
  TASK_STATUS_META,
  VISIBILITY_META,
} from "@/lib/constants";
import type { ProjectStatus, ProjectVisibility, Role, TaskPriority, TaskStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const meta = PROJECT_STATUS_META[status];
  return (
    <Badge className={meta.className} variant="outline">
      <span className={`mr-1 size-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </Badge>
  );
}

export function VisibilityBadge({ visibility }: { visibility: ProjectVisibility }) {
  const meta = VISIBILITY_META[visibility];
  return (
    <Badge className={meta.className} variant="outline">
      {meta.label}
    </Badge>
  );
}

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const meta = TASK_STATUS_META[status];
  return (
    <Badge className={meta.className} variant="outline">
      {meta.label}
    </Badge>
  );
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const meta = PRIORITY_META[priority];
  return (
    <Badge className={meta.className} variant="outline">
      {meta.label}
    </Badge>
  );
}

export function RoleBadge({ role }: { role: Role }) {
  const meta = ROLE_META[role];
  return (
    <Badge className={meta.className} variant="outline">
      {meta.label}
    </Badge>
  );
}
