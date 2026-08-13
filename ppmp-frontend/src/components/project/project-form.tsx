"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { PROJECT_STATUSES, PROJECT_VISIBILITIES } from "@/lib/constants";
import { getErrorMessage } from "@/lib/utils";
import type { Project, ProjectRequest, ProjectStatus, ProjectVisibility, Technology } from "@/lib/types";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required").max(150),
  shortDescription: z.string().max(500).optional().or(z.literal("")),
  fullDescription: z.string().optional().or(z.literal("")),
  status: z.enum(PROJECT_STATUSES as [string, ...string[]]),
  visibility: z.enum(PROJECT_VISIBILITIES as [string, ...string[]]),
  startDate: z.string().optional().or(z.literal("")),
  endDate: z.string().optional().or(z.literal("")),
  progressPercentage: z.coerce.number().min(0).max(100).optional(),
  repoUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  liveDemoUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  videoDemoUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  thumbnailUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  mode: "create" | "edit";
  project?: Project;
  technologies: Technology[];
  onSubmit: (payload: ProjectRequest) => Promise<unknown>;
  onCancel?: () => void;
}

export function ProjectForm({ mode, project, technologies, onSubmit, onCancel }: ProjectFormProps) {
  const router = useRouter();
  const [selectedTech, setSelectedTech] = React.useState<string[]>(
    project?.technologies.map((t) => t.id) ?? [],
  );
  const [submitting, setSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title ?? "",
      shortDescription: project?.shortDescription ?? "",
      fullDescription: project?.fullDescription ?? "",
      status: project?.status ?? "PLANNING",
      visibility: project?.visibility ?? "PRIVATE",
      startDate: project?.startDate ?? "",
      endDate: project?.endDate ?? "",
      progressPercentage: project?.progressPercentage ?? 0,
      repoUrl: project?.repoUrl ?? "",
      liveDemoUrl: project?.liveDemoUrl ?? "",
      videoDemoUrl: project?.videoDemoUrl ?? "",
      thumbnailUrl: project?.thumbnailUrl ?? "",
    },
  });

  const toggleTech = (id: string) => {
    setSelectedTech((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  const onFormSubmit = async (values: ProjectFormValues) => {
    setSubmitting(true);
    try {
      const payload: ProjectRequest = {
        ...values,
        status: values.status as ProjectStatus,
        visibility: values.visibility as ProjectVisibility,
        startDate: values.startDate || null,
        endDate: values.endDate || null,
        progressPercentage: values.progressPercentage ?? 0,
        repoUrl: values.repoUrl || null,
        liveDemoUrl: values.liveDemoUrl || null,
        videoDemoUrl: values.videoDemoUrl || null,
        thumbnailUrl: values.thumbnailUrl || null,
        technologyIds: selectedTech,
      };
      const result = await onSubmit(payload);
      const created = result as Project;
      toast.success(mode === "create" ? "Project created" : "Project updated");
      if (mode === "create" && created?.id) {
        router.push(`/projects/${created.id}`);
      } else if (mode === "edit") {
        router.refresh();
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input id="title" placeholder="e.g. Portfolio Platform" {...register("title")} />
        {errors.title ? <p className="text-sm text-rose-500">{errors.title.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="shortDescription">Short description</Label>
        <Textarea
          id="shortDescription"
          placeholder="One or two sentences that describe this project"
          rows={2}
          {...register("shortDescription")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullDescription">Full description</Label>
        <Textarea
          id="fullDescription"
          placeholder="Detailed description — markdown supported"
          rows={6}
          {...register("fullDescription")}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select id="status" {...register("status")}>
            {PROJECT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status.replace(/_/g, " ")}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="visibility">Visibility</Label>
          <Select id="visibility" {...register("visibility")}>
            {PROJECT_VISIBILITIES.map((visibility) => (
              <option key={visibility} value={visibility}>
                {visibility.charAt(0) + visibility.slice(1).toLowerCase()}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start date</Label>
          <Input id="startDate" type="date" {...register("startDate")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End date</Label>
          <Input id="endDate" type="date" {...register("endDate")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="progressPercentage">Progress (%)</Label>
          <Input
            id="progressPercentage"
            type="number"
            min={0}
            max={100}
            {...register("progressPercentage")}
          />
          {errors.progressPercentage ? (
            <p className="text-sm text-rose-500">{errors.progressPercentage.message}</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="repoUrl">Repository URL</Label>
          <Input id="repoUrl" placeholder="https://github.com/..." {...register("repoUrl")} />
          {errors.repoUrl ? <p className="text-sm text-rose-500">{errors.repoUrl.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="liveDemoUrl">Live demo URL</Label>
          <Input id="liveDemoUrl" placeholder="https://..." {...register("liveDemoUrl")} />
          {errors.liveDemoUrl ? (
            <p className="text-sm text-rose-500">{errors.liveDemoUrl.message}</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="videoDemoUrl">Video demo URL</Label>
          <Input id="videoDemoUrl" placeholder="https://youtube.com/..." {...register("videoDemoUrl")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
          <Input id="thumbnailUrl" placeholder="https://..." {...register("thumbnailUrl")} />
          {errors.thumbnailUrl ? (
            <p className="text-sm text-rose-500">{errors.thumbnailUrl.message}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Technologies</Label>
        {technologies.length === 0 ? (
          <p className="text-sm text-muted-foreground">No technologies available.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <button
                key={tech.id}
                type="button"
                onClick={() => toggleTech(tech.id)}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                  selectedTech.includes(tech.id)
                    ? "border-violet-500 bg-violet-100 text-violet-800 dark:bg-violet-500/20 dark:text-violet-300"
                    : "border-border hover:bg-accent"
                }`}
              >
                {tech.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-2 border-t pt-4">
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" disabled={submitting}>
          {submitting ? <Spinner className="size-4 text-white" /> : null}
          {mode === "create" ? "Create project" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
