"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { Check, Circle, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { Dialog, DialogBody, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { formatDate, getErrorMessage } from "@/lib/utils";
import type { Milestone, MilestoneRequest } from "@/lib/types";

const milestoneSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional().or(z.literal("")),
  targetDate: z.string().optional().or(z.literal("")),
});

type MilestoneFormValues = z.infer<typeof milestoneSchema>;

interface MilestoneListProps {
  milestones: Milestone[];
  onCreate: (payload: MilestoneRequest) => Promise<unknown>;
  onUpdate: (id: string, payload: MilestoneRequest) => Promise<unknown>;
  onDelete: (id: string) => Promise<void>;
  onToggle: (id: string, completed: boolean) => Promise<unknown>;
}

export function MilestoneList({ milestones, onCreate, onUpdate, onDelete, onToggle }: MilestoneListProps) {
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Milestone | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MilestoneFormValues>({
    resolver: zodResolver(milestoneSchema),
    defaultValues: { title: "", description: "", targetDate: "" },
  });

  const openCreate = () => {
    setEditing(null);
    reset({ title: "", description: "", targetDate: "" });
    setOpen(true);
  };

  const openEdit = (milestone: Milestone) => {
    setEditing(milestone);
    reset({
      title: milestone.title,
      description: milestone.description ?? "",
      targetDate: milestone.targetDate ?? "",
    });
    setOpen(true);
  };

  const onFormSubmit = async (values: MilestoneFormValues) => {
    setSubmitting(true);
    try {
      const payload: MilestoneRequest = {
        title: values.title,
        description: values.description || null,
        targetDate: values.targetDate || null,
      };
      if (editing) {
        await onUpdate(editing.id, payload);
        toast.success("Milestone updated");
      } else {
        await onCreate(payload);
        toast.success("Milestone created");
      }
      setOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const toggle = async (milestone: Milestone) => {
    try {
      await onToggle(milestone.id, !milestone.isCompleted);
      toast.success(milestone.isCompleted ? "Milestone reopened" : "Milestone completed");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const remove = async (milestone: Milestone) => {
    if (!confirm(`Delete milestone "${milestone.title}"?`)) return;
    try {
      await onDelete(milestone.id);
      toast.success("Milestone deleted");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Milestones ({milestones.filter((m) => m.isCompleted).length}/{milestones.length})
        </h3>
        <Button size="sm" onClick={openCreate}>
          Add milestone
        </Button>
      </div>

      {milestones.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          No milestones yet. Add one to track important targets.
        </div>
      ) : (
        <div className="relative space-y-4 pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-border">
          {milestones
            .slice()
            .sort((a, b) => new Date(a.targetDate ?? 0).getTime() - new Date(b.targetDate ?? 0).getTime())
            .map((milestone) => (
              <div key={milestone.id} className="group relative">
                <span
                  className={`absolute -left-6 top-1 flex size-4 items-center justify-center rounded-full border-2 ${
                    milestone.isCompleted
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-border bg-background text-muted-foreground"
                  }`}
                >
                  {milestone.isCompleted ? (
                    <Check className="size-2.5" />
                  ) : (
                    <Circle className="size-2" />
                  )}
                </span>

                <div
                  className={`rounded-xl border p-4 transition-colors ${
                    milestone.isCompleted ? "border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-500/5" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4
                        className={`font-semibold ${
                          milestone.isCompleted ? "text-muted-foreground line-through" : ""
                        }`}
                      >
                        {milestone.title}
                      </h4>
                      {milestone.description ? (
                        <p className="mt-1 text-sm text-muted-foreground">{milestone.description}</p>
                      ) : null}
                      <p className="mt-2 text-xs text-muted-foreground">
                        Target: {formatDate(milestone.targetDate)}
                        {milestone.completedAt ? ` · Completed ${formatDate(milestone.completedAt)}` : ""}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => toggle(milestone)}
                        className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-emerald-500/10 hover:text-emerald-600"
                        aria-label={milestone.isCompleted ? "Reopen milestone" : "Complete milestone"}
                      >
                        <Check className="size-4" />
                      </button>
                      <button
                        onClick={() => openEdit(milestone)}
                        className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                        aria-label="Edit milestone"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        onClick={() => remove(milestone)}
                        className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-rose-500/10 hover:text-rose-500"
                        aria-label="Delete milestone"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeader
          title={editing ? "Edit milestone" : "New milestone"}
          description="Set a title and target date for this milestone."
          onClose={() => setOpen(false)}
        />
        <DialogBody>
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="milestone-title">Title *</Label>
              <Input id="milestone-title" {...register("title")} />
              {errors.title ? <p className="text-sm text-rose-500">{errors.title.message}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="milestone-description">Description</Label>
              <Textarea id="milestone-description" rows={3} {...register("description")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="milestone-date">Target date</Label>
              <Input id="milestone-date" type="date" {...register("targetDate")} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? <Spinner className="size-4 text-white" /> : null}
                {editing ? "Save" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogBody>
      </Dialog>
    </>
  );
}
