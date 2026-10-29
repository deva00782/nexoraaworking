import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Bot,
  CheckCircle2,
  Cloud,
  Code2,
  Cpu,
  Database,
  Globe,
  Layers,
  ListChecks,
  Sparkles,
  Target,
  Zap,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { useDsaProgress } from "@/hooks/useDsaProgress";
import { useSolvedProblems } from "@/hooks/useSolvedProblems";
import { dsaTopics, getAllLevels } from "@/lib/dsa-curriculum";
import { allRoadmapProblems, dsaPhases } from "@/lib/dsa-roadmap";
import { aimlTopics, getAllAimlLevels } from "@/lib/aiml-curriculum";
import { fsdTopics, getAllFsdLevels } from "@/lib/fsd-curriculum";
import { TONES, tint } from "@/lib/module-tones";

export const Route = createFileRoute("/learning-hub/")({
  head: () => ({ meta: [{ title: "Learning Hub — Nexora" }] }),
  component: LearningHubPage,
});

const UPCOMING_ROADMAP: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Cpu, title: "System Design", desc: "Scalability, caching, queues, sharding, and microservices" },
  {
    icon: Database,
    title: "Database Engineering & SQL",
    desc: "B-Trees, indexing strategies, transactions, ACID, and query tuning",
  },
  { icon: Cloud, title: "Cloud & DevOps", desc: "Docker, Kubernetes, CI/CD pipelines, and AWS cloud infra" },
];

