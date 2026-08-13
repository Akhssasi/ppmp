"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Ban,
  CheckCircle2,
  FolderKanban,
  Mail,
  Megaphone,
  Plus,
  Shield,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { StatCard } from "@/components/analytics/stat-card";
import { TechUsageChart } from "@/components/analytics/charts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import { Dialog, DialogBody, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Pagination } from "@/components/ui/pagination";
import { adminService } from "@/services/admin";
import { technologiesService } from "@/services/technologies";
import { ROLE_META, TECHNOLOGY_CATEGORIES, TECHNOLOGY_CATEGORY_META } from "@/lib/constants";
import { formatDate, getErrorMessage, initials } from "@/lib/utils";
import type { PlatformStats, Technology, TechnologyCategory, UserAdmin } from "@/lib/types";

const announcementSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  message: z.string().min(1, "Message is required").max(5000),
});

const techSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  category: z.enum(TECHNOLOGY_CATEGORIES as [string, ...string[]]),
  iconUrl: z.string().max(500).optional().or(z.literal("")),
});

export default function AdminPage() {
  const [tab, setTab] = React.useState("overview");
  const [stats, setStats] = React.useState<PlatformStats | null>(null);
  const [users, setUsers] = React.useState<UserAdmin[]>([]);
  const [userPage, setUserPage] = React.useState(0);
  const [userTotalPages, setUserTotalPages] = React.useState(1);
  const [technologies, setTechnologies] = React.useState<Technology[]>([]);
  const [techDialogOpen, setTechDialogOpen] = React.useState(false);
  const [editingTech, setEditingTech] = React.useState<Technology | null>(null);
  const [announceDialogOpen, setAnnounceDialogOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const loadStats = React.useCallback(() => {
    adminService
      .getPlatformStats()
      .then(setStats)
      .catch((error) => toast.error(getErrorMessage(error)));
  }, []);

  const loadUsers = React.useCallback((page: number) => {
    adminService
      .getUsers(page, 20)
      .then((data) => {
        setUsers(data.content);
        setUserTotalPages(data.totalPages);
      })
      .catch((error) => toast.error(getErrorMessage(error)));
  }, []);

  const loadTechnologies = React.useCallback(() => {
    technologiesService
      .getAll(0, 200)
      .then((data) => setTechnologies(data.content))
      .catch((error) => toast.error(getErrorMessage(error)));
  }, []);

  React.useEffect(() => {
    Promise.all([adminService.getPlatformStats(), adminService.getUsers(0, 20)])
      .then(([statsData, usersData]) => {
        setStats(statsData);
        setUsers(usersData.content);
        setUserTotalPages(usersData.totalPages);
      })
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setLoading(false));
  }, []);

  const switchTab = (value: string) => {
    setTab(value);
    if (value === "users") loadUsers(userPage);
    if (value === "technologies") loadTechnologies();
  };

  const banUser = async (user: UserAdmin) => {
    if (!confirm(`Ban ${user.username}?`)) return;
    try {
      await adminService.banUser(user.id);
      toast.success(`${user.username} banned`);
      loadUsers(userPage);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const activateUser = async (user: UserAdmin) => {
    try {
      await adminService.activateUser(user.id);
      toast.success(`${user.username} activated`);
      loadUsers(userPage);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const deleteUser = async (user: UserAdmin) => {
    if (!confirm(`Permanently delete ${user.username}?`)) return;
    try {
      await adminService.deleteUser(user.id);
      toast.success(`${user.username} deleted`);
      loadUsers(userPage);
      loadStats();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
        Loading admin panel...
      </div>
    );
  }

  const tabs = [
    { value: "overview", label: "Overview" },
    { value: "users", label: "Users", count: users.length },
    { value: "technologies", label: "Technologies", count: technologies.length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Shield className="size-6 text-violet-600" />
            Admin panel
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Platform overview, user management and technology library.
          </p>
        </div>
        <Button onClick={() => setAnnounceDialogOpen(true)}>
          <Megaphone className="size-4" />
          Send announcement
        </Button>
      </div>

      <Tabs value={tab} onValueChange={switchTab} tabs={tabs} />

      {tab === "overview" ? (
        <OverviewTab stats={stats} />
      ) : null}

      {tab === "users" ? (
        <Card>
          <CardHeader>
            <CardTitle>User management</CardTitle>
            <CardDescription>View, ban, activate or delete user accounts.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {users.map((user) => (
                <div key={user.id} className="flex flex-wrap items-center gap-3 p-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-violet-600 text-sm font-semibold text-white">
                    {initials(user.fullName || user.username)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 truncate text-sm font-medium">
                      {user.fullName || user.username}
                      <Badge className={ROLE_META[user.role].className} variant="outline">
                        {ROLE_META[user.role].label}
                      </Badge>
                      {!user.isActive ? (
                        <Badge variant="destructive">Banned</Badge>
                      ) : null}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      @{user.username} · {user.email} · {user.projectCount} projects · joined{" "}
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                  {user.isActive ? (
                    <Button size="sm" variant="outline" onClick={() => banUser(user)}>
                      <Ban className="size-3.5" /> Ban
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => activateUser(user)}>
                      <CheckCircle2 className="size-3.5" /> Activate
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-rose-500 hover:bg-rose-500/10 hover:text-rose-500"
                    onClick={() => deleteUser(user)}
                  >
                    <Trash2 className="size-3.5" /> Delete
                  </Button>
                </div>
              ))}
              {users.length === 0 ? (
                <p className="p-8 text-center text-sm text-muted-foreground">No users found.</p>
              ) : null}
            </div>
            <Pagination page={userPage} totalPages={userTotalPages} onPageChange={(p) => { setUserPage(p); loadUsers(p); }} />
          </CardContent>
        </Card>
      ) : null}

      {tab === "technologies" ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Technology library</CardTitle>
                <CardDescription>Manage the technology tags used across the platform.</CardDescription>
              </div>
              <Button size="sm" onClick={() => { setEditingTech(null); setTechDialogOpen(true); }}>
                <Plus className="size-4" /> Add technology
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {technologies.map((tech) => (
                <div key={tech.id} className="flex items-center gap-3 p-4">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-xs font-bold">
                    {tech.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{tech.name}</p>
                    <Badge className={TECHNOLOGY_CATEGORY_META[tech.category].className} variant="outline">
                      {TECHNOLOGY_CATEGORY_META[tech.category].label}
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => { setEditingTech(tech); setTechDialogOpen(true); }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-rose-500 hover:bg-rose-500/10 hover:text-rose-500"
                    onClick={async () => {
                      if (!confirm(`Delete technology "${tech.name}"?`)) return;
                      try {
                        await technologiesService.remove(tech.id);
                        toast.success("Technology deleted");
                        loadTechnologies();
                      } catch (error) {
                        toast.error(getErrorMessage(error));
                      }
                    }}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              ))}
              {technologies.length === 0 ? (
                <p className="p-8 text-center text-sm text-muted-foreground">No technologies yet.</p>
              ) : null}
            </div>
          </CardContent>
        </Card>
      ) : null}

      <AnnouncementDialog open={announceDialogOpen} onOpenChange={setAnnounceDialogOpen} />
      <TechnologyDialog
        open={techDialogOpen}
        onOpenChange={setTechDialogOpen}
        technology={editingTech}
        onSaved={loadTechnologies}
      />
    </div>
  );
}

function OverviewTab({ stats }: { stats: PlatformStats | null }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total users" value={stats?.totalUsers ?? 0} icon={Users} description={`${stats?.totalActiveUsers ?? 0} active`} />
        <StatCard title="Projects" value={stats?.totalProjects ?? 0} icon={FolderKanban} description={`${stats?.newProjectsToday ?? 0} created today`} accent="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" />
        <StatCard title="Tasks" value={stats?.totalTasks ?? 0} icon={CheckCircle2} description="Across all projects" accent="bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300" />
        <StatCard title="Files" value={stats?.totalFiles ?? 0} icon={Mail} description="Stored on platform" accent="bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Projects by status</CardTitle>
          </CardHeader>
          <CardContent>
            {stats && Object.keys(stats.projectsByStatus).length > 0 ? (
              <ul className="space-y-3">
                {Object.entries(stats.projectsByStatus).map(([status, count]) => (
                  <li key={status} className="flex items-center gap-3">
                    <span className="w-32 text-sm font-medium">{status.replace(/_/g, " ")}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-violet-600"
                        style={{ width: `${stats.totalProjects ? (count / stats.totalProjects) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-sm font-semibold">{count}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">No data yet.</p>
            )}
          </CardContent>
        </Card>
        <TechUsageChart data={stats?.topTechnologies ?? []} />
      </div>
    </div>
  );
}

function AnnouncementDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(announcementSchema),
    defaultValues: { title: "", message: "" },
  });

  const onSubmit = async (values: { title: string; message: string }) => {
    try {
      await adminService.sendAnnouncement(values);
      toast.success("Announcement sent to all users");
      reset();
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader title="Send announcement" description="Broadcast a message to all platform users." onClose={() => onOpenChange(false)} />
      <DialogBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="announcement-title">Title *</Label>
            <Input id="announcement-title" placeholder="e.g. Scheduled maintenance" {...register("title")} />
            {errors.title ? <p className="text-sm text-rose-500">{errors.title.message}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="announcement-message">Message *</Label>
            <Textarea id="announcement-message" rows={5} {...register("message")} />
            {errors.message ? <p className="text-sm text-rose-500">{errors.message.message}</p> : null}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Spinner className="size-4 text-white" /> : <Megaphone className="size-4" />}
              Send
            </Button>
          </DialogFooter>
        </form>
      </DialogBody>
    </Dialog>
  );
}

function TechnologyDialog({
  open,
  onOpenChange,
  technology,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  technology: Technology | null;
  onSaved: () => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(techSchema),
    defaultValues: { name: "", category: "LANGUAGE" as TechnologyCategory, iconUrl: "" },
  });

  React.useEffect(() => {
    if (open) {
      reset({
        name: technology?.name ?? "",
        category: technology?.category ?? "LANGUAGE",
        iconUrl: technology?.iconUrl ?? "",
      });
    }
  }, [open, technology, reset]);

  const onSubmit = async (values: { name: string; category: string; iconUrl?: string }) => {
    try {
      const payload = {
        name: values.name,
        category: values.category as TechnologyCategory,
        iconUrl: values.iconUrl || null,
      };
      if (technology) {
        await technologiesService.update(technology.id, payload);
        toast.success("Technology updated");
      } else {
        await technologiesService.create(payload);
        toast.success("Technology created");
      }
      onSaved();
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader
        title={technology ? "Edit technology" : "Add technology"}
        description="Manage a technology tag in the library."
        onClose={() => onOpenChange(false)}
      />
      <DialogBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tech-name">Name *</Label>
            <Input id="tech-name" placeholder="e.g. TypeScript" {...register("name")} />
            {errors.name ? <p className="text-sm text-rose-500">{errors.name.message}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="tech-category">Category</Label>
            <Select id="tech-category" {...register("category")}>
              {TECHNOLOGY_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0) + category.slice(1).toLowerCase()}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tech-icon">Icon URL</Label>
            <Input id="tech-icon" placeholder="https://..." {...register("iconUrl")} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Spinner className="size-4 text-white" /> : null}
              {technology ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogBody>
    </Dialog>
  );
}
