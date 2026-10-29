import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock,
  Code2,
} from "lucide-react";
import { aimlTopics, getAllAimlLevels } from "@/lib/aiml-curriculum";
import { LevelQuiz } from "@/components/LevelQuiz";
import { CodingWorkspace } from "@/components/CodingWorkspace";
import { SectionLabel } from "@/components/dsa/DsaUi";
import { toast } from "sonner";
import type { CodingChallenge } from "@/lib/dsa-curriculum";

export const Route = createFileRoute("/learning-hub/aiml/$topicId/$levelId")(({
  head: ({ params }) => {
    const found = getAllAimlLevels().find(
      (l) => l.topicId === params.topicId && l.level.id === params.levelId
    );
    return {
      meta: [
        {
          title: found
            ? `${found.level.title} — ${found.topic.title} — Nexora`
            : "AI/ML Lesson — Nexora",
        },
      ],
    };
  },
  component: AimlLevelPage,
} as any));

type LessonTab = "learn" | "quiz" | "code";

const LANGUAGE_LABEL: Record<string, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  python: "Python 3",
  java: "Java",
  cpp: "C++",
};

// Adapter: widens AimlCodingChallenge to the DSA CodingChallenge shape that
// CodingWorkspace expects, filling in the fields it doesn't need with empty strings.
function adaptChallenge(c: {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  functionName: string;
  starterCode: { python: string; javascript: string };
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  testCases: { input: string; expectedOutput: string; isHidden?: boolean }[];
}): CodingChallenge {
  return {
    ...(c as any),
    starterCode: {
      javascript: c.starterCode.javascript,
      typescript: c.starterCode.javascript, // use JS as TS fallback
      python: c.starterCode.python,
      java: "",
      cpp: "",
    },
  } as CodingChallenge;
}

function AimlLevelPage() {
  const { topicId, levelId } = Route.useParams();
  return <LessonView key={`${topicId}_${levelId}`} topicId={topicId} levelId={levelId} />;
}