function LearningHubPage() {
  const { progress } = useDsaProgress();
  const { solved } = useSolvedProblems();
  const allLevels = getAllLevels();
  const next = allLevels.find(
    (l) => !progress.completedLevels[`${l.topicId}_${l.level.id}`]?.completed,
  );
  const solvedCount = allRoadmapProblems.filter((p) => solved.has(p.id)).length;
  const started = progress.totalCompleted > 0 || solvedCount > 0;

  return (
    <div className="mx-auto min-h-screen max-w-7xl space-y-14 px-4 pb-20 pt-10 md:px-8">
      {/* Header */}
      <header className="mx-auto max-w-3xl space-y-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 px-4 py-1.5 text-xs font-semibold text-primary glass">
          <Sparkles className="h-3.5 w-3.5" /> Nexora Learning Hub
        </div>
        <h1
          className="text-4xl font-black tracking-tight md:text-5xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Learn it properly, <span className="text-gradient-gold">one step at a time.</span>
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
          Guided paths with short lessons, concept quizzes, a built-in code editor and hand-picked
          practice problems.
        </p>
      </header>

      {/* Featured DSA path */}
      <section className="relative overflow-hidden rounded-3xl border border-primary/30 bg-surface/40 shadow-glow backdrop-blur">
        <div
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-30 blur-3xl"
          style={{ background: "var(--gradient-gold)" }}
        />
        <div className="relative grid gap-8 p-6 md:p-10 lg:grid-cols-[1.25fr_1fr]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span
                className="grid h-14 w-14 place-items-center rounded-2xl text-primary-foreground shadow-glow"
                style={{ background: "var(--gradient-gold)" }}
              >
                <Code2 className="h-7 w-7" />
              </span>
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
                style={{ background: tint(TONES.resume, 0.12), color: TONES.resume }}
              >
                <CheckCircle2 className="h-3.5 w-3.5" /> Available now
              </span>
            </div>
            <h2
              className="mt-5 text-3xl font-bold tracking-tight md:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Data Structures & Algorithms
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              From Big-O basics to dynamic programming — the exact topics placement interviews test,
              in the order you should learn them.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Fact icon={Layers} value={dsaPhases.length} label="Steps" />
              <Fact icon={Target} value={dsaTopics.length} label="Topics" />
              <Fact icon={BookOpen} value={allLevels.length} label="Lessons" />
              <Fact icon={ListChecks} value={allRoadmapProblems.length} label="Problems" />
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              {next ? (
                <Link
                  to="/learning-hub/dsa/$topicId/$levelId"
                  params={{ topicId: next.topicId, levelId: next.level.id }}
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-primary-foreground shadow-glow transition hover:scale-[1.02]"
                  style={{ background: "var(--gradient-gold)" }}
                >
                  <BookOpen className="h-4 w-4" />
                  {started ? "Continue learning" : "Start learning"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : null}
              <Link
                to="/learning-hub/dsa"
                className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-surface/60 px-5 py-3 text-sm font-semibold transition hover:border-primary/50"
              >
                View full roadmap
              </Link>
            </div>
          </div>

          {/* Personal progress */}
          <div className="rounded-2xl border border-border/60 bg-background/50 p-5 md:p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Your progress
            </p>
            <div className="mt-4 flex items-end gap-2">
              <span className="text-5xl font-bold tabular-nums">{progress.percentComplete}%</span>
              <span className="pb-2 text-sm text-muted-foreground">of the path</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${progress.percentComplete}%`,
                  background: "var(--gradient-gold)",
                }}
              />
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-border/50 p-3">
                <dt className="text-xs text-muted-foreground">Lessons done</dt>
                <dd className="mt-0.5 text-lg font-semibold tabular-nums">
                  {progress.totalCompleted}{" "}
                  <span className="text-sm text-muted-foreground">/ {progress.totalLevels}</span>
                </dd>
              </div>
              <div className="rounded-xl border border-border/50 p-3">
                <dt className="text-xs text-muted-foreground">Problems solved</dt>
                <dd className="mt-0.5 text-lg font-semibold tabular-nums">
                  {solvedCount}{" "}
                  <span className="text-sm text-muted-foreground">
                    / {allRoadmapProblems.length}
                  </span>
                </dd>
              </div>
            </dl>
            {next && (
              <div className="mt-4 rounded-xl p-3" style={{ background: tint(TONES.dsa, 0.08) }}>
                <p className="text-xs text-muted-foreground">Up next</p>
                <p className="mt-0.5 truncate text-sm font-semibold">
                  {next.topic.title} · {next.level.title}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Additional Learning Tracks Grid */}
      <section className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p
              className="text-xs uppercase tracking-[0.28em] text-primary"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              / Specialized Career Tracks
            </p>
            <h2
              className="mt-2 text-2xl font-bold tracking-tight md:text-3xl text-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Explore Domain Mastery Tracks
            </h2>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* AI & ML Track Card */}
          <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-surface/50 p-6 md:p-8 space-y-6 shadow-card hover:border-cyan-500/50 transition">
            <div className="flex items-center justify-between">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-500/20 text-cyan-400 font-bold">
                <Bot className="h-6 w-6" />
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <CheckCircle2 className="h-3.5 w-3.5" /> Active Track
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">AI & Machine Learning</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Vector math, NumPy broadcasting, Logistic Regression, Softmax distributions, and vector embeddings for RAG systems.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-xl border border-border/50 bg-background/50 p-2.5 text-center">
                <div className="text-lg font-bold text-foreground">{aimlTopics.length}</div>
                <div className="text-[10px] text-muted-foreground">Topics</div>
              </div>
              <div className="rounded-xl border border-border/50 bg-background/50 p-2.5 text-center">
                <div className="text-lg font-bold text-foreground">{getAllAimlLevels().length}</div>
                <div className="text-[10px] text-muted-foreground">Lessons</div>
              </div>
              <div className="rounded-xl border border-border/50 bg-background/50 p-2.5 text-center">
                <div className="text-lg font-bold text-cyan-400 font-mono">Python 3</div>
                <div className="text-[10px] text-muted-foreground">WASM Runner</div>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Covered Modules</p>
              <div className="flex flex-wrap gap-1.5">
                {aimlTopics.map((t) => (
                  <span key={t.id} className="text-xs px-2.5 py-1 rounded-lg bg-surface-2 text-foreground/80 border border-border/60">
                    {t.title}
                  </span>
                ))}
              </div>
            </div>
            <Link
              to="/learning-hub/aiml"
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
            >
              <BookOpen className="h-4 w-4" /> Start AI/ML Track <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Full Stack Web Development Track Card */}
          <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-surface/50 p-6 md:p-8 space-y-6 shadow-card hover:border-emerald-500/50 transition">
            <div className="flex items-center justify-between">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/20 text-emerald-400 font-bold">
                <Globe className="h-6 w-6" />
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="h-3.5 w-3.5" /> Active Track
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">Full Stack Web Development</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                React component lifecycle, useState immutability, Express REST APIs, route parameters, and JWT security.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-xl border border-border/50 bg-background/50 p-2.5 text-center">
                <div className="text-lg font-bold text-foreground">{fsdTopics.length}</div>
                <div className="text-[10px] text-muted-foreground">Topics</div>
              </div>
              <div className="rounded-xl border border-border/50 bg-background/50 p-2.5 text-center">
                <div className="text-lg font-bold text-foreground">{getAllFsdLevels().length}</div>
                <div className="text-[10px] text-muted-foreground">Lessons</div>
              </div>
              <div className="rounded-xl border border-border/50 bg-background/50 p-2.5 text-center">
                <div className="text-lg font-bold text-emerald-400 font-mono">TS / React</div>
                <div className="text-[10px] text-muted-foreground">Sandbox</div>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Covered Modules</p>
              <div className="flex flex-wrap gap-1.5">
                {fsdTopics.map((t) => (
                  <span key={t.id} className="text-xs px-2.5 py-1 rounded-lg bg-surface-2 text-foreground/80 border border-border/60">
                    {t.title}
                  </span>
                ))}
              </div>
            </div>
            <Link
              to="/learning-hub/fsd"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
            >
              <BookOpen className="h-4 w-4" /> Start FSD Track <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p
              className="text-xs uppercase tracking-[0.28em]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <span style={{ color: "var(--gold)" }}>/</span>On the roadmap
            </p>
            <h2
              className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              More paths are on the way
            </h2>
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {UPCOMING_ROADMAP.map((r) => (
            <div key={r.title} className="rounded-2xl border border-border/50 bg-surface/30 p-4">
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-surface-2 text-muted-foreground">
                  <r.icon className="h-5 w-5" />
                </span>
                <span className="rounded-full border border-border/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Soon
                </span>
              </div>
              <p className="mt-3 text-sm font-semibold">{r.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{r.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Fact({ icon: Icon, value, label }: { icon: LucideIcon; value: number; label: string }) {
  return (
    <div className="rounded-xl border border-border/50 bg-background/40 p-3">
      <Icon className="h-4 w-4 text-primary" />
      <div className="mt-2 text-2xl font-bold tabular-nums">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
