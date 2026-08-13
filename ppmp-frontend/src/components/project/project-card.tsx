import Link from "next/link";
import { ArrowUpRight, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { VisibilityBadge, StatusBadge } from "@/components/project/badges";
import { formatDate } from "@/lib/utils";
import type { ProjectList } from "@/lib/types";

export function ProjectCard({ project }: { project: ProjectList }) {
  return (
    <Link href={`/projects/${project.id}`} className="group block">
      <Card className="h-full transition-all hover:border-violet-400 hover:shadow-lg dark:hover:border-violet-500/60">
        <div className="flex flex-col p-5">
          <div className="mb-3 flex items-start justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              <StatusBadge status={project.status} />
              <VisibilityBadge visibility={project.visibility} />
            </div>
            <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-violet-500" />
          </div>

          <h3 className="text-base font-semibold tracking-tight group-hover:text-violet-600 dark:group-hover:text-violet-400">
            {project.title}
          </h3>

          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {project.shortDescription || "No description provided."}
          </p>

          {project.technologyNames.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.technologyNames.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="rounded-md bg-secondary px-1.5 py-0.5 text-xs font-medium text-secondary-foreground"
                >
                  {tech}
                </span>
              ))}
              {project.technologyNames.length > 4 ? (
                <span className="rounded-md px-1.5 py-0.5 text-xs text-muted-foreground">
                  +{project.technologyNames.length - 4}
                </span>
              ) : null}
            </div>
          ) : null}

          <div className="mt-4 space-y-2 border-t pt-3">
            {project.progressPercentage !== null && project.progressPercentage !== undefined ? (
              <div className="flex items-center gap-2">
                <Progress value={project.progressPercentage} className="flex-1" />
                <span className="text-xs font-medium text-muted-foreground">
                  {project.progressPercentage}%
                </span>
              </div>
            ) : null}
            {project.endDate ? (
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="size-3.5" />
                Ends {formatDate(project.endDate)}
              </p>
            ) : null}
          </div>
        </div>
      </Card>
    </Link>
  );
}
