import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  Binary,
  BookOpen,
  Bot,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  Clock,
  Cpu,
  FileText,
  Play,
  TrendingUp,
} from "lucide-react";
import { aimlTopics, getAllAimlLevels, type AimlTopic } from "@/lib/aiml-curriculum";

export const Route = createFileRoute("/learning-hub/aiml/")(({
  head: () => ({
    meta: [
      { title: "AI & ML Track — Nexora" },
      { name: "description", content: "Hands-on AI and Machine Learning curriculum: vector math, logistic regression, neural networks, and NLP embeddings." },
    ],
  }),
  component: AimlDashboardPage,
} as any));

// Icon map for topic iconNames stored in curriculum data
const ICON_MAP: Record<string, typeof Bot> = {
  Binary,
  TrendingUp,
  Cpu,
  FileText,
  Bot,
};

const DIFFICULTY_COLOR: Record<AimlTopic["difficulty"], string> = {
  Beginner: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  Intermediate: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  Advanced: "text-red-400 bg-red-500/10 border-red-500/30",
};

function AimlDashboardPage() {
  const allLevels = getAllAimlLevels();
  // Use simple local storage key so progress persists across reloads for guests
  const [completed, setCompleted] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const raw = localStorage.getItem("nexora_aiml_progress_v1");
      return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
    } catch {
      return new Set();
    }
  });

  const isLevelDone = (topicId: string, levelId: string) =>
    completed.has(`${topicId}_${levelId}`);

  const completedLessons = allLevels.filter((l) =>
    isLevelDone(l.topicId, l.level.id)
  ).length;

  const nextLevel =
    allLevels.find((l) => !isLevelDone(l.topicId, l.level.id)) ??
    allLevels[0];

  const [openTopics, setOpenTopics] = useState<Set<string>>(
    () => new Set([nextLevel.topicId])
  );

  const toggleTopic = (id: string) =>
    setOpenTopics((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 pb-20 pt-10 md:px-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link to="/learning-hub" className="transition hover:text-foreground">
          Learning Hub
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">AI &amp; Machine Learning</span>
      </nav>

      {/* Header */}
      <header className="mt-5 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400">
            <Bot className="h-3.5 w-3.5" />
            AI &amp; Machine Learning Track
          </div>
          <h1
            className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            AI &amp; ML Curriculum
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            From vector mathematics to neural networks — the exact AI/ML foundations that
            modern software engineers and data scientists need. Each lesson builds intuition
            with theory, quizzes, and in-browser Python challenges.
          </p>
        </div>

        <Link
          to="/learning-hub/aiml/$topicId/$levelId"
          params={{ topicId: nextLevel.topicId, levelId: nextLevel.level.id }}
          className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow transition hover:brightness-110 md:self-auto"
        >
          <Play className="h-4 w-4 fill-current" />
          {completedLessons > 0 ? "Continue" : "Start"}: {nextLevel.level.title}
        </Link>
      </header>

      {/* Progress summary */}
      <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-border/70 bg-border/60 sm:grid-cols-3">
        <div className="bg-surface p-5">
          <p className="text-xs text-muted-foreground">Lessons completed</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
            {completedLessons} / {allLevels.length}
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-cyan-500 transition-all"
              style={{ width: `${(completedLessons / allLevels.length) * 100}%` }}
            />
          </div>
        </div>
        <div className="bg-surface p-5">
          <p className="text-xs text-muted-foreground">Topics covered</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
            {aimlTopics.length}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Math · ML · Deep Learning · NLP
          </p>
        </div>
        <div className="bg-surface p-5">
          <p className="text-xs text-muted-foreground">Up next</p>
          <p className="mt-1 truncate text-lg font-semibold text-foreground">
            {nextLevel.topic.title}
          </p>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {nextLevel.level.title}
          </p>
        </div>
      </div>

      {/* Topic list */}
      <div className="mt-10 space-y-3">
        <p
          className="text-xs uppercase tracking-[0.28em] text-cyan-400"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          / Curriculum
        </p>
        {aimlTopics.map((topic) => {
          const TopicIcon = ICON_MAP[topic.iconName] ?? Bot;
          const isOpen = openTopics.has(topic.id);
          const topicLevels = allLevels.filter((l) => l.topicId === topic.id);
          const topicDone = topicLevels.filter((l) =>
            isLevelDone(l.topicId, l.level.id)
          ).length;

          return (
            <div
              key={topic.id}
              className="overflow-hidden rounded-2xl border border-border/70 bg-surface/50"
            >
              {/* Topic header */}
              <button
                onClick={() => toggleTopic(topic.id)}
                className="flex w-full cursor-pointer items-center gap-4 px-5 py-4 text-left transition hover:bg-surface"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cyan-500/20 text-cyan-400">
                  <TopicIcon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      {topic.title}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${DIFFICULTY_COLOR[topic.difficulty]}`}
                    >
                      {topic.difficulty}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {topicDone}/{topicLevels.length} lessons
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {topic.description}
                  </p>
                </div>
                {topicDone === topicLevels.length ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                ) : (
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                )}
              </button>

              {/* Levels list */}
              {isOpen && (
                <div className="divide-y divide-border/50 border-t border-border/50">
                  {topicLevels.map(({ level }) => {
                    const done = isLevelDone(topic.id, level.id);
                    const isNext =
                      nextLevel.topicId === topic.id &&
                      nextLevel.level.id === level.id;
                    return (
                      <Link
                        key={level.id}
                        to="/learning-hub/aiml/$topicId/$levelId"
                        params={{ topicId: topic.id, levelId: level.id }}
                        className="flex items-center gap-4 px-5 py-3.5 transition hover:bg-surface"
                      >
                        {done ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                        ) : (
                          <Circle
                            className={`h-4 w-4 shrink-0 ${isNext ? "text-cyan-400" : "text-muted-foreground"}`}
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-sm font-medium ${done ? "text-muted-foreground line-through" : isNext ? "text-foreground" : "text-foreground/80"}`}
                          >
                            {level.title}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {level.shortDesc}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {level.estimatedMinutes}m
                          </span>
                          {level.requiresCoding && (
                            <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-400">
                              Code
                            </span>
                          )}
                          {isNext && (
                            <span className="flex items-center gap-1 font-medium text-cyan-400">
                              Start <ArrowRight className="h-3.5 w-3.5" />
                            </span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* What you'll build section */}
      <section className="mt-12 rounded-3xl border border-cyan-500/20 bg-cyan-500/5 p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
          What you'll learn
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {[
            { icon: Binary, label: "Vector Math", desc: "NumPy, dot products, Euclidean norms" },
            { icon: TrendingUp, label: "Classical ML", desc: "Sigmoid, Logistic Regression, Gradient Descent" },
            { icon: Cpu, label: "Deep Learning", desc: "Softmax, backpropagation, ReLU activations" },
            { icon: FileText, label: "NLP & Embeddings", desc: "Cosine similarity, RAG, vector search" },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="rounded-xl border border-border/60 bg-background/50 p-4">
              <Icon className="h-5 w-5 text-cyan-400" />
              <p className="mt-2 text-sm font-semibold text-foreground">{label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/learning-hub/aiml/$topicId/$levelId"
            params={{ topicId: nextLevel.topicId, levelId: nextLevel.level.id }}
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
          >
            <BookOpen className="h-4 w-4" />
            Begin the AI/ML track
          </Link>
        </div>
      </section>
    </div>
  );
}

