import { useState } from "react";
import { request } from "../api/client";

export interface CourseTaskPlan {
  title: string;
  category: string;
  readiness: "Ready" | "Almost" | "Not-Yet";
  tags: string[];
  detailsToAdd: string[];
}

export function TaskCoachPage() {
  const [prompt, setPrompt] = useState("");
  const [plan, setPlan] = useState<CourseTaskPlan | null>(null);
  const [loading, setLoading] = useState(false);

  // Fallback for course task planning
  const generateCoursePlan = (input: string): CourseTaskPlan => {
    const cleanInput = input.trim();
    const lower = cleanInput.toLowerCase();

    // 1. DBMS / Database Courses
    if (lower.includes("dbms") || lower.includes("database") || lower.includes("sql") || lower.includes("mongodb")) {
      return {
        title: "DBMS301 - Database Project Review",
        category: "Database Systems",
        readiness: "Almost",
        tags: ["#dbms", "#sql", "#mongodb", "#schema"],
        detailsToAdd: [
          "Verify ER diagram mapping and table relationships.",
          "Ensure primary and foreign key constraints are applied.",
          "Write seed scripts for initial test data insertion.",
        ],
      };
    }

    // 2. Web Development / React / Node.js
    if (lower.includes("web") || lower.includes("react") || lower.includes("node") || lower.includes("api")) {
      return {
        title: "WEB201 - Full-Stack Application Review",
        category: "Web Engineering",
        readiness: "Ready",
        tags: ["#react", "#express", "#api", "#fullstack"],
        detailsToAdd: [
          "Verify all client API routes catch network fallbacks gracefully.",
          "Add environment variables (VITE_API_URL) to Vercel.",
          "Run TypeScript build checks (`npm run build`) before pushing.",
        ],
      };
    }

    // 3. Intro to CS / Programming Basics
    if (lower.includes("cs101") || lower.includes("computer science") || lower.includes("algorithm") || lower.includes("code")) {
      return {
        title: "CS101 - Programming Assignment Review",
        category: "Computer Science",
        readiness: "Almost",
        tags: ["#cs101", "#algorithms", "#logic"],
        detailsToAdd: [
          "Add inline code comments explaining core function logic.",
          "Test edge cases for empty or invalid input values.",
          "Structure source code into clean modular files.",
        ],
      };
    }

    // Default Course Submission Plan
    return {
      title: "General Course Task Strategy",
      category: "Academic Planning",
      readiness: "Not-Yet",
      tags: ["#study", "#assignment", "#submission"],
      detailsToAdd: [
        "Break the assignment prompt down into discrete milestone tasks.",
        "Check submission guidelines for required repository format.",
        "Include a clear README.md file with setup instructions.",
      ],
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);

    try {
      const result = await request<CourseTaskPlan>("/api/ai", {
        method: "POST",
        body: JSON.stringify({ prompt }),
      });
      setPlan(result);
    } catch {
      setPlan(generateCoursePlan(prompt));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 pt-2">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          Task Coach
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Describe a course assignment, project, or task you need to complete. The AI turns it into a structured study and submission plan.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          rows={5}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., I need help preparing my WEB201 React assignment and checking database connection errors for DBMS301..."
          className="w-full resize-y rounded-lg border border-slate-300 p-4 text-base text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
        />

        <div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-70"
          >
            {loading ? "Planning..." : "Make my plan"}
          </button>
        </div>
      </form>

      {/* Result Card */}
      {plan && (
        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          {/* Title Section */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              SUGGESTED COURSE PLAN
            </span>
            <h2 className="mt-1 text-xl font-bold text-slate-900">
              {plan.title}
            </h2>
          </div>

          {/* Badges Row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
              {plan.category}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                plan.readiness === "Ready"
                  ? "bg-green-100 text-green-800"
                  : plan.readiness === "Almost"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {plan.readiness}
            </span>
          </div>

          {/* Search Tags Section */}
          {plan.tags && plan.tags.length > 0 && (
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                COURSE TAGS
              </span>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {plan.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="rounded bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                  >
                    {tag.startsWith("#") ? tag : `#${tag}`}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Details To Add Section */}
          {plan.detailsToAdd && plan.detailsToAdd.length > 0 && (
            <div className="pt-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                ACTION STEPS BEFORE SUBMITTING
              </span>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-slate-800">
                {plan.detailsToAdd.map((detail, idx) => (
                  <li key={idx}>{detail}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TaskCoachPage;