"use client";

import * as React from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Clock,
  FolderKanban,
  Layers,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { StatCard } from "@/components/analytics/stat-card";
import { TechUsageChart } from "@/components/analytics/charts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { analyticsService } from "@/services/analytics";
import { projectsService } from "@/services/projects";
import { getErrorMessage, timeAgo } from "@/lib/utils";
import type { DashboardStats, ProjectList } from "@/lib/types";

export default function DashboardPage() {
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [projects, setProjects] = React.useState<ProjectList[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let active = true;
    Promise.all([analyticsService.getDashboardStats(), projectsService.getAll({ page: 0, size: 4 })])
      .then(([statsData, projectsData]) => {
        if (!active) return;
        setStats(statsData);
        setProjects(projectsData.content);
      })
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="mt-2 h-4 w-96" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  const completionRate = stats && stats.totalTasks > 0
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
    : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here&apos;s an overview of your project portfolio.
          </p>
        </div>
        <Button asChild>
          <Link href="/projects/new">
            <FolderKanban className="size-4" />
            New project
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total projects"
          value={stats?.totalProjects ?? 0}
          icon={FolderKanban}
          description={`${stats?.inProgressProjects ?? 0} in progress`}
        />
        <StatCard
          title="Completed"
          value={stats?.completedProjects ?? 0}
          icon={CheckCircle2}
          description={`${stats?.planningProjects ?? 0} planning`}
          accent="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
        />
        <StatCard
          title="Tasks"
          value={stats?.totalTasks ?? 0}
          icon={Layers}
          description={`${completionRate}% done`}
          accent="bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300"
        />
        <StatCard
          title="Milestones"
          value={stats?.totalMilestones ?? 0}
          icon={Briefcase}
          description={`${stats?.completedMilestones ?? 0} achieved`}
          accent="bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <TechUsageChart data={stats?.topTechnologies ?? []} />
        </div>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Latest actions across your projects</CardDescription>
          </CardHeader>
          <CardContent>
            {stats && stats.recentActivity.length > 0 ? (
              <ul className="space-y-3">
                {stats.recentActivity.map((activity, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                      <Activity className="size-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">@{activity.username}</span>{" "}
                        <span className="text-muted-foreground">{activity.action}</span>
                        {activity.projectTitle ? (
                          <span className="text-muted-foreground"> in {activity.projectTitle}</span>
                        ) : null}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {timeAgo(activity.createdAt)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No activity yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent projects</h2>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1 text-sm font-medium text-violet-600 hover:underline dark:text-violet-400"
          >
            View all
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
        {projects.length === 0 ? (
          <EmptyState
            icon={FolderKanban}
            title="No projects yet"
            description="Create your first project to start tracking progress."
            action={
              <Button asChild>
                <Link href="/projects/new">Create a project</Link>
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`} className="group block">
                <Card className="h-full transition-all hover:border-violet-400 hover:shadow-lg">
                  <CardContent className="p-5">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                        {project.status.replace(/_/g, " ")}
                      </span>
                      <Clock className="size-4 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold group-hover:text-violet-600 dark:group-hover:text-violet-400">
                      {project.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {project.shortDescription || "No description."}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <FolderKanban className="size-3.5" />
                      {project.progressPercentage ?? 0}% complete
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
