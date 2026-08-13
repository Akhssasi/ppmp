"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { ExternalLink, Link2, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { portfolioService } from "@/services/portfolio";
import { useAuthStore } from "@/store/auth";
import { getErrorMessage } from "@/lib/utils";
import type { PortfolioSettings } from "@/lib/types";

const schema = z.object({
  headline: z.string().max(255).optional().or(z.literal("")),
  aboutText: z.string().optional().or(z.literal("")),
  theme: z.string().max(50).optional().or(z.literal("")),
});

type Values = z.infer<typeof schema>;

export default function PortfolioSettingsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [settings, setSettings] = React.useState<PortfolioSettings | null>(null);
  const [customLinks, setCustomLinks] = React.useState<Record<string, string>>({});
  const [saving, setSaving] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { headline: "", aboutText: "", theme: "" },
  });

  React.useEffect(() => {
    portfolioService
      .getMine()
      .then((portfolio) => {
        const s = portfolio.settings;
        setSettings(s);
        setCustomLinks(s?.customLinks ?? {});
        reset({
          headline: s?.headline ?? "",
          aboutText: s?.aboutText ?? "",
          theme: s?.theme ?? "",
        });
      })
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setLoading(false));
  }, [reset]);

  const addLink = () => {
    const entries = Object.entries(customLinks);
    setCustomLinks({ ...customLinks, [`custom_${entries.length + 1}`]: "" });
  };

  const updateLink = (key: string, value: string) => {
    setCustomLinks((prev) => ({ ...prev, [key]: value }));
  };

  const removeLink = (key: string) => {
    setCustomLinks((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const onSubmit = async (values: Values) => {
    setSaving(true);
    try {
      const cleanedLinks: Record<string, string> = {};
      Object.entries(customLinks).forEach(([key, value]) => {
        const trimmed = value.trim();
        if (trimmed) cleanedLinks[key] = trimmed;
      });
      const updated = await portfolioService.updateSettings({
        headline: values.headline || null,
        aboutText: values.aboutText || null,
        theme: values.theme || null,
        showGithubStats: settings?.showGithubStats ?? true,
        showContactForm: settings?.showContactForm ?? true,
        customLinks: cleanedLinks,
      });
      setSettings(updated);
      setCustomLinks(updated.customLinks ?? {});
      toast.success("Portfolio settings saved");
      router.refresh();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
        Loading portfolio settings...
      </div>
    );
  }

  const slug = user?.portfolioSlug ?? user?.username ?? "";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Portfolio settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Customize your public portfolio page.{" "}
          {slug ? (
            <a
              href={`/p/${slug}`}
              target="_blank"
              className="inline-flex items-center gap-1 font-medium text-violet-600 hover:underline dark:text-violet-400"
            >
              View live portfolio <ExternalLink className="size-3" />
            </a>
          ) : null}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile & branding</CardTitle>
          <CardDescription>Your public URL is {slug ? `/p/${slug}` : "not set yet"}.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="headline">Headline</Label>
              <Input id="headline" placeholder="e.g. Full-stack engineer building tools for developers" {...register("headline")} />
              {errors.headline ? <p className="text-sm text-rose-500">{errors.headline.message}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="about">About text</Label>
              <Textarea id="about" rows={5} placeholder="Tell visitors about yourself and your work..." {...register("aboutText")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Input id="theme" placeholder="light | dark | auto" {...register("theme")} />
            </div>

            <div className="space-y-3 border-t pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Custom links</Label>
                  <p className="text-xs text-muted-foreground">Add links to your GitHub, LinkedIn, etc.</p>
                </div>
                <Button type="button" size="sm" variant="outline" onClick={addLink}>
                  <Plus className="size-4" /> Add link
                </Button>
              </div>
              {Object.entries(customLinks).length === 0 ? (
                <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                  No custom links yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(customLinks).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      <Link2 className="size-4 shrink-0 text-muted-foreground" />
                      <span className="w-24 shrink-0 text-xs text-muted-foreground">{key}</span>
                      <Input value={value} onChange={(e) => updateLink(key, e.target.value)} placeholder="https://..." />
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => removeLink(key)}
                        className="text-rose-500 hover:bg-rose-500/10 hover:text-rose-500"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end border-t pt-4">
              <Button type="submit" disabled={saving}>
                {saving ? <Spinner className="size-4 text-white" /> : null}
                Save settings
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
