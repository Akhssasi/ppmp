"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FolderKanban, Plus, Search } from "lucide-react";
import { toast } from "react-hot-toast";
import { ProjectCard } from "@/components/project/project-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { FullPageLoader } from "@/components/ui/spinner";
import { projectsService } from "@/services/projects";
import { PROJECT_STATUSES } from "@/lib/constants";
import { getErrorMessage } from "@/lib/utils";
import type { ProjectList, ProjectStatus } from "@/lib/types";

export default function ProjectsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [projects, setProjects] = React.useState<ProjectList[]>([]);
  const [totalPages, setTotalPages] = React.useState(1);
  const [loading, setLoading] = React.useState(true);

  const page = Number(searchParams.get("page") ?? "0");
  const status = searchParams.get("status") ?? "";
  const q = searchParams.get("q") ?? "";

  const [searchInput, setSearchInput] = React.useState(q);

  const setQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    if (key !== "page") params.delete("page");
    router.replace(`/projects?${params.toString()}`);
  };

  React.useEffect(() => {
    let active = true;
    projectsService
      .getAll({
        page,
        size: 9,
        ...(status ? { status: status as ProjectStatus } : {}),
      })
      .then((data) => {
        if (!active) return;
        setProjects(data.content);
        setTotalPages(data.totalPages);
      })
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [page, status]);

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery("q", searchInput.trim());
  };

  if (loading) return <FullPageLoader label="Loading projects..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage all your software engineering projects.
          </p>
        </div>
        <Button asChild>
          <Link href="/projects/new">
            <Plus className="size-4" />
            New project
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <form onSubmit={onSearchSubmit} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search projects..."
            className="pl-9"
          />
        </form>
        <Select
          value={status}
          onChange={(e) => setQuery("status", e.target.value)}
          className="sm:w-48"
        >
          <option value="">All statuses</option>
          {PROJECT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </Select>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title={q ? "No matching projects" : "No projects yet"}
          description={
            q
              ? "Try a different search term or clear the filters."
              : "Create your first project to start tracking progress."
          }
          action={
            !q ? (
              <Button asChild>
                <Link href="/projects/new">Create a project</Link>
              </Button>
            ) : null
          }
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={(p) => setQuery("page", String(p))} />
        </>
      )}
    </div>
  );
}
