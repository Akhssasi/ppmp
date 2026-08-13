import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { LandingFooter, LandingNavbar } from "@/components/layout/landing";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "PPMP — Plan, build, and showcase your software projects",
  description:
    "Manage projects, track tasks and milestones, and turn your work into a public portfolio — all in one platform built for developers.",
};

const FEATURES = [
  {
    index: "01",
    title: "Full project lifecycle",
    description:
      "Track projects through planning, execution, completion and archival with rich metadata.",
  },
  {
    index: "02",
    title: "Tasks & milestones",
    description:
      "Kanban task boards with priorities, deadlines and a milestone timeline to hit targets.",
  },
  {
    index: "03",
    title: "Public portfolio",
    description:
      "Generate a clean, shareable portfolio page to showcase your work to recruiters and clients.",
  },
  {
    index: "04",
    title: "Analytics dashboard",
    description:
      "Understand your output with status distributions, technology usage and activity trends.",
  },
  {
    index: "05",
    title: "Team collaboration",
    description:
      "Invite collaborators, assign tasks, and keep a full activity log for every project.",
  },
  {
    index: "06",
    title: "Share anywhere",
    description:
      "Export your portfolio as PDF or share a personalized public link with the world.",
  },
];

const STEPS = [
  {
    index: "01",
    title: "Create your workspace",
    description:
      "Sign up in seconds, then create projects and invite your collaborators to the board.",
  },
  {
    index: "02",
    title: "Track the work",
    description:
      "Break projects into tasks and milestones, assign priorities and watch deadlines land.",
  },
  {
    index: "03",
    title: "Showcase it all",
    description:
      "Your project history becomes a stunning public portfolio you can share anywhere.",
  },
];

const TECHNOLOGIES = [
  "React",
  "Next.js",
  "TypeScript",
  "Java",
  "Spring Boot",
  "PostgreSQL",
  "Docker",
  "Kubernetes",
  "AWS",
];

const TICKER_ITEMS = [
  "Project lifecycle",
  "Kanban tasks",
  "Milestones",
  "Public portfolio",
  "Team collaboration",
  "Analytics",
  "PDF export",
];

const AVATARS = [
  { initial: "A", className: "bg-gradient-to-br from-violet-600 to-fuchsia-500" },
  { initial: "M", className: "bg-gradient-to-br from-sky-500 to-violet-600" },
  { initial: "S", className: "bg-gradient-to-br from-fuchsia-500 to-orange-400" },
  { initial: "K", className: "bg-gradient-to-br from-emerald-500 to-sky-500" },
];

function CodeLine({ indent = 0, children }: { indent?: number; children: ReactNode }) {
  return (
    <div className="flex">
      <span className="w-8 shrink-0 select-none pr-4 text-right text-muted-foreground/50">
      </span>
      <span style={{ paddingLeft: `${indent}ch` }} className="whitespace-pre-wrap break-words">
        {children}
      </span>
    </div>
  );
}

