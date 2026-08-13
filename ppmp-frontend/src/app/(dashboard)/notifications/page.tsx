"use client";

import * as React from "react";
import { Bell, BellRing, CheckCheck, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { FullPageLoader } from "@/components/ui/spinner";
import { notificationsService } from "@/services/notifications";
import { getErrorMessage, timeAgo } from "@/lib/utils";
import type { Notification } from "@/lib/types";

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [loading, setLoading] = React.useState(true);

  const load = React.useCallback(() => {
    notificationsService
      .getAll()
      .then((data) => setNotifications(data.content))
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setLoading(false));
  }, []);

  React.useEffect(load, [load]);

  const markRead = async (id: string) => {
    await notificationsService.markRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllRead = async () => {
    await notificationsService.markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success("All notifications marked as read");
  };

  const remove = async (id: string) => {
    await notificationsService.remove(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.success("Notification deleted");
  };

  if (loading) return <FullPageLoader label="Loading notifications..." />;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
          </p>
        </div>
        {unreadCount > 0 ? (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <CheckCheck className="size-4" />
            Mark all read
          </Button>
        ) : null}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="Notifications about tasks, invitations and deadlines will appear here."
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Inbox</CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-3 py-3 ${notification.isRead ? "opacity-60" : ""}`}
              >
                <div
                  className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full ${
                    notification.isRead
                      ? "bg-muted text-muted-foreground"
                      : "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300"
                  }`}
                >
                  <BellRing className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm">{notification.message}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {timeAgo(notification.createdAt)} · {notification.type.replace(/_/g, " ")}
                  </p>
                </div>
                {!notification.isRead ? (
                  <Button size="sm" variant="ghost" onClick={() => markRead(notification.id)}>
                    Mark read
                  </Button>
                ) : null}
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => remove(notification.id)}
                  className="text-rose-500 hover:bg-rose-500/10 hover:text-rose-500"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
