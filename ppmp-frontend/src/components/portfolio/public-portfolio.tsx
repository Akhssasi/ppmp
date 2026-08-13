import Link from "next/link";
import {
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  FolderKanban,
  Globe,
  Mail,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GitHubIcon, LinkedInIcon, XIcon } from "@/components/brand-icons";
import { PROJECT_STATUS_META } from "@/lib/constants";
import { formatDate, initials } from "@/lib/utils";
import type { PublicPortfolio } from "@/lib/types";

function StatusBadge({ status }: { status: keyof typeof PROJECT_STATUS_META }) {
  const meta = PROJECT_STATUS_META[status];
  return (
    <Badge className={meta.className} variant="outline">
      <span className={`mr-1 size-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </Badge>
  );
}

const SOCIAL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  twitter: XIcon,
};

export function PublicPortfolioView({ portfolio }: { portfolio: PublicPortfolio }) {
  const { user, settings: rawSettings, projects } = portfolio;
  const settings = rawSettings ?? {
    headline: null,
    aboutText: null,
    customLinks: {},
    showContactForm: false,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/40">
      <header className="border-b bg-card/70 backdrop-blur">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-12 text-center sm:px-6">
          <div className="flex size-24 items-center justify-center rounded-full bg-violet-600 text-3xl font-bold text-white shadow-lg">
            {initials(user.fullName || user.username)}
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-tight">
            {user.fullName || user.username}
          </h1>
          {settings.headline ? (
            <p className="mt-2 text-lg text-muted-foreground">{settings.headline}</p>
          ) : null}
          {user.bio ? (
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {user.bio}
            </p>
          ) : null}

          {settings.customLinks && Object.keys(settings.customLinks).length > 0 ? (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              {Object.entries(settings.customLinks).map(([label, url]) => {
                const Icon = SOCIAL_ICONS[label.toLowerCase()] ?? Globe;
                return (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors hover:bg-accent"
                  >
                    <Icon className="size-4" />
                    {label}
                  </a>
                );
              })}
            </div>
          ) : null}

          <div className="mt-6 grid w-full max-w-md grid-cols-3 gap-3">
            <StatBox label="Projects" value={portfolio.totalProjects} icon={FolderKanban} />
            <StatBox label="Completed" value={portfolio.completedProjects} icon={CheckCircle2} />
            <StatBox label="In progress" value={portfolio.inProgressProjects} icon={Calendar} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        {settings.aboutText ? (
          <section className="mb-10">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              About
            </h2>
            <p className="whitespace-pre-line text-sm leading-relaxed">{settings.aboutText}</p>
          </section>
        ) : null}

        {portfolio.topTechnologies.length > 0 ? (
          <section className="mb-10">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Technologies
            </h2>
            <div className="flex flex-wrap gap-2">
              {portfolio.topTechnologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Projects ({projects.length})
          </h2>
          {projects.length === 0 ? (
            <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
              No public projects yet.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {projects.map((project) => (
                <article key={project.id} className="group flex flex-col rounded-xl border bg-card p-5 transition-shadow hover:shadow-md">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <StatusBadge status={project.status} />
                    <ArrowUpRight className="size-4 text-muted-foreground transition-colors group-hover:text-violet-500" />
                  </div>
                  <h3 className="font-semibold tracking-tight">{project.title}</h3>
                  <p className="mt-1 flex-1 text-sm text-muted-foreground">
                    {project.shortDescription || "No description provided."}
                  </p>
                  {project.technologyNames.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.technologyNames.slice(0, 5).map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <div className="mt-4 flex items-center justify-between border-t pt-3">
                    <span className="text-xs text-muted-foreground">
                      {project.endDate
                        ? `Completed ${formatDate(project.endDate)}`
                        : `Updated ${formatDate(project.updatedAt)}`}
                    </span>
                    {project.progressPercentage !== null &&
                    project.progressPercentage !== undefined ? (
                      <span className="text-xs font-semibold text-violet-600 dark:text-violet-400">
                        {project.progressPercentage}%
                      </span>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {settings.showContactForm ? (
          <section className="mt-12 rounded-xl border bg-card p-6">
            <h2 className="mb-2 font-semibold">Get in touch</h2>
            <p className="text-sm text-muted-foreground">
              Want to work together? Reach out to{" "}
              <a href={`mailto:${user.username}`} className="font-medium text-violet-600 underline-offset-2 hover:underline dark:text-violet-400">
                {user.username}
              </a>
              .
            </p>
            <a
              href={`mailto:${user.username}`}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700"
            >
              <Mail className="size-4" />
              Contact
            </a>
          </section>
        ) : null}
      </main>

      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        <Link href="/" className="font-medium text-violet-600 hover:underline dark:text-violet-400">
          Powered by PPMP
        </Link>
      </footer>
    </div>
  );
}

function StatBox({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-xl border bg-card p-3">
      <Icon className="mx-auto size-4 text-muted-foreground" />
      <p className="mt-1 text-lg font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
