"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  Calendar,
  Copy,
  FileText,
  Globe,
  ListChecks,
  Pencil,
  Play,
  Trash2,
  Users,
  Video,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs } from "@/components/ui/tabs";
import { Select } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { FullPageLoader } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge, VisibilityBadge } from "@/components/project/badges";
import { GitHubIcon } from "@/components/brand-icons";
import { ProjectForm } from "@/components/project/project-form";
import { KanbanBoard } from "@/components/task/kanban-board";
import { MilestoneList } from "@/components/milestone/milestone-list";
import { Dialog, DialogBody, DialogHeader } from "@/components/ui/dialog";
import { projectsService } from "@/services/projects";
import { tasksService } from "@/services/tasks";
import { milestonesService } from "@/services/milestones";
import { filesService } from "@/services/files";
import { collaborationService } from "@/services/collaboration";
import { technologiesService } from "@/services/technologies";
import { useAuthStore } from "@/store/auth";
import {
  PROJECT_STATUSES,
  PROJECT_VISIBILITIES,
} from "@/lib/constants";
import { formatDate, formatDateTime, getErrorMessage, timeAgo } from "@/lib/utils";
import type {
  Member,
  MemberRole,
  Milestone,
  MilestoneRequest,
  Project,
  ProjectFile,
  ProjectRequest,
  ProjectStatus,
  ProjectVisibility,
  Task,
  TaskRequest,
  TaskStatus,
  Technology,
} from "@/lib/types";

