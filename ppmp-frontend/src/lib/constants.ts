import type {
  MemberRole,
  ProjectStatus,
  ProjectVisibility,
  Role,
  TaskPriority,
  TaskStatus,
  TechnologyCategory,
} from "@/lib/types";

export const PROJECT_STATUSES: ProjectStatus[] = [
  "PLANNING",
  "IN_PROGRESS",
  "COMPLETED",
  "ON_HOLD",
  "ARCHIVED",
];

export const PROJECT_VISIBILITIES: ProjectVisibility[] = ["PUBLIC", "PRIVATE", "DRAFT"];

export const TASK_STATUSES: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

export const TASK_PRIORITIES: TaskPriority[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

export const MEMBER_ROLES: MemberRole[] = ["VIEWER", "CONTRIBUTOR", "TEAM_LEAD"];

export const ROLES: Role[] = ["USER", "TEAM_LEAD", "ADMIN", "SUPER_ADMIN"];

export const TECHNOLOGY_CATEGORIES: TechnologyCategory[] = [
  "LANGUAGE",
  "FRAMEWORK",
  "DATABASE",
  "TOOL",
  "CLOUD",
  "OTHER",
];

export const PROJECT_STATUS_META: Record<ProjectStatus, { label: string; className: string; dot: string }> = {
  PLANNING: { label: "Planning", className: "bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300", dot: "bg-sky-500" },
  IN_PROGRESS: { label: "In Progress", className: "bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300", dot: "bg-violet-500" },
  COMPLETED: { label: "Completed", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300", dot: "bg-emerald-500" },
  ON_HOLD: { label: "On Hold", className: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300", dot: "bg-amber-500" },
  ARCHIVED: { label: "Archived", className: "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300", dot: "bg-slate-500" },
};

export const VISIBILITY_META: Record<ProjectVisibility, { label: string; className: string }> = {
  PUBLIC: { label: "Public", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300" },
  PRIVATE: { label: "Private", className: "bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300" },
  DRAFT: { label: "Draft", className: "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300" },
};

export const TASK_STATUS_META: Record<TaskStatus, { label: string; className: string }> = {
  TODO: { label: "To Do", className: "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300" },
  IN_PROGRESS: { label: "In Progress", className: "bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300" },
  DONE: { label: "Done", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300" },
};

export const PRIORITY_META: Record<TaskPriority, { label: string; className: string }> = {
  LOW: { label: "Low", className: "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300" },
  MEDIUM: { label: "Medium", className: "bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300" },
  HIGH: { label: "High", className: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300" },
  CRITICAL: { label: "Critical", className: "bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300" },
};

export const ROLE_META: Record<Role, { label: string; className: string }> = {
  USER: { label: "User", className: "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300" },
  TEAM_LEAD: { label: "Team Lead", className: "bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300" },
  ADMIN: { label: "Admin", className: "bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300" },
  SUPER_ADMIN: { label: "Super Admin", className: "bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300" },
};

export const MEMBER_ROLE_META: Record<MemberRole, { label: string; className: string }> = {
  VIEWER: { label: "Viewer", className: "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300" },
  CONTRIBUTOR: { label: "Contributor", className: "bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300" },
  TEAM_LEAD: { label: "Team Lead", className: "bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300" },
};

export const TECHNOLOGY_CATEGORY_META: Record<TechnologyCategory, { label: string; className: string }> = {
  LANGUAGE: { label: "Language", className: "bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300" },
  FRAMEWORK: { label: "Framework", className: "bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300" },
  DATABASE: { label: "Database", className: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300" },
  TOOL: { label: "Tool", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300" },
  CLOUD: { label: "Cloud", className: "bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300" },
  OTHER: { label: "Other", className: "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300" },
};

export const TASK_COLUMN_TITLES: Record<TaskStatus, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

export const TASK_COLUMN_ACCENTS: Record<TaskStatus, string> = {
  TODO: "bg-slate-400",
  IN_PROGRESS: "bg-violet-500",
  DONE: "bg-emerald-500",
};