function LessonView({ topicId, levelId }: { topicId: string; levelId: string }) {
  const [activeTab, setActiveTab] = useState<LessonTab>("learn");

  // -- Local progress (AI/ML progress is tracked client-side) --
  const STORAGE_KEY = "nexora_aiml_progress_v1";
  const [completed, setCompleted] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
    } catch {
      return new Set();
    }
  });
  const [quizPassed, setQuizPassed] = useState(() =>
    completed.has(`${topicId}_${levelId}`)
  );

  const markDone = useCallback(
    (key: string) => {
      setCompleted((prev) => {
        const next = new Set(prev);
        next.add(key);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
        } catch { /* noop */ }
        return next;
      });
    },
    []
  );

  // -- Lesson data --
  const allLevels = getAllAimlLevels();
  const currentIdx = allLevels.findIndex(
    (l) => l.topicId === topicId && l.level.id === levelId
  );
  const current = allLevels[currentIdx];

  if (!current) {
    return (
      <div className="mx-auto max-w-md space-y-4 px-4 pb-20 pt-32 text-center">
        <h2 className="text-2xl font-bold text-foreground">Lesson not found</h2>
        <p className="text-sm text-muted-foreground">
          This AI/ML lesson doesn't exist.
        </p>
        <Link
          to="/learning-hub/aiml"
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-white"
        >
          Back to AI/ML track
        </Link>
      </div>
    );
  }

  const { topic, level } = current;
  const prevLevel = currentIdx > 0 ? allLevels[currentIdx - 1] : null;
  const nextLevel =
    currentIdx < allLevels.length - 1 ? allLevels[currentIdx + 1] : null;
  const lessonNumber =
    topic.levels.findIndex((l) => l.id === level.id) + 1;

  const levelKey = `${topicId}_${levelId}`;
  const isCompleted = completed.has(levelKey);
  const hasCoding = level.requiresCoding && Boolean(level.codingChallenge);

  const handleQuizPassed = (score: number) => {
    setQuizPassed(true);
    if (!hasCoding) markDone(levelKey);
    toast.success(`Quiz passed: ${score}/${level.quiz.questions.length}`);
  };

  const handleCodingSuccess = (_code: string) => {
    markDone(levelKey);
    toast.success("Coding challenge solved! ✨");
  };

  const tabs: { id: LessonTab; label: string; icon: typeof BookOpen; done?: boolean }[] = [
    { id: "learn", label: "Learn", icon: BookOpen },
    { id: "quiz", label: "Quiz", icon: Award, done: quizPassed },
    ...(hasCoding ? [{ id: "code" as const, label: "Code (Python)", icon: Code2, done: isCompleted && quizPassed }] : []),
  ];

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 pb-20 pt-10 md:px-8">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <Link to="/learning-hub" className="transition hover:text-foreground">
          Learning Hub
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link to="/learning-hub/aiml" className="transition hover:text-foreground">
          AI &amp; ML Track
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span>{topic.title}</span>
      </nav>

      {/* Header */}
      <header className="mt-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground">
          <span className="font-semibold uppercase tracking-[0.14em] text-cyan-400">
            Topic {topic.order} · {topic.title}
          </span>
          <span>
            Lesson {lessonNumber} of {topic.levels.length}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {level.estimatedMinutes} min
          </span>
          {isCompleted && (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-medium text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" /> Completed
            </span>
          )}
        </div>
        <h1
          className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {level.title}
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
          {level.shortDesc}
        </p>
      </header>

      {/* Tabs */}
      <div className="mt-8 border-b border-border/70">
        <div className="-mb-px flex gap-6 overflow-x-auto" role="tablist">
          {tabs.map(({ id, label, icon: Icon, done }) => (
            <button
              key={id}
              role="tab"
              aria-selected={activeTab === id}
              onClick={() => setActiveTab(id)}
              className={`inline-flex cursor-pointer items-center gap-2 whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-medium transition ${
                activeTab === id
                  ? "border-cyan-400 text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
              {done && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
            </button>
          ))}
        </div>
      </div>

      {/* Coding tab — full width */}
      {activeTab === "code" && hasCoding && level.codingChallenge ? (
        <div className="mt-8">
          <CodingWorkspace
            challenge={adaptChallenge(level.codingChallenge)}
            topicId={topicId}
            levelId={levelId}
            onSuccess={handleCodingSuccess}
            isAlreadyCompleted={isCompleted}
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <main className="min-w-0">
            {/* Learn tab */}
            {activeTab === "learn" && (
              <article className="space-y-8">
                <p className="rounded-2xl border-l-2 border-cyan-400 bg-surface/60 px-5 py-4 text-sm leading-relaxed text-foreground/90 md:text-base">
                  {level.theory.summary}
                </p>

                {level.theory.sections.map((sec, idx) => (
                  <section key={idx} className="space-y-3">
                    <h2 className="text-lg font-semibold text-foreground md:text-xl">
                      {sec.heading}
                    </h2>
                    <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground md:text-[15px]">
                      {sec.content}
                    </p>

                    {sec.codeSnippet && (
                      <div className="overflow-hidden rounded-xl border border-border/70 bg-[#0b0f19]">
                        <div className="border-b border-border/60 px-4 py-2 text-xs text-muted-foreground">
                          {LANGUAGE_LABEL[sec.codeSnippet.language] ??
                            sec.codeSnippet.language}
                        </div>
                        <pre className="overflow-x-auto p-4 text-[13px] leading-6 text-cyan-200">
                          <code>{sec.codeSnippet.code}</code>
                        </pre>
                      </div>
                    )}

                    {(sec as any).mathFormula && (
                      <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3 font-mono text-sm text-cyan-300">
                        {(sec as any).mathFormula}
                      </div>
                    )}

                    {sec.keyTakeaways && sec.keyTakeaways.length > 0 && (
                      <div className="rounded-xl border border-border/60 bg-surface/40 p-4">
                        <SectionLabel>Key takeaways</SectionLabel>
                        <ul className="mt-3 space-y-2">
                          {sec.keyTakeaways.map((t) => (
                            <li key={t} className="flex gap-2.5 text-sm text-foreground/90">
                              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </section>
                ))}

                {/* CTA to quiz */}
                <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-surface/40 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-foreground">Check your understanding</p>
                    <p className="text-sm text-muted-foreground">
                      {level.quiz.questions.length} questions · pass with{" "}
                      {level.quiz.passThreshold} correct
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("quiz")}
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
                  >
                    Take the quiz <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </article>
            )}

            {/* Quiz tab */}
            {activeTab === "quiz" && (
              <div className="space-y-6">
                <LevelQuiz
                  questions={level.quiz.questions as any}
                  passThreshold={level.quiz.passThreshold}
                  onPass={handleQuizPassed}
                  isAlreadyPassed={quizPassed}
                />
                {hasCoding && quizPassed && (
                  <button
                    onClick={() => setActiveTab("code")}
                    className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-cyan-400"
                  >
                    Continue to coding challenge <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
            <div>
              <SectionLabel>In this topic</SectionLabel>
              <div className="mt-3 space-y-1">
                {topic.levels.map((lvl) => {
                  const done = completed.has(`${topic.id}_${lvl.id}`);
                  const active = lvl.id === level.id;
                  return (
                    <Link
                      key={lvl.id}
                      to="/learning-hub/aiml/$topicId/$levelId"
                      params={{ topicId: topic.id, levelId: lvl.id }}
                      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition ${
                        active
                          ? "bg-cyan-500/10 font-medium text-foreground"
                          : "text-muted-foreground hover:bg-surface hover:text-foreground"
                      }`}
                    >
                      {done ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                      ) : (
                        <Circle
                          className={`h-4 w-4 shrink-0 ${active ? "text-cyan-400" : ""}`}
                        />
                      )}
                      <span className="truncate">{lvl.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* All topics quick nav */}
            <div>
              <SectionLabel>All topics</SectionLabel>
              <div className="mt-3 space-y-1">
                {aimlTopics.map((t) => {
                  const tLevels = getAllAimlLevels().filter(
                    (l) => l.topicId === t.id
                  );
                  const tDone = tLevels.filter((l) =>
                    completed.has(`${l.topicId}_${l.level.id}`)
                  ).length;
                  return (
                    <Link
                      key={t.id}
                      to="/learning-hub/aiml/$topicId/$levelId"
                      params={{
                        topicId: t.id,
                        levelId: t.levels[0]?.id ?? t.id,
                      }}
                      className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs transition ${
                        t.id === topic.id
                          ? "bg-cyan-500/10 font-medium text-foreground"
                          : "text-muted-foreground hover:bg-surface hover:text-foreground"
                      }`}
                    >
                      <span className="truncate">{t.title}</span>
                      <span className="ml-2 shrink-0 tabular-nums">
                        {tDone}/{tLevels.length}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Previous / Next navigation */}
      <div className="mt-12 grid gap-3 border-t border-border/70 pt-6 sm:grid-cols-2">
        {prevLevel ? (
          <Link
            to="/learning-hub/aiml/$topicId/$levelId"
            params={{ topicId: prevLevel.topicId, levelId: prevLevel.level.id }}
            className="group flex items-center gap-3 rounded-xl border border-border/70 px-4 py-3 transition hover:border-cyan-500/40"
          >
            <ArrowLeft className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-0.5" />
            <span className="min-w-0">
              <span className="block text-xs text-muted-foreground">Previous</span>
              <span className="block truncate text-sm font-medium text-foreground">
                {prevLevel.level.title}
              </span>
            </span>
          </Link>
        ) : (
          <div className="hidden sm:block" />
        )}

        {nextLevel && (
          <Link
            to="/learning-hub/aiml/$topicId/$levelId"
            params={{ topicId: nextLevel.topicId, levelId: nextLevel.level.id }}
            className="group flex items-center justify-end gap-3 rounded-xl border border-border/70 px-4 py-3 text-right transition hover:border-cyan-500/40"
          >
            <span className="min-w-0">
              <span className="block text-xs text-muted-foreground">
                Next{nextLevel.topicId !== topic.id ? ` · ${nextLevel.topic.title}` : ""}
              </span>
              <span className="block truncate text-sm font-medium text-foreground">
                {nextLevel.level.title}
              </span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-cyan-400 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
    </div>
  );
}

