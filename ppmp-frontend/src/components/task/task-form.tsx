"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { TASK_PRIORITIES } from "@/lib/constants";
import { getErrorMessage } from "@/lib/utils";
import type { Member, Task, TaskPriority, TaskRequest, TaskStatus } from "@/lib/types";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional().or(z.literal("")),
  priority: z.enum(TASK_PRIORITIES as [string, ...string[]]),
  dueDate: z.string().optional().or(z.literal("")),
  assignedToId: z.string().optional().or(z.literal("")),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskFormProps {
  task?: Task;
  defaultStatus?: TaskStatus;
  members: Member[];
  onSubmit: (payload: TaskRequest) => Promise<unknown>;
  onDone: () => void;
}

export function TaskForm({ task, defaultStatus = "TODO", members, onSubmit, onDone }: TaskFormProps) {
  const [submitting, setSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      priority: task?.priority ?? "MEDIUM",
      dueDate: task?.dueDate ?? "",
      assignedToId: task?.assignedToId ?? "",
    },
  });

  const activeMembers = members.filter((m) => m.status === "ACTIVE");

  const onFormSubmit = async (values: TaskFormValues) => {
    setSubmitting(true);
    try {
      const payload: TaskRequest = {
        title: values.title,
        description: values.description || null,
        priority: values.priority as TaskPriority,
        dueDate: values.dueDate || null,
        assignedToId: values.assignedToId || null,
      };
      await onSubmit(payload);
      toast.success(task ? "Task updated" : `Task added to ${defaultStatus.replace(/_/g, " ")}`);
      onDone();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="task-title">Title *</Label>
        <Input id="task-title" placeholder="e.g. Set up authentication" {...register("title")} />
        {errors.title ? <p className="text-sm text-rose-500">{errors.title.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="task-description">Description</Label>
        <Textarea
          id="task-description"
          rows={3}
          placeholder="What needs to be done?"
          {...register("description")}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="task-priority">Priority</Label>
          <Select id="task-priority" {...register("priority")}>
            {TASK_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {priority.charAt(0) + priority.slice(1).toLowerCase()}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="task-due">Due date</Label>
          <Input id="task-due" type="date" {...register("dueDate")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="task-assignee">Assignee</Label>
          <Select id="task-assignee" {...register("assignedToId")}>
            <option value="">Unassigned</option>
            {activeMembers.map((member) => (
              <option key={member.userId} value={member.userId}>
                {member.fullName || member.username}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 border-t pt-3">
        <Button type="button" variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? <Spinner className="size-4 text-white" /> : null}
          {task ? "Save" : "Add task"}
        </Button>
      </div>
    </form>
  );
}
