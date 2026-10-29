# Nexora — Comprehensive Technical Architecture & Project Analysis

> **Project Name:** Nexora (AI Career & Placement Platform)  
> **Repository:** `Nexora-masterfinal`  
> **Primary Technology Stack:** TanStack Start (SSR), React 19, TypeScript, Tailwind CSS v4, Google Gemini AI (via Vercel AI SDK), Supabase (PostgreSQL with RLS), Web Workers + Pyodide (WASM CPython).  
> **Date of Analysis:** October 2026

---

## Table of Contents
1. [Executive Summary & Purpose](#1-executive-summary--purpose)
2. [High-Level Architecture & Project Flow](#2-high-level-architecture--project-flow)
3. [Module Inventory: Active, Incomplete & Orphaned Modules](#3-module-inventory-active-incomplete--orphaned-modules)
4. [Complete API Catalog & Endpoints](#4-complete-api-catalog--endpoints)
5. [Database Architecture & Fetching Mechanisms](#5-database-architecture--fetching-mechanisms)
6. [Core Features & In-Depth Algorithm Code Walkthroughs](#6-core-features--in-depth-algorithm-code-walkthroughs)
   - [Algorithm 1: Multi-Model Cascade & Intelligent Key Routing](#algorithm-1-multi-model-cascade--intelligent-key-routing)
   - [Algorithm 2: In-Browser Sandboxed Multi-Language Code Runner](#algorithm-2-in-browser-sandboxed-multi-language-code-runner)
   - [Algorithm 3: Anti-Hallucination Quoted Evidence & Weighted ATS Scoring](#algorithm-3-anti-hallucination-quoted-evidence--weighted-ats-scoring)
   - [Algorithm 4: Adaptive Assessment Generation & Hybrid Auto-Grading](#algorithm-4-adaptive-assessment-generation--hybrid-auto-grading)
   - [Algorithm 5: Interactive Voice/Text Mock Interview with Bank Fallback](#algorithm-5-interactive-voicetext-mock-interview-with-bank-fallback)
   - [Algorithm 6: AlgoMaster-Style Step Generator Visualization Engine](#algorithm-6-algomaster-style-step-generator-visualization-engine)
   - [Algorithm 7: Dual-Tier Persistence & Guest-to-Auth Migration](#algorithm-7-dual-tier-persistence--guest-to-auth-migration)
   - [Algorithm 8: Deterministic Heuristic Fallback Resume Rewriting](#algorithm-8-deterministic-heuristic-fallback-resume-rewriting)
7. [Comprehensive Functionality Audit (Working, Blocked, Empty)](#7-comprehensive-functionality-audit)
8. [Setup & Running Instructions](#8-setup--running-instructions)

---

## 1. Executive Summary & Purpose

**Nexora** is an end-to-end AI-powered career acceleration and placement preparation platform tailored for software engineering students and job-seekers. It unifies five critical career-readiness pillars into a single application:

1. **Learning Hub & DSA Roadmap:** Structured 16-topic Data Structures and Algorithms curriculum with guided theory, interactive quizzes, an in-browser sandboxed code editor (JavaScript, TypeScript, Python via WebAssembly), and curated practice sheets (Striver, Love Babbar, NeetCode, Fraz).
2. **Interactive Algorithm Visualizer:** Animated, step-by-step state visualization for foundational algorithm patterns (Two Pointers, Binary Search, Bubble Sort, Sliding Window).
3. **AI Skill Assessment Engine:** Adaptive diagnostic tests across 12 technologies (Java, Spring Boot, React, SQL, Python, etc.) supporting MCQ, code debugging, and system design scenarios with multi-axis radar scoring and customized learning roadmaps.
4. **AI Mock Interview Simulator:** Voice- and text-enabled turn-by-turn technical and HR mock interviews with real-time Speech-to-Text (STT), Text-to-Speech (TTS), rubric-based answer feedback, and curated offline fallback question banks.
5. **AI Resume Studio & ATS Reviewer:** 
   - **Studio:** Multi-step resume builder with 6 professional visual templates, debounced cloud persistence, and AI bullet optimization.
   - **Reviewer:** Native client/server document parsing (PDF and DOCX without third-party SaaS), computing a 5-category weighted ATS score and extracting verifiable quotation evidence against optional Job Descriptions (JD).
6. **Unified Analytics Dashboard & Admin Control Panel:** Complete student progress tracking (streaks, readiness score, topic mastery, badges) and admin platform telemetry.

---

## 2. High-Level Architecture & Project Flow

Nexora is built as a **Full-Stack TanStack Start** application running on the Vite + Nitro engine, maintaining full SSR capabilities and client-side SPA transitions.

```
                                      +------------------------------------+
                                      |          Client Browser            |
                                      +-----------------+------------------+
                                                        |
                         +------------------------------+------------------------------+
                         |                                                             |
                   HTTPS / SSR / RPC                                            Web Worker / WASM
                         |                                                             |
+------------------------v-------------------------+          +------------------------v-------------------------+
|        TanStack Start Server (Nitro / Node)      |          |              Client Sandbox Execution            |
| - SSR HTML Rendering & Hydration                 |          | - JS: Direct Function sandbox                    |
| - Server Functions (`createServerFn`)            |          | - TS: Sucrase browser transpile                  |
| - Request / Auth Middleware                      |          | - Python: Pyodide WebAssembly CPython            |
| - Multi-Model Gemini Key Routing                 |          +--------------------------------------------------+
| - PDF (unpdf) & DOCX (fflate) Extraction         |
+-------------------+--------------------+---------+
                    |                    |
         REST API calls (HTTPS)    PostgreSQL Client (REST / WebSocket)
                    |                    |
+-------------------v---+   +------------v---------------------------------------------+
|    Google Gemini AI   |   |                   Supabase Backend                       |
| - gemini-3.5-flash    |   | - Auth: JWT Bearer Tokens & OAuth (Google)               |
| - gemini-3.5-flash-lt |   | - Database: PostgreSQL with Row-Level Security (RLS)     |
| - gemini-3.8-flash    |   | - Security Definer RPCs (Admin Analytics, is_admin)      |
+-----------------------+   +----------------------------------------------------------+
```

### Route Hierarchy & Navigation Flow

The application routing is file-based in `src/routes/` and managed by TanStack Router:

- **Root Shell (`src/routes/__root.tsx`)**:
  - Sets global HTML head metadata, fonts, stylesheets, and Sonner toast provider.
  - Implements **`AuthGate`**: Inspects user session. Protects private routes (`/`, `/dashboard`, `/learning-hub/*`, `/skill-assessment`, `/mock-interview`, `/resume-builder`, `/resume-review`, `/profile`) and automatically redirects unauthenticated users to `/login?redirect=...`.
  - Distinguishes full-screen bare routes (`/login`, `/admin`) from student shell routes (rendered with `<Navbar />`).

```
/ (Landing Page: Index)
├── /login (Authentication: Email/Password & Google OAuth)
├── /reset-password (Password recovery)
├── /profile (User profile management & password update)
├── /dashboard (Personalized readiness score, trends, achievements)
├── /admin (Administrator oversight, user drill-down, platform telemetry)
├── /skill-assessment (Adaptive technical diagnostic exams)
├── /mock-interview (Turn-by-turn AI & voice mock interview)
├── /resume-builder (Interactive 8-step resume studio with 6 templates)
├── /resume-review (PDF/DOCX ATS document scanner & JD matching)
└── /learning-hub
    ├── / (Curriculum overview & roadmap)
    └── /dsa
        ├── / (DSA Dashboard: Roadmap, Practice Sheets, Visualizer, Code Studio)
        └── /$topicId/$levelId (Individual DSA lesson: Theory -> Quiz -> Code Challenge)
```

---

## 3. Module Inventory: Active, Incomplete & Orphaned Modules

### A. Core Active Modules

| Module / Directory | Key Files | Purpose & Functionality |
| :--- | :--- | :--- |
| **Authentication & Profile** | `AuthForm.tsx`, `AuthModal.tsx`, `useAuthUser.ts`, `profile.tsx`, `login.tsx` | Supabase OAuth + Email authentication, protected route gating, profile editing. |
| **Gemini AI Core** | `gemini.server.ts` | Multi-tier API key selection, multi-model fallback cascade, in-memory rate limiting. |
| **Skill Assessment** | `skill-assessment.tsx`, `assessment.functions.ts` | Generates adaptive tests (12 techs, 6 modes), auto-grades objective items, LLM-grades scenarios. |
| **Mock Interview** | `mock-interview.tsx`, `interview.functions.ts`, `interview-bank.ts` | Turn-by-turn technical/HR interviews, Web Speech STT/TTS, scoring rubric, offline fallback bank. |
| **Resume Studio** | `ResumeStudio.tsx`, `ResumePreview.tsx`, `types.ts`, `resume.functions.ts` | 8-step resume authoring, 6 switchable visual themes, debounced Supabase autosave, FAANG AI text improvement. |
| **Resume Reviewer** | `resume-review.tsx`, `UploadStep.tsx`, `ScanningStep.tsx`, `ReportView.tsx`, `resume-review.functions.ts` | Client/server PDF (`unpdf`) & DOCX (`fflate`) extraction, anti-hallucination evidence matching, weighted ATS audit. |
| **DSA Learning Curriculum** | `learning-hub.dsa.$topicId.$levelId.tsx`, `dsa-curriculum.ts`, `dsa-roadmap.ts`, `LevelQuiz.tsx`, `CodingWorkspace.tsx` | 16 topic modules with lessons, passing criteria (quiz + coding requirement), progress tracking. |
| **In-Browser Code Sandbox** | `code-runner.ts`, `CodeEditor.tsx`, `InteractiveDsaStudio.tsx` | Zero-server-cost execution engine in Web Workers supporting JS, TS (via Sucrase), and Python 3 (via Pyodide WASM). |
| **Algorithm Visualizer** | `DsaVisualizer.tsx` | AlgoMaster-style interactive visualization for Two Pointers, Binary Search, Bubble Sort, Sliding Window. |
| **Student Dashboard & Gamification** | `dashboard.tsx`, `Achievements.tsx`, `HomeProgress.tsx` | Readiness metrics, performance line charts, activity streak calculation, badges unlocked from real database stats. |
| **Admin Oversight & Analytics** | `admin.tsx` | Protected dashboard (`is_admin()` RPC), 30-day activity AreaChart, user search, drill-down drawer, CSV export. |
| **UI Design System** | `src/components/ui/*` (38 components) | Fully styled Radix UI components (Dialog, Sheet, Accordion, Tooltip, Sonner, Tabs, Carousel, etc.). |

### B. Incomplete, Planned & Orphaned Modules

1. **`ComingNext.tsx` (`src/components/ComingNext.tsx`)**:
   - **Status:** **Orphaned / Unused dead code**.
   - **Details:** Previously served as a generic placeholder component for unfinished routes. All primary routes now have active implementations. No file in `src/` imports or renders this component.
2. **Learning Hub Planned Tracks (`src/routes/learning-hub.index.tsx`)**:
   - **Status:** **Placeholder / UI Only (Marked "Soon")**.
   - **Details:** The Learning Hub currently features **DSA** as fully available. Five additional tracks are listed under the roadmap section as static display cards without underlying routes or lessons:
     - *Full Stack Web Development*
     - *System Design*
     - *Database Engineering & SQL*
     - *AI & Machine Learning*
     - *Cloud & DevOps*
3. **Database Test Scripts (`scripts/check-tables.js` & `check-tables.ts`)**:
   - **Status:** **Maintenance Utility**.
   - **Details:** Standalone diagnostic scripts to verify Supabase table connectivity. References legacy table names (`resume_builder`, `resume_analysis`) that were superseded by `resumes` and `resume_reviews`.

---

## 4. Complete API Catalog & Endpoints

Nexora uses **TanStack Start Server Functions (`createServerFn`)** for type-safe server-side RPCs, complemented by **Supabase Database RPCs** and direct **PostgREST table queries**.

### A. TanStack Start Server Functions (RPC Endpoints)

All endpoints accept `POST` requests and enforce runtime input validation via `Zod`.

| Endpoint / Function | File Location | Input Validation (`Zod`) | Processing Logic & External Calls | Output Contract |
| :--- | :--- | :--- | :--- | :--- |
| `generateAssessment` | `assessment.functions.ts` | `technology`: string<br>`difficulty`: easy/med/hard<br>`count`: 3-20<br>`mix`: {mcq, code, scenario}<br>`mode`: mixed/mcq/coding/scenario/debugging/rapid | Calls `generateWithGeminiFallback` with system instructions to return strict JSON questions. Retries once on malformed JSON. | `AssessmentQuestion[]` (id, type, topic, prompt, code, options, correctIndex, explanation) |
| `evaluateAssessment` | `assessment.functions.ts` | `technology`: string<br>`difficulty`: string<br>`answers`: Array of user answers + selected indices | Auto-grades MCQ/Code questions deterministically; dispatches scenario questions to Gemini for evaluation. Aggregates into 6-axis radar. | Report object: `overallScore`, `radar` (6 metrics), `skillLevel`, `interviewReadiness`, `companiesReady`, `learningPath` |
| `generateQuestions` | `interview.functions.ts` | `role`: string<br>`type`: hr/technical/mixed<br>`difficulty`: easy/med/hard<br>`duration`: number<br>`skills`: string[]<br>`language`: english/hindi<br>`totalQuestions`: 1-30 | If Gemini is configured, prompts AI with question depth calibrated by difficulty. Falls back automatically to `interview-bank.ts`. | `{ questions: string[], source: "ai" \| "bank" }` |
| `evaluateAnswer` | `interview.functions.ts` | `config`: InterviewConfig<br>`currentQuestion`: string<br>`answer`: string<br>`questionIndex`: number | Checks for skipped answers (score 0). Calls Gemini for strict 0-10 rubric scoring. Returns offline fallback heuristics if AI offline. | `AnswerFeedback`: `score` (0-10), `strengths[]`, `improvements[]`, `suggestion`, `isLast` |
| `generateReport` | `interview.functions.ts` | `config`: InterviewConfig<br>`history`: Array of question-answer pairs with turn scores | Aggregates all turn scores, calculates dimension scores, and prompts Gemini for final hiring recommendation. Offline fallback available. | `InterviewReport`: `overall`, `technical`, `communication`, `problemSolving`, `recommendedTopics[]`, `recommendation` |
| `extractDocumentText` | `resume-review.functions.ts` | `fileBase64`: string (max 4MB)<br>`fileName`: string | Detects format from extension: runs `unpdf` on PDFs (page limit 15); runs `fflate` on DOCX to unzip XML body/headers. Normalizes text. | `{ ok: true, text: string }` or `{ ok: false, error: string }` |
| `reviewResume` | `resume-review.functions.ts` | `resumeText`: string (max 24k chars)<br>`jobText`: optional string (max 12k chars)<br>`resumeFileName`: string | Prompts Gemini under strict anti-hallucination rules (only quote verbatim evidence). Calculates weighted category ATS scores. | `{ ok: true, review: ResumeReview }` or `{ ok: false, error: string }` |
| `improveText` | `resume.functions.ts` | `text`: string<br>`kind`: summary/project/experience/generic<br>`context`: optional string | Prompts Gemini to rewrite text with strong action verbs and quantified impact. Falls back to deterministic rule-based rewrite if offline. | `{ improved: string }` |
| `analyzeResume` | `resume.functions.ts` | `resume`: string (JSON serialized resume data) | Evaluates overall resume JSON for ATS readiness, missing keywords (Docker, CI/CD, Redis), strong verbs, and structure. | `{ score, atsScore, strengths[], improvements[], missingKeywords[], strongerVerbs[], grammar[] }` |
| `liveTips` | `resume.functions.ts` | `resume`: string (JSON serialized resume data) | Generates fast, actionable inline tips (< 12 words) categorized into sparkle, idea, warning, success. | `{ tips: Array<{ type, text }> }` |

---

### B. Supabase Database Functions (Stored Procedures / RPCs)

Invoked from the frontend using `supabase.rpc("function_name", { params })`:

| RPC Function | Security Model | Description | Access Rights |
| :--- | :--- | :--- | :--- |
| `is_admin()` | `SECURITY DEFINER` | Checks whether `auth.uid()` has a record in `public.user_roles` with `role = 'admin'`. | Authenticated users |
| `admin_overview()` | `SECURITY DEFINER` | Aggregates platform-wide metrics: user counts, active users (today, 7d, 30d), total assessments, interviews, daily signups/active graph data. | Admin role only (throws 42501 otherwise) |
| `admin_list_users()` | `SECURITY DEFINER` | Returns summary list of all registered users with completion counts and averages across all modules. Excludes private resume/interview text. | Admin role only (throws 42501 otherwise) |
| `admin_user_detail(target)`| `SECURITY DEFINER` | Drill-down stats for a specific user: detailed assessment scores, interview logs, DSA completed levels, and resume review scores. | Admin role only (throws 42501 otherwise) |
| `admin_user_activity()` | `SECURITY DEFINER` | Internal union query tracking the most recent timestamp across all user activities. | Internal to admin functions |

---

## 5. Database Architecture & Fetching Mechanisms

### A. Database Platform & Connection Architecture

The database is **PostgreSQL** hosted on **Supabase**. Client and server communicate with PostgreSQL via two distinct access patterns:

1. **Client-Side Data Client (`src/integrations/supabase/client.ts`)**:
   - Implemented as a cached lazy Proxy around `createClient<Database>()`.
   - Uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.
   - Persists session in `window.localStorage` with automatic token refresh.
   - Attaches the JWT Bearer token to all requests.
2. **Server-Side Admin Client (`src/integrations/supabase/client.server.ts`)**:
   - Uses `SUPABASE_SERVICE_ROLE_KEY` for background admin routines where RLS bypass is required.
   - Operates statelessly with `persistSession: false`.
3. **RPC Token Propagation (`src/integrations/supabase/auth-attacher.ts`)**:
   - Configured as global `functionMiddleware` in `src/start.ts`.
   - Reads `supabase.auth.getSession()` on the client and attaches the user's `access_token` to TanStack Server Function RPC headers (`Authorization: Bearer <token>`).
4. **Server Middleware Validation (`src/integrations/supabase/auth-middleware.ts`)**:
   - Server middleware `requireSupabaseAuth` extracts and verifies the bearer token claims (`getClaims`), confirming valid `sub` (User ID) before invoking sensitive handlers.

---

### B. Entity-Relationship Model (All 11 Tables)

```
       +---------------------------------------------+
       |                 auth.users                  |
       +----------------------+----------------------+
                              |
       +----------------------+----------------------+-----------------------+
       |                      |                      |                       |
+------v------+        +------v---------------+ +----v-------------+ +------v------+
|  profiles   |        |  skill_assessments   | | mock_interviews | |   resumes   |
+-------------+        +----------+-----------+ +----+------------+ +-------------+
                                  |                  |
                       +----------v-----------+ +----v-------------+
                       |  assessment_results  | |interview_reports |
                       +----------------------+ +------------------+

       +---------------------------------------------+
       |                 auth.users                  |
       +----------------------+----------------------+
                              |
       +----------------------+----------------------+-----------------------+
       |                      |                      |                       |
+------v-------------+ +------v-------------+ +------v-------------+ +-------v------+
| dsa_level_progress | | dsa_quiz_attempts  | |dsa_solved_problems | |resume_reviews|
+--------------------+ +--------------------+ +--------------------+ +--------------+
```

#### Detailed Table Specifications

1. **`profiles`**: User demographic and educational data.
   - `id` (UUID PK), `user_id` (UUID FK -> auth.users UNIQUE), `full_name`, `email`, `education`, `created_at`, `updated_at`.
   - Trigger: `handle_new_user()` auto-creates profile upon signup in `auth.users`.
2. **`skill_assessments`**: Diagnostic test attempts.
   - `id` (UUID PK), `user_id` (UUID FK), `technology`, `difficulty`, `score`, `percentage`, `total_questions`, `completed_at`.
3. **`assessment_results`**: In-depth evaluation reports.
   - `id` (UUID PK), `assessment_id` (UUID FK), `user_id` (UUID FK), `strengths` (JSONB), `weaknesses` (JSONB), `weak_topics` (JSONB), `recommendations` (JSONB), `detailed_report` (JSONB).
4. **`mock_interviews`**: Practice interview sessions.
   - `id` (UUID PK), `user_id` (UUID FK), `interview_type`, `difficulty`, `score`, `completed_at`.
5. **`interview_reports`**: Detailed mock interview feedback.
   - `id` (UUID PK), `interview_id` (UUID FK), `user_id` (UUID FK), `strengths` (JSONB), `weaknesses` (JSONB), `feedback` (TEXT), `recommendations` (JSONB), `detailed_report` (JSONB).
6. **`resumes`**: Builder drafts and stored resumes.
   - `id` (UUID PK), `user_id` (UUID FK), `resume_data` (JSONB holding full personal/education/experience/project structure), `review_result` (JSONB), `created_at`, `updated_at`.
7. **`dsa_level_progress`**: Per-level milestone progress.
   - `id` (UUID PK), `user_id` (UUID FK), `topic_id`, `level_id`, `quiz_completed` (BOOL), `quiz_score` (NUMERIC), `quiz_passed` (BOOL), `coding_completed` (BOOL), `completed` (BOOL), `last_code` (TEXT), UNIQUE (`user_id`, `topic_id`, `level_id`).
8. **`dsa_quiz_attempts`**: Granular attempt history for accuracy tracking.
   - `id` (UUID PK), `user_id` (UUID FK), `topic_id`, `level_id`, `score`, `passed` (BOOL), `created_at`.
9. **`dsa_solved_problems`**: Practice problems ticked off from curated sheets.
   - `user_id` (UUID FK), `problem_id` (TEXT), `solved_at`, PRIMARY KEY (`user_id`, `problem_id`).
10. **`resume_reviews`**: ATS scan reports.
    - `id` (UUID PK), `user_id` (UUID FK), `file_name`, `overall_score`, `review` (JSONB holding category scores, rewrites, evidence), `created_at`.
11. **`user_roles`**: Administrative role assignments.
    - `user_id` (UUID FK), `role` (CHECK: role IN ('admin')), PRIMARY KEY (`user_id`, `role`).
    - *Security Note:* No client INSERT/UPDATE policies exist. Roles must be granted directly via Supabase SQL Console.

#### Row-Level Security (RLS) Policies
Every single user table has RLS enabled (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`). Users can strictly only perform `SELECT`, `INSERT`, `UPDATE`, and `DELETE` on rows satisfying:
```sql
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
```

---

## 6. Core Features & In-Depth Algorithm Code Walkthroughs

### Algorithm 1: Multi-Model Cascade & Intelligent Key Routing
- **File:** `src/lib/gemini.server.ts`
- **Purpose:** Eliminates single-point-of-failure API limits and service degradation by orchestrating multiple Google Gemini API keys and model generations.

```typescript
// Models attempted in order of speed and capability
const DEFAULT_MODELS = ["gemini-3.5-flash-lite", "gemini-3.5-flash", "gemini-3.8-flash"];
const CALL_TIMEOUT_MS = 25_000;

export async function generateWithGeminiFallback(options: {
  system?: string;
  prompt: string;
  feature?: AiFeature;
}) {
  enforceRateLimit();
  // 1. Try feature-specific key (e.g. GEMINI_API_KEY_RESUME), then fall back to GEMINI_API_KEY
  const keys = keysFor(options.feature);
  if (!keys.length) {
    throw new AiUserError("The AI service is not configured right now.");
  }

  let lastError: unknown = null;
  for (const [ki, apiKey] of keys.entries()) {
    const google = createGoogleGenerativeAI({ apiKey });
    for (const modelName of candidateModels()) {
      try {
        return await generateText({
          model: google(modelName),
          system: options.system,
          prompt: options.prompt,
          maxRetries: 1,
          abortSignal: AbortSignal.timeout(CALL_TIMEOUT_MS),
        });
      } catch (err) {
        lastError = err;
        // Non-retryable errors (e.g. 401 invalid key) immediately advance to next key
        if (!isRetryable(err)) break;
      }
    }
  }
  throw new AiUserError("The AI service is busy right now. Please try again.");
}
```
**Why this algorithm helps:**
- Different features can belong to different GCP projects to avoid shared quota exhaustion.
- Automatic fallback from `gemini-3.5-flash-lite` to standard `flash` ensures continuous availability during transient Google Cloud overload spikes.
- Contains an in-memory sliding window rate limiter (max 40 requests per 10 minutes per client IP).

---

### Algorithm 2: In-Browser Sandboxed Multi-Language Code Runner
- **File:** `src/lib/code-runner.ts`
- **Purpose:** Executes untrusted learner code in JavaScript, TypeScript, and Python without incurring backend execution costs or introducing remote code execution (RCE) vulnerabilities.

```typescript
// Inside the isolated Web Worker:
self.onmessage = async (e) => {
  const { language, code, functionName, inputs, pyodideUrl } = e.data;
  if (language === "python") {
    // Loads CPython compiled to WebAssembly
    const py = await loadPython(pyodideUrl);
    const ns = py.toPy({});
    py.runPython(code, { globals: ns });
    const fn = ns.get(functionName);
    for (const input of inputs) {
      const args = JSON.parse("[" + input + "]").map((a) => py.toPy(a));
      let out = fn(...args);
      if (out && typeof out.toJs === "function") {
        out = out.toJs({ dict_converter: Object.fromEntries });
      }
      results.push({ actual: fmt(out) });
    }
    self.postMessage({ type: "done", reply: { ok: true, results } });
  } else {
    // JavaScript / Transpiled TypeScript
    const factory = new Function("console", '"use strict";\n' + code + 
      "\nreturn typeof " + functionName + ' === "function" ? ' + functionName + " : undefined;");
    const fn = factory(consoleShim);
    // Execute against inputs...
  }
};
```
**Why this algorithm helps:**
- **Zero Server Overhead:** 100% of the computation executes on the user's client hardware.
- **Transpilation:** TypeScript is transpiled on-the-fly in browser memory using `sucrase` in < 5ms.
- **Real Python 3 Environment:** Employs Pyodide (WASM) with a pre-warmed background worker queue so standard Python libraries work directly in the browser.
- **Infinite Loop Safeguards:** Hard timeouts (5s for JS, 8s for Python) terminate the worker thread if a learner writes a `while(true)` loop.

---

### Algorithm 3: Anti-Hallucination Quoted Evidence & Weighted ATS Scoring
- **Files:** `src/lib/resume-review.functions.ts` & `src/lib/resume-review-types.ts`
- **Purpose:** Prevents generative AI hallucinations when evaluating resumes against jobs, calculating mathematically grounded ATS scores.

```typescript
export const CATEGORY_WEIGHTS: Record<CategoryKey, number> = {
  content: 0.25,      // 25%: Action verbs, metric quantification
  experience: 0.20,   // 20%: Career progression, responsibilities
  skills: 0.20,       // 20%: Technical relevance and recency
  ats: 0.20,          // 20%: File parseability, standard section names
  formatting: 0.15,   // 15%: Visual density, margins, consistency
};

// Anti-Hallucination Guard:
function normalizeRequirement(raw: unknown): Requirement | null {
  // ...
  let status = String(r.status ?? "").toLowerCase();
  // If the model claims "verified" or "related" but cannot produce 
  // an exact quoted line from the candidate's resume, reject the claim!
  if ((status === "verified" || status === "related") && !evidence) {
    status = "unclear";
  }
  return { requirement, kind, status, evidence, note };
}

// Composite ATS Score:
const overallScore = Math.round(
  (Object.keys(CATEGORY_WEIGHTS) as CategoryKey[]).reduce(
    (sum, k) => sum + categoryScores[k] * CATEGORY_WEIGHTS[k],
    0,
  ),
);
```
**Why this algorithm helps:**
- Standard LLM resume reviews often falsely claim a candidate possesses a skill. Nexora forces the model to extract verbatim text citations (`evidence`). If no verbatim citation exists, the status automatically degrades to `unclear` or `not_found`.
- Computes a deterministic weighted average across 5 distinct recruitment criteria rather than relying on an arbitrary single LLM integer output.

---

### Algorithm 4: Adaptive Assessment Generation & Hybrid Auto-Grading
- **File:** `src/lib/assessment.functions.ts`
- **Purpose:** Combines instant deterministic grading for objective questions with qualitative semantic evaluation for scenario/design problems.

```typescript
export const evaluateAssessment = createServerFn({ method: "POST" })
  .validator((d: unknown) => EvalInput.parse(d))
  .handler(async ({ data }) => {
    // Step 1: Deterministic auto-grading for objective items
    const items = data.answers.map((a) => {
      let correct = false;
      if (a.question.type === "mcq" || a.question.type === "code") {
        correct = a.selectedIndex != null && a.selectedIndex === a.question.correctIndex;
      }
      return { ...a, autoCorrect: correct };
    });

    // Step 2: Semantic grading for subjective architectural scenarios
    const { text } = await generateWithGeminiFallback({
      feature: "assessment",
      system: "You are a fair but strict technical evaluator...",
      prompt: `Grade scenarios by id. Combine auto-graded MCQ/code with scenario scores for overallScore...`,
    });

    const object = ReportSchema.parse(parseJson(text));
    return { grading: items, ...object };
  });
```
**Why this algorithm helps:**
- Avoids LLM grading errors on straightforward multiple-choice or code output questions by using zero-latency JavaScript boolean equality checks.
- Generates a holistic 6-axis radar report (`accuracy`, `problemSolving`, `conceptUnderstanding`, `confidence`, `codingSkill`, `communication`) and automatically maps weak answers to curated learning recommendations.

---

### Algorithm 5: Interactive Voice/Text Mock Interview with Bank Fallback
- **Files:** `src/lib/interview.functions.ts` & `src/lib/interview-bank.ts`
- **Purpose:** Ensures interview sessions remain 100% operational even without active Gemini API keys or during complete network outages.

```typescript
export const generateQuestions = createServerFn({ method: "POST" })
  .validator((d: unknown) => ConfigSchema.parse(d))
  .handler(async ({ data }) => {
    const total = Math.max(1, data.totalQuestions || 5);
    const skills = data.skills.length > 0 ? data.skills : skillsForRole(data.role);

    // Build curated question set from the built-in offline bank
    const fallback = buildFallbackQuestions({
      type: data.type,
      difficulty: data.difficulty,
      skills,
      totalQuestions: total,
    });

    if (!isGeminiConfigured("interview")) {
      return { questions: fallback, source: "bank" as const };
    }

    try {
      // AI generation using fallback questions as calibration anchors
      const { text } = await generateWithGeminiFallback({ ... });
      const parsed = cleanQuestions(extractJson(text));
      if (parsed.length >= total) return { questions: parsed.slice(0, total), source: "ai" };
    } catch (e) {
      console.error("AI question generation failed, using bank", e);
    }
    return { questions: fallback, source: "bank" as const };
  });
```
**Why this algorithm helps:**
- Incorporates over 350 curated, real-world interview questions across Java, Spring Boot, React, SQL, Python, and HR behavioral categories.
- Uses Web Speech Recognition (`SpeechRecognition`) for hands-free answering and native speech synthesis (`window.speechSynthesis`) so the AI reads questions aloud.

---

### Algorithm 6: AlgoMaster-Style Step Generator Visualization Engine
- **File:** `src/components/DsaVisualizer.tsx`
- **Purpose:** Deconstructs complex algorithmic loops into deterministic, discrete state arrays with active pointers for interactive playback.

```typescript
// Binary Search State Generator Function:
stepsGenerator: (arr) => {
  const sorted = [...arr].sort((a, b) => a - b);
  const target = sorted[6];
  const steps: any[] = [];
  let low = 0, high = sorted.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    steps.push({
      array: [...sorted],
      activeIndices: [mid],
      pointers: [
        { name: "Low", index: low, color: "#38bdf8" },
        { name: "Mid", index: mid, color: "#eab308" },
        { name: "High", index: high, color: "#f43f5e" },
      ],
      explanation: `Midpoint = ${mid} (val: ${sorted[mid]}). Comparing with target ${target}.`,
      codeLine: 3,
    });
    if (sorted[mid] === target) break;
    if (sorted[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return steps;
}
```
**Why this algorithm helps:**
- Students scrub back and forth through execution history without re-running loops.
- Synchronizes pseudo-code highlight line numbers with pointer movements and array bar transitions.

---

### Algorithm 7: Dual-Tier Persistence & Guest-to-Auth Migration
- **Files:** `src/hooks/useDsaProgress.ts` & `src/hooks/useSolvedProblems.ts`
- **Purpose:** Allows unauthenticated guest students to complete lessons and track solved problems, automatically migrating local data into Supabase once they sign up.

```typescript
async function loadRemote(user: User): Promise<UserDsaProgress> {
  const { data } = await supabase.from("dsa_level_progress").select("*").eq("user_id", user.id);
  const completedLevels = parseRemoteLevels(data);

  // Seamless guest migration:
  const local = readLocal();
  if (local) {
    const toUpload = Object.entries(local.completedLevels)
      .filter(([k]) => !completedLevels[k]);

    if (toUpload.length > 0) {
      await supabase.from("dsa_level_progress").upsert(
        toUpload.map(([, l]) => toRow(user.id, l)),
        { onConflict: "user_id,topic_id,level_id" }
      );
      for (const [k, l] of toUpload) completedLevels[k] = l;
    }
    // Wipe local guest storage to prevent leaking into another account on shared device
    localStorage.removeItem(STORAGE_KEY);
  }
  return buildProgress(completedLevels);
}
```
**Why this algorithm helps:**
- Frictionless onboarding: students begin learning without an upfront signup requirement.
- Zero data loss: progress made prior to creating an account is safely preserved.

---

### Algorithm 8: Deterministic Heuristic Fallback Resume Rewriting
- **File:** `src/lib/resume.functions.ts`
- **Purpose:** Transforms weak, passive resume bullet points into impactful, action-oriented statements using grammatical rules when AI services are unavailable.

```typescript
// Rule-based fallback if AI service is offline
if (data.kind === "project" || data.kind === "experience") {
  const parts = data.text.split(/[.\n]+/).map(p => p.trim()).filter(p => p.length > 5);
  const strongVerbs = [
    "Architected and engineered", 
    "Designed and implemented", 
    "Spearheaded development of", 
    "Streamlined and optimized"
  ];
  
  const bullets = parts.map((part, idx) => {
    const verb = strongVerbs[idx % strongVerbs.length];
    const cleanPart = part
      .replace(/^[•\-*]\s*/, "")
      .replace(/^(I|We)\s+(built|did|worked on|made)\s+/i, "");
    return `• ${verb} ${cleanPart}, enhancing maintainability and improving system efficiency by 25%.`;
  });

  return { improved: bullets.join("\n") };
}
```
**Why this algorithm helps:**
- Strips colloquial language ("I worked on...", "We did...") and prepends authoritative engineering verbs.
- Ensures the user interface never freezes or errors out when offline.

---

## 7. Comprehensive Functionality Audit

| Feature / Subsystem | Operational Status | Dependencies | Behavior & Failure Handling |
| :--- | :--- | :--- | :--- |
| **DSA Interactive Studio** | **100% Operational** | None (Client-side) | Runs JavaScript, TypeScript, and Python via Web Workers. Works offline. |
| **DSA Algorithm Visualizer** | **100% Operational** | None (Client-side) | Animates 4 major algorithmic patterns with zero backend dependencies. |
| **Curated Practice Sheets** | **100% Operational** | LocalStorage / Supabase | Striver, Babbar, NeetCode, and Fraz problem trackers work in both guest and signed-in modes. |
| **Resume Builder Studio** | **100% Operational** | LocalStorage / Supabase | 6 visual templates, live PDF export, form validation, and autosave. |
| **Offline Mock Interview** | **100% Operational** | None (Client-side) | 350+ curated questions, Web Speech voice input, audio speech synthesis, and offline scoring. |
| **Admin Oversight UI** | **100% Operational** | Supabase Auth + Database | Access requires an admin record in `user_roles`. Displays graphs and user rosters. |
| **AI Assessment Generation** | **Requires Gemini API Key** | `GEMINI_API_KEY` | Generates new custom question sets on demand. Gracefully reports errors if key is absent. |
| **AI Resume ATS Reviewer** | **Requires Gemini API Key** | `GEMINI_API_KEY` | PDF/DOCX text extraction works locally; AI scoring requires an active API key. |
| **Cloud Authentication** | **Requires Supabase Keys** | `SUPABASE_URL`, `KEY` | Email/password and Google OAuth require valid Supabase project credentials. |
| **Orphaned Component (`ComingNext`)** | **Dead Code** | None | Not imported anywhere in `src/`. Safe to delete or ignore. |
| **Roadmap Tracks (Web/Cloud/AI)** | **Planned / Incomplete** | None | Static cards on `/learning-hub` displaying "Soon" badges. No lesson data yet. |

---

## 8. Setup & Running Instructions

### 1. Prerequisites
- **Node.js**: v20.x or v22.x
- **Package Manager**: npm, pnpm, or bun

### 2. Environment Configuration
Create a `.env` file inside `Nexora-master/` modeled after `.env.example`:

```env
# Google Gemini API Keys
GEMINI_API_KEY=AIzaSy...your_gemini_key

# Optional separate feature keys (for independent quotas)
GEMINI_API_KEY_ASSESSMENT=
GEMINI_API_KEY_INTERVIEW=
GEMINI_API_KEY_RESUME=
GEMINI_API_KEY_REVIEW=

# Supabase Server & Client Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

### 3. Database Initialization
1. In the [Supabase Dashboard](https://supabase.com), open the **SQL Editor**.
2. Run the entire contents of `supabase/full-setup.sql`.
3. To grant yourself admin access for `/admin`:
   ```sql
   INSERT INTO public.user_roles (user_id, role)
   SELECT id, 'admin' FROM auth.users WHERE email = 'your-email@example.com';
   ```

### 4. Running the Development Server
Navigate to the project directory and start Vite:

```bash
cd Nexora-master
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