function CodePanel() {
  return (
    <div className="relative">
      <div className="absolute -inset-x-6 -top-6 bottom-6 -z-10 rounded-[2rem] bg-gradient-to-b from-violet-600/15 via-fuchsia-500/10 to-transparent blur-2xl sm:-inset-x-16" />
      <div className="overflow-hidden rounded-2xl border bg-card shadow-2xl shadow-violet-950/10 dark:shadow-black/40">
        <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-2.5">
          <div className="flex gap-1.5">
            <span className="size-3 rounded-full bg-rose-400" />
            <span className="size-3 rounded-full bg-amber-400" />
            <span className="size-3 rounded-full bg-emerald-400" />
          </div>
          <div className="ml-2 flex items-center gap-2 rounded-md bg-background px-3 py-1 font-mono text-xs text-muted-foreground">
            <span className="text-violet-600 dark:text-violet-400">~/portfolio</span>
            <span className="h-3.5 w-px bg-border" />
            project.json
          </div>
        </div>

        <div className="overflow-x-auto bg-muted/20 p-4 font-mono text-[13px] leading-6 sm:p-6 sm:text-sm sm:leading-7">
          <CodeLine>
            <span className="text-muted-foreground">{`{`}</span>
          </CodeLine>
          <CodeLine indent={2}>
            <span className="text-violet-600 dark:text-violet-400">&quot;name&quot;</span>
            <span className="text-muted-foreground">: </span>
            <span className="text-emerald-600 dark:text-emerald-400">&quot;AI Resume Builder&quot;</span>
            <span className="text-muted-foreground">,</span>
          </CodeLine>
          <CodeLine indent={2}>
            <span className="text-violet-600 dark:text-violet-400">&quot;status&quot;</span>
            <span className="text-muted-foreground">: </span>
            <span className="text-emerald-600 dark:text-emerald-400">&quot;IN_PROGRESS&quot;</span>
            <span className="text-muted-foreground">,</span>
          </CodeLine>
          <CodeLine indent={2}>
            <span className="text-violet-600 dark:text-violet-400">&quot;progress&quot;</span>
            <span className="text-muted-foreground">: </span>
            <span className="text-foreground">80</span>
            <span className="text-muted-foreground">,</span>
          </CodeLine>
          <CodeLine indent={2}>
            <span className="text-violet-600 dark:text-violet-400">&quot;milestones&quot;</span>
            <span className="text-muted-foreground">: [</span>
          </CodeLine>
          <CodeLine indent={4}>
            <span className="text-muted-foreground">{`{`}</span>
            <span className="text-violet-600 dark:text-violet-400"> &quot;title&quot;</span>
            <span className="text-muted-foreground">: </span>
            <span className="text-emerald-600 dark:text-emerald-400">&quot;MVP&quot;</span>
            <span className="text-muted-foreground">, </span>
            <span className="text-violet-600 dark:text-violet-400">&quot;done&quot;</span>
            <span className="text-muted-foreground">: </span>
            <span className="text-emerald-600 dark:text-emerald-400">true</span>
            <span className="text-muted-foreground">{`}`}</span>
            <span className="text-muted-foreground">,</span>
          </CodeLine>
          <CodeLine indent={4}>
            <span className="text-muted-foreground">{`{`}</span>
            <span className="text-violet-600 dark:text-violet-400"> &quot;title&quot;</span>
            <span className="text-muted-foreground">: </span>
            <span className="text-emerald-600 dark:text-emerald-400">&quot;Portfolio launch&quot;</span>
            <span className="text-muted-foreground">, </span>
            <span className="text-violet-600 dark:text-violet-400">&quot;done&quot;</span>
            <span className="text-muted-foreground">: </span>
            <span className="text-emerald-600 dark:text-emerald-400">false</span>
            <span className="text-muted-foreground">{`}`}</span>
          </CodeLine>
          <CodeLine indent={2}>
            <span className="text-muted-foreground">],</span>
          </CodeLine>
          <CodeLine indent={2}>
            <span className="text-violet-600 dark:text-violet-400">&quot;technologies&quot;</span>
            <span className="text-muted-foreground">: [</span>
            <span className="text-emerald-600 dark:text-emerald-400">&quot;React&quot;</span>
            <span className="text-muted-foreground">, </span>
            <span className="text-emerald-600 dark:text-emerald-400">&quot;TypeScript&quot;</span>
            <span className="text-muted-foreground">, </span>
            <span className="text-emerald-600 dark:text-emerald-400">&quot;Spring Boot&quot;</span>
            <span className="text-muted-foreground">],</span>
          </CodeLine>
          <CodeLine indent={2}>
            <span className="text-violet-600 dark:text-violet-400">&quot;portfolio&quot;</span>
            <span className="text-muted-foreground">: [</span>
            <span className="text-emerald-600 dark:text-emerald-400">&quot;ppmp.io/alex/portfolio&quot;</span>
            <span className="text-muted-foreground">]</span>
          </CodeLine>
          <CodeLine>
            <span className="text-muted-foreground">{`}`}</span>
          </CodeLine>
        </div>

        <div className="flex items-center justify-between border-t bg-background px-4 py-3 sm:px-6">
          <span className="font-mono text-xs text-muted-foreground">
            $ ppmp generate --portfolio
          </span>
          <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400">
            ✓ published in 0.8s
          </span>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingNavbar />

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div aria-hidden className="absolute inset-0 -z-10">
            <Image
              src="/hero-workspace.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/25 sm:via-background/70 sm:to-background/10" />
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
          </div>

          <div className="mx-auto grid max-w-6xl gap-16 px-4 pb-6 pt-16 sm:px-6 sm:pt-24 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-center lg:gap-12">
            <div className="text-center lg:text-left">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 font-mono text-xs text-muted-foreground shadow-sm">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                now in public beta
              </div>

              <h1 className="text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
                Your code deserves a
                <br />
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-400 bg-clip-text text-transparent">
                    living portfolio
                  </span>
                  <svg
                    aria-hidden
                    className="absolute -bottom-2 left-0 w-full sm:-bottom-3"
                    viewBox="0 0 240 12"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M4 9C58 3 162 3 236 8"
                      stroke="url(#hero-underline)"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient
                        id="hero-underline"
                        x1="4"
                        y1="9"
                        x2="236"
                        y2="9"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#7c3aed" />
                        <stop offset="0.5" stopColor="#d946ef" />
                        <stop offset="1" stopColor="#fb923c" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </h1>

              <p className="mx-auto mt-7 max-w-xl text-lg text-muted-foreground lg:mx-0">
                PPMP is the project portfolio platform for developers. Plan sprints, track tasks
                and milestones, then turn your project history into a stunning public portfolio.
              </p>

              <div className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <Button
                  size="lg"
                  className="bg-foreground text-background shadow-lg shadow-violet-950/10 transition-transform hover:scale-[1.02] hover:bg-foreground/90 hover:shadow-xl"
                  asChild
                >
                  <Link href="/register">Start building free</Link>
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground"
                  asChild
                >
                  <Link href="/login">Explore live demo</Link>
                </Button>
              </div>

              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
                <div className="flex -space-x-2.5">
                  {AVATARS.map((avatar) => (
                    <div
                      key={avatar.initial}
                      className={`flex size-9 items-center justify-center rounded-full text-xs font-bold text-white ring-2 ring-background ${avatar.className}`}
                    >
                      {avatar.initial}
                    </div>
                  ))}
                  <div className="flex size-9 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground ring-2 ring-background">
                    10k+
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Trusted by 10,000+ developers
                  <span className="mt-0.5 block font-mono text-xs text-muted-foreground/70">
                    rated 4.9 / 5 · 1,200+ reviews
                  </span>
                </p>
              </div>
            </div>

            <div id="showcase" className="relative scroll-mt-24">
              <div className="rotate-0 animate-[float_7s_ease-in-out_infinite] sm:rotate-2">
                <CodePanel />
              </div>

              <div className="hidden w-56 rotate-6 rounded-xl border bg-card p-4 shadow-xl shadow-violet-950/10 dark:shadow-black/40 motion-reduce:animate-none animate-[float_6s_ease-in-out_infinite_-1.5s] sm:absolute sm:-top-8 sm:-right-6 sm:block lg:-right-10">
                <p className="font-mono text-xs text-emerald-600 dark:text-emerald-400">
                  ✓ portfolio published
                </p>
                <p className="mt-1.5 font-mono text-xs text-muted-foreground">
                  ppmp.io/alex
                </p>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500" />
                </div>
              </div>

              <div className="hidden w-52 -rotate-6 rounded-xl border bg-card p-4 shadow-xl shadow-violet-950/10 dark:shadow-black/40 motion-reduce:animate-none animate-[float_8s_ease-in-out_infinite_-3s] sm:absolute sm:-bottom-10 sm:-left-4 sm:block lg:-left-8">
                <p className="font-mono text-[11px] text-muted-foreground">
                  milestone hit
                </p>
                <p className="mt-1 font-mono text-sm font-semibold">3 days early</p>
                <p className="mt-2 font-mono text-[10px] text-muted-foreground">
                  portfolio launch · 12 tasks done
                </p>
              </div>
            </div>
          </div>

          <div className="relative mt-14 border-y bg-background/80 py-3.5 backdrop-blur-sm">
            <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
              <div className="flex w-max shrink-0 animate-[marquee_32s_linear_infinite] gap-10 pr-10 motion-reduce:animate-none">
                {[0, 1].map((copy) => (
                  <div key={copy} className="flex shrink-0 items-center gap-10">
                    {TICKER_ITEMS.map((item) => (
                      <span
                        key={`${copy}-${item}`}
                        className="flex items-center gap-10 font-mono text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground"
                      >
                        {item}
                        <span className="text-violet-500/70">✦</span>
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-muted/30">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
            <p className="text-center font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
              built for teams working with
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {TECHNOLOGIES.map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-sm font-semibold text-foreground/40 transition-colors hover:text-foreground/70"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <p className="font-mono text-sm text-violet-600 dark:text-violet-400">
                ( what it does )
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                One platform from idea to showcase
              </h2>
              <p className="mt-4 text-muted-foreground">
                Stop juggling Trello, GitHub and a personal site. PPMP brings the whole journey
                together in a single, focused workspace.
              </p>
            </div>

            <div className="border-t">
              {FEATURES.map((feature) => (
                <div
                  key={feature.index}
                  className="group grid gap-1 border-b py-6 transition-colors hover:bg-muted/40 sm:grid-cols-[64px_1fr] sm:gap-6 sm:px-4"
                >
                  <span className="font-mono text-sm text-muted-foreground/60 transition-colors group-hover:text-violet-600 dark:group-hover:text-violet-400">
                    {feature.index}
                  </span>
                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="border-y bg-muted/30">
          <div className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="font-mono text-sm text-violet-600 dark:text-violet-400">
                ( how it works )
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Up and running in minutes
              </h2>
            </div>

            <div className="mt-12 grid gap-0 md:grid-cols-3 md:gap-6">
              {STEPS.map((step, index) => (
                <div
                  key={step.index}
                  className="relative border-t p-6 md:rounded-xl md:border md:bg-card"
                >
                  {index < STEPS.length - 1 ? (
                    <div
                      aria-hidden
                      className="absolute left-1/2 top-1/2 hidden h-px w-full border-t border-dashed border-muted-foreground/20 md:block"
                    />
                  ) : null}
                  <span className="font-mono text-5xl font-bold tracking-tighter text-foreground/10">
                    {step.index}
                  </span>
                  <h3 className="mt-4 font-semibold">{step.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <p className="font-mono text-sm text-muted-foreground">( they say )</p>
          <blockquote className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">
            &ldquo;My portfolio went from a stale PDF to a live page that updates itself. I just
            do the work — PPMP handles the rest.&rdquo;
          </blockquote>
          <p className="mt-6 font-mono text-sm text-muted-foreground">
            — Alex, full-stack developer
          </p>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <div className="relative overflow-hidden rounded-2xl border bg-foreground px-6 py-16 text-center text-background sm:px-12">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-violet-500/20 blur-3xl"
            />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">
                Your work deserves
                <br />
                a better home.
              </h2>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button
                  size="lg"
                  className="bg-background text-foreground shadow-md hover:bg-background/90"
                  asChild
                >
                  <Link href="/register">Create your portfolio</Link>
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  className="text-background/80 hover:bg-background/10 hover:text-background"
                  asChild
                >
                  <Link href="/login">Explore live demo</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
