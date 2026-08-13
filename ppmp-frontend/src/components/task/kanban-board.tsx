"use client";

import * as React from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus } from "lucide-react";
import { TaskCard } from "@/components/task/task-card";
import { Dialog, DialogBody, DialogHeader } from "@/components/ui/dialog";
import { TaskForm } from "@/components/task/task-form";
import { TASK_COLUMN_ACCENTS, TASK_COLUMN_TITLES, TASK_STATUSES } from "@/lib/constants";
import type { Member, Task, TaskRequest, TaskStatus } from "@/lib/types";

interface KanbanBoardProps {
  tasks: Task[];
  members: Member[];
  onStatusChange: (taskId: string, status: TaskStatus) => Promise<void>;
  onUpdate: (taskId: string, payload: TaskRequest) => Promise<unknown>;
  onDelete: (taskId: string) => Promise<void>;
  onCreate: (payload: TaskRequest, status: TaskStatus) => Promise<unknown>;
  onTasksChange?: (updater: (prev: Task[]) => Task[]) => void;
}

interface DraggableTaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

function DraggableTaskCard({ task, onEdit, onDelete }: DraggableTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={isDragging ? "opacity-40" : ""}
    >
      <TaskCard task={task} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}

export function KanbanBoard({
  tasks,
  members,
  onStatusChange,
  onUpdate,
  onDelete,
  onCreate,
  onTasksChange,
}: KanbanBoardProps) {
  const [activeTask, setActiveTask] = React.useState<Task | null>(null);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const [addColumn, setAddColumn] = React.useState<TaskStatus | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const tasksByStatus = (status: TaskStatus) =>
    tasks
      .filter((task) => task.status === status)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const moveTask = (taskId: string, status: TaskStatus) => {
    onTasksChange?.((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, status } : task)),
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const draggedTask = tasks.find((t) => t.id === active.id);
    if (!draggedTask) return;

    const overId = String(over.id);
    const overStatus = TASK_STATUSES.find((s) => s === overId);

    let nextStatus: TaskStatus | null = null;
    if (overStatus) {
      nextStatus = overStatus;
    } else {
      const overTask = tasks.find((t) => t.id === overId);
      if (overTask) nextStatus = overTask.status;
    }

    if (!nextStatus || nextStatus === draggedTask.status) return;

    const previousStatus = draggedTask.status;
    moveTask(draggedTask.id, nextStatus);
    try {
      await onStatusChange(draggedTask.id, nextStatus);
    } catch {
      moveTask(draggedTask.id, previousStatus);
    }
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {TASK_STATUSES.map((status) => {
            const columnTasks = tasksByStatus(status);
            return (
              <div key={status} className="flex min-h-[300px] flex-col rounded-xl bg-muted/50 p-3">
                <div className="mb-3 flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className={`size-2 rounded-full ${TASK_COLUMN_ACCENTS[status]}`} />
                    <h3 className="text-sm font-semibold">{TASK_COLUMN_TITLES[status]}</h3>
                    <span className="rounded-full bg-background px-2 py-0.5 text-xs font-medium text-muted-foreground">
                      {columnTasks.length}
                    </span>
                  </div>
                  <button
                    onClick={() => setAddColumn(status)}
                    className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    aria-label={`Add task to ${TASK_COLUMN_TITLES[status]}`}
                  >
                    <Plus className="size-4" />
                  </button>
                </div>

                <SortableContext
                  items={columnTasks.map((t) => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex flex-1 flex-col gap-2">
                    {columnTasks.map((task) => (
                      <DraggableTaskCard
                        key={task.id}
                        task={task}
                        onEdit={(t) => setEditingTask(t)}
                        onDelete={(t) => {
                          if (confirm(`Delete task "${t.title}"?`)) onDelete(t.id);
                        }}
                      />
                    ))}
                    {columnTasks.length === 0 ? (
                      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed p-4 text-xs text-muted-foreground">
                        Drop tasks here
                      </div>
                    ) : null}
                  </div>
                </SortableContext>
              </div>
            );
          })}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="w-[350px]">
              <TaskCard task={activeTask} onEdit={() => {}} onDelete={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <Dialog open={Boolean(addColumn)} onOpenChange={() => setAddColumn(null)}>
        <DialogHeader
          title={`New task in ${addColumn ? TASK_COLUMN_TITLES[addColumn] : ""}`}
          description="Fill in the task details below."
          onClose={() => setAddColumn(null)}
        />
        <DialogBody>
          {addColumn ? (
            <TaskForm
              defaultStatus={addColumn}
              members={members}
              onSubmit={(payload) => onCreate(payload, addColumn)}
              onDone={() => setAddColumn(null)}
            />
          ) : null}
        </DialogBody>
      </Dialog>

      <Dialog open={Boolean(editingTask)} onOpenChange={() => setEditingTask(null)}>
        <DialogHeader
          title="Edit task"
          description="Update the task details."
          onClose={() => setEditingTask(null)}
        />
        <DialogBody>
          {editingTask ? (
            <TaskForm
              task={editingTask}
              members={members}
              onSubmit={(payload) => onUpdate(editingTask.id, payload)}
              onDone={() => setEditingTask(null)}
            />
          ) : null}
        </DialogBody>
      </Dialog>
    </>
  );
}
