"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { ProjectForm } from "@/components/project/project-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FullPageLoader } from "@/components/ui/spinner";
import { projectsService } from "@/services/projects";
import { technologiesService } from "@/services/technologies";
import { getErrorMessage } from "@/lib/utils";
import type { Technology } from "@/lib/types";

export default function NewProjectPage() {
  const router = useRouter();
  const [technologies, setTechnologies] = React.useState<Technology[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    technologiesService
      .getAllUnpaged()
      .then(setTechnologies)
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <FullPageLoader label="Loading technologies..." />;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">New project</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Fill in the details below to create a project.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Project details</CardTitle>
          <CardDescription>Basic information about your project.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectForm
            mode="create"
            technologies={technologies}
            onSubmit={(payload) => projectsService.create(payload)}
            onCancel={() => router.back()}
          />
        </CardContent>
      </Card>
    </div>
  );
}