type TabKey = "overview" | "tasks" | "milestones" | "files" | "collaboration" | "activity";

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const { user } = useAuthStore();

  const [project, setProject] = React.useState<Project | null>(null);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [milestones, setMilestones] = React.useState<Milestone[]>([]);
  const [members, setMembers] = React.useState<Member[]>([]);
  const [files, setFiles] = React.useState<ProjectFile[]>([]);
  const [technologies, setTechnologies] = React.useState<Technology[]>([]);
  const [tab, setTab] = React.useState<TabKey>("overview");
  const [editing, setEditing] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const loadProject = React.useCallback(async () => {
    const data = await projectsService.getById(id);
    setProject(data);
  }, [id]);

  const loadAll = React.useCallback(async () => {
    const [projectData, tasksData, milestonesData, membersData, filesData, techsData] =
      await Promise.all([
        projectsService.getById(id),
        tasksService.getAll(id),
        milestonesService.getAll(id),
        collaborationService.getMembers(id).catch(() => [] as Member[]),
        filesService.getAll(id).catch(() => [] as ProjectFile[]),
        technologiesService.getAllUnpaged(),
      ]);
    return { projectData, tasksData, milestonesData, membersData, filesData, techsData };
  }, [id]);

  React.useEffect(() => {
    let active = true;
    loadAll()
      .then((data) => {
        if (!active) return;
        setProject(data.projectData);
        setTasks(data.tasksData);
        setMilestones(data.milestonesData);
        setMembers(data.membersData);
        setFiles(data.filesData);
        setTechnologies(data.techsData);
      })
      .catch((error) => {
        if (!active) return;
        toast.error(getErrorMessage(error));
        router.replace("/projects");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [loadAll, router]);

  if (loading || !project) return <FullPageLoader label="Loading project..." />;

  const isOwner = user?.id === project.ownerId;
  const progress = project.progressPercentage ?? 0;

  const handleStatusChange = async (status: ProjectStatus) => {
    try {
      const updated = await projectsService.updateStatus(id, status);
      setProject(updated);
      toast.success("Project status updated");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleVisibilityChange = async (visibility: ProjectVisibility) => {
    try {
      const updated = await projectsService.updateVisibility(id, visibility);
      setProject(updated);
      toast.success("Project visibility updated");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    try {
      await projectsService.remove(id);
      toast.success("Project deleted");
      router.replace("/projects");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleDuplicate = async () => {
    try {
      const duplicate = await projectsService.duplicate(id);
      toast.success("Project duplicated");
      router.push(`/projects/${duplicate.id}`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleProjectUpdate = async (payload: ProjectRequest) => {
    const updated = await projectsService.update(id, payload);
    setProject(updated);
    setEditing(false);
    return updated;
  };

  const handleTaskCreate = async (payload: TaskRequest, status: TaskStatus) => {
    const task = await tasksService.create(id, payload);
    if (status !== "TODO") {
      await tasksService.updateStatus(id, task.id, status);
    }
    const data = await loadAll();
    setTasks(data.tasksData);
    return task;
  };

  const handleTaskUpdate = async (taskId: string, payload: TaskRequest) => {
    const updated = await tasksService.update(id, taskId, payload);
    setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    return updated;
  };

  const handleTaskStatus = async (taskId: string, status: TaskStatus) => {
    const updated = await tasksService.updateStatus(id, taskId, status);
    setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
  };

  const handleTaskDelete = async (taskId: string) => {
    await tasksService.remove(id, taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    toast.success("Task deleted");
  };

  const handleMilestoneCreate = async (payload: MilestoneRequest) => {
    const created = await milestonesService.create(id, payload);
    setMilestones((prev) => [...prev, created]);
    loadProject();
    return created;
  };

  const handleMilestoneUpdate = async (milestoneId: string, payload: MilestoneRequest) => {
    const updated = await milestonesService.update(id, milestoneId, payload);
    setMilestones((prev) => prev.map((m) => (m.id === milestoneId ? updated : m)));
    loadProject();
    return updated;
  };

  const handleMilestoneDelete = async (milestoneId: string) => {
    await milestonesService.remove(id, milestoneId);
    setMilestones((prev) => prev.filter((m) => m.id !== milestoneId));
    loadProject();
  };

  const handleMilestoneToggle = async (milestoneId: string, completed: boolean) => {
    const updated = await milestonesService.setCompleted(id, milestoneId, completed);
    setMilestones((prev) => prev.map((m) => (m.id === milestoneId ? updated : m)));
    loadProject();
    return updated;
  };

  const handleFileUpload = async (file: File) => {
    const uploaded = await filesService.upload(id, file);
    setFiles((prev) => [...prev, uploaded]);
    toast.success("File uploaded");
    loadProject();
  };

  const handleFileDelete = async (fileId: string) => {
    await filesService.remove(id, fileId);
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    toast.success("File deleted");
  };

  const handleInvite = async (email: string) => {
    await collaborationService.invite(id, email);
    toast.success("Invitation sent");
    const updated = await collaborationService.getMembers(id);
    setMembers(updated);
  };

  const handleMemberRemove = async (userId: string) => {
    await collaborationService.removeMember(id, userId);
    setMembers((prev) => prev.filter((m) => m.userId !== userId));
    toast.success("Member removed");
  };

  const handleMemberRole = async (userId: string, role: MemberRole) => {
    await collaborationService.updateRole(id, userId, role);
    setMembers((prev) => prev.map((m) => (m.userId === userId ? { ...m, role } : m)));
    toast.success("Role updated");
  };

  const tabCounts = {
    overview: 0,
    tasks: tasks.length,
    milestones: milestones.length,
    files: files.length,
    collaboration: members.length,
    activity: 0,
  };

  const tabs = [
    { value: "overview", label: "Overview" },
    { value: "tasks", label: "Tasks", count: tabCounts.tasks },
    { value: "milestones", label: "Milestones", count: tabCounts.milestones },
    { value: "files", label: "Files", count: tabCounts.files },
    { value: "collaboration", label: "Team", count: tabCounts.collaboration },
    { value: "activity", label: "Activity" },
  ] as const;

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link href="/projects">
          <ArrowLeft className="size-4" />
          Back to projects
        </Link>
      </Button>

      <Card className="overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500" />
        <CardContent className="space-y-4 p-6 pt-0">
          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 flex size-16 items-center justify-center rounded-2xl bg-background text-2xl font-bold text-violet-600 shadow-lg ring-1 ring-border">
                {project.title.charAt(0).toUpperCase()}
              </div>
              <h1 className="text-2xl font-bold tracking-tight">{project.title}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <StatusBadge status={project.status} />
                <VisibilityBadge visibility={project.visibility} />
                <span className="text-sm text-muted-foreground">@{project.ownerUsername}</span>
              </div>
            </div>
            {isOwner ? (
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
                  <Pencil className="size-3.5" />
                  Edit
                </Button>
                <Button size="sm" variant="outline" onClick={handleDuplicate}>
                  <Copy className="size-3.5" />
                  Duplicate
                </Button>
                <Button size="sm" variant="destructive" onClick={handleDelete}>
                  <Trash2 className="size-3.5" />
                  Delete
                </Button>
              </div>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Progress
              </span>
              <div className="flex items-center gap-2">
                <Progress value={progress} className="flex-1" />
                <span className="text-sm font-semibold">{progress}%</span>
              </div>
            </div>
            {isOwner ? (
              <>
                <div className="space-y-1">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Status
                  </span>
                  <Select value={project.status} onChange={(e) => handleStatusChange(e.target.value as ProjectStatus)}>
                    {PROJECT_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s.replace(/_/g, " ")}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Visibility
                  </span>
                  <Select value={project.visibility} onChange={(e) => handleVisibilityChange(e.target.value as ProjectVisibility)}>
                    {PROJECT_VISIBILITIES.map((v) => (
                      <option key={v} value={v}>
                        {v.charAt(0) + v.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </Select>
                </div>
              </>
            ) : null}
            <div className="space-y-1">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Dates
              </span>
              <p className="flex items-center gap-1.5 text-sm">
                <Calendar className="size-3.5" />
                {formatDate(project.startDate)} → {formatDate(project.endDate)}
              </p>
            </div>
          </div>

          {project.technologies.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.map((tech) => (
                <span
                  key={tech.id}
                  className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
                >
                  {tech.name}
                </span>
              ))}
            </div>
          ) : null}

          {project.repoUrl || project.liveDemoUrl || project.videoDemoUrl ? (
            <div className="flex flex-wrap gap-2">
              {project.repoUrl ? (
                <a href={project.repoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors hover:bg-accent">
                  <GitHubIcon className="size-4" /> Repository
                </a>
              ) : null}
              {project.liveDemoUrl ? (
                <a href={project.liveDemoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors hover:bg-accent">
                  <Globe className="size-4" /> Live demo
                </a>
              ) : null}
              {project.videoDemoUrl ? (
                <a href={project.videoDemoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors hover:bg-accent">
                  <Video className="size-4" /> Video demo
                </a>
              ) : null}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)} tabs={tabs} />

      {tab === "overview" ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>About this project</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line text-sm leading-relaxed">
                {project.fullDescription || project.shortDescription || "No description provided."}
              </p>
              <dl className="mt-6 grid gap-4 border-t pt-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Created</dt>
                  <dd className="mt-1 text-sm">{formatDateTime(project.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Last updated</dt>
                  <dd className="mt-1 text-sm">{timeAgo(project.updatedAt)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ProgressRow label="Tasks" value={project.taskCount} completed={project.completedTaskCount} />
                <ProgressRow label="Milestones" value={project.milestoneCount} completed={project.completedMilestoneCount} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Quick actions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => setTab("tasks")}>
                  <ListChecks className="size-4" /> Tasks
                </Button>
                <Button size="sm" variant="outline" onClick={() => setTab("milestones")}>
                  <Play className="size-4" /> Milestones
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}

      {tab === "tasks" ? (
        <KanbanBoard
          tasks={tasks}
          members={members}
          onTasksChange={setTasks}
          onStatusChange={handleTaskStatus}
          onUpdate={handleTaskUpdate}
          onDelete={handleTaskDelete}
          onCreate={handleTaskCreate}
        />
      ) : null}

      {tab === "milestones" ? (
        <MilestoneList
          milestones={milestones}
          onCreate={handleMilestoneCreate}
          onUpdate={handleMilestoneUpdate}
          onDelete={handleMilestoneDelete}
          onToggle={handleMilestoneToggle}
        />
      ) : null}

      {tab === "files" ? <FilesTab files={files} onUpload={handleFileUpload} onDelete={handleFileDelete} /> : null}

      {tab === "collaboration" ? (
        <CollaborationTab
          members={members}
          isOwner={isOwner}
          onInvite={handleInvite}
          onRemove={handleMemberRemove}
          onRoleChange={handleMemberRole}
        />
      ) : null}

      {tab === "activity" ? <ActivityTab projectId={id} /> : null}

      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogHeader title="Edit project" description="Update project details." onClose={() => setEditing(false)} />
        <DialogBody className="max-h-[75vh] overflow-y-auto">
          <ProjectForm
            mode="edit"
            project={project}
            technologies={technologies}
            onSubmit={handleProjectUpdate}
            onCancel={() => setEditing(false)}
          />
        </DialogBody>
      </Dialog>
    </div>
  );
}

function ProgressRow({ label, value, completed }: { label: string; value: number; completed: number }) {
  const pct = value > 0 ? Math.round((completed / value) * 100) : 0;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{completed}/{value}</span>
      </div>
      <Progress value={pct} />
    </div>
  );
}

function FilesTab({
  files,
  onUpload,
  onDelete,
}: {
  files: ProjectFile[];
  onUpload: (file: File) => Promise<void>;
  onDelete: (fileId: string) => Promise<void>;
}) {
  const [dragOver, setDragOver] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    Array.from(fileList).forEach((file) => {
      onUpload(file).catch((e) => toast.error(getErrorMessage(e)));
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Files & screenshots</CardTitle>
        <CardDescription>Upload screenshots, documents and other assets.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
            dragOver ? "border-violet-500 bg-violet-50 dark:bg-violet-500/10" : "border-border"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
        >
          <FileText className="mb-2 size-8 text-muted-foreground" />
          <p className="text-sm font-medium">Drag & drop files here</p>
          <p className="mt-1 text-xs text-muted-foreground">or</p>
          <Button size="sm" variant="outline" className="mt-3" onClick={() => inputRef.current?.click()}>
            Browse files
          </Button>
          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>

        {files.length === 0 ? (
          <EmptyState icon={FileText} title="No files yet" description="Upload screenshots or documents for this project." />
        ) : (
          <ul className="divide-y">
            {files.map((file) => (
              <li key={file.id} className="flex items-center gap-3 py-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                  <FileText className="size-5 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <a href={file.fileUrl} target="_blank" rel="noreferrer" className="truncate text-sm font-medium hover:text-violet-600 dark:hover:text-violet-400">
                    {file.fileName}
                  </a>
                  <p className="text-xs text-muted-foreground">
                    {file.fileType} · {formatDateTime(file.uploadedAt)}
                  </p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => onDelete(file.id)} className="text-rose-500 hover:bg-rose-500/10 hover:text-rose-500">
                  <Trash2 className="size-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function CollaborationTab({
  members,
  isOwner,
  onInvite,
  onRemove,
  onRoleChange,
}: {
  members: Member[];
  isOwner: boolean;
  onInvite: (email: string) => Promise<void>;
  onRemove: (userId: string) => Promise<void>;
  onRoleChange: (userId: string, role: MemberRole) => Promise<void>;
}) {
  const [email, setEmail] = React.useState("");
  const [inviting, setInviting] = React.useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setInviting(true);
    try {
      await onInvite(email.trim());
      setEmail("");
    } finally {
      setInviting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Invite team members</CardTitle>
          <CardDescription>Send an invitation to collaborate on this project.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="flex gap-2">
            <Input
              type="email"
              placeholder="teammate@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" disabled={inviting || !email.trim()}>
              <Users className="size-4" />
              Invite
            </Button>
          </form>
        </CardContent>
      </Card>

      {members.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No team members yet"
          description="Invite collaborators to work on this project together."
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Team ({members.length})</CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            {members.map((member) => (
              <div key={member.id} className="flex flex-wrap items-center gap-3 py-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                  {member.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {member.fullName || member.username}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{member.email}</p>
                </div>
                <Select
                  value={member.role}
                  onChange={(e) => onRoleChange(member.userId, e.target.value as MemberRole)}
                  className="w-36"
                  disabled={!isOwner}
                >
                  {(["VIEWER", "CONTRIBUTOR", "TEAM_LEAD"] as MemberRole[]).map((role) => (
                    <option key={role} value={role}>
                      {role.replace(/_/g, " ")}
                    </option>
                  ))}
                </Select>
                {isOwner ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-rose-500 hover:bg-rose-500/10 hover:text-rose-500"
                    onClick={() => onRemove(member.userId)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                ) : null}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ActivityTab({ projectId }: { projectId: string }) {
  const [items, setItems] = React.useState<unknown[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let active = true;
    projectsService
      .getActivity(projectId)
      .then((data) => {
        if (active) setItems(data);
      })
      .catch(() => {
        if (active) setItems([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [projectId]);

  if (loading) return <FullPageLoader label="Loading activity..." />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity log</CardTitle>
        <CardDescription>Recent actions on this project.</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <EmptyState icon={Activity} title="No activity yet" description="Actions on this project will appear here." />
        ) : (
          <ul className="space-y-3">
            {(items as Array<{ action?: string; createdAt?: string; username?: string }>).map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                  <Activity className="size-3.5" />
                </div>
                <div>
                  <p className="text-sm">
                    {item.username ? <span className="font-medium">@{item.username} </span> : null}
                    {item.action}
                  </p>
                  {item.createdAt ? (
                    <p className="text-xs text-muted-foreground">{timeAgo(item.createdAt)}</p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
