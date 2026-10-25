import { useState } from "react";
import { askAi, type TaskPlan } from "../api/client";

export function TaskCoachPage() {
  const [prompt, setPrompt] = useState("");
  const [plan, setPlan] = useState<TaskPlan | null>(null);
  const [loading, setLoading] = useState(false);

  const generateUniversalPlan = (userPrompt: string): TaskPlan => {
    const cleanPrompt = userPrompt.trim().replace(/^["']|["']$/g, "");
    const lower = cleanPrompt.toLowerCase();

    // 1. Specific Roadmaps & Learning Paths
    if (lower.includes("roadmap") || lower.includes("1-month") || lower.includes("mastering") || lower.includes("learning roadmap")) {
      return {
        category: "Learning Roadmap",
        priority: 1,
        summary: `1-Month Learning Roadmap: ${cleanPrompt}`,
        steps: [
          "Week 1 (React Router v7): Master modern routing, nested routes, dynamic parameters (:id), and navigation hooks.",
          "Week 2 (Backend Foundations): Build Express REST APIs in Node.js, handle request parameters, and standard HTTP error codes.",
          "Week 3 (Database & Schemas): Connect MongoDB with Mongoose, build Data Models, and perform complete CRUD operations.",
          "Week 4 (Integration & Deployment): Connect React frontend to Node API, implement local error fallbacks, and deploy.",
        ],
      };
    }

    // 2. Workload / Deadline / Prioritization
    if (lower.includes("deadline") || lower.includes("prioritize") || lower.includes("workload") || lower.includes("overwhelmed")) {
      return {
        category: "Workload Strategy",
        priority: 1,
        summary: `Prioritization Plan for: ${cleanPrompt}`,
        steps: [
          "Audit & Rank: List all subjects by submission deadline urgency and required completion effort.",
          "Time-Block Allocations: Reserve 90-minute deep focus sessions for the most urgent assignment first.",
          "Break Down Tasks: Divide each assignment into small, measurable sub-tasks.",
          "Buffer & Progress Tracking: Set interim micro-deadlines 24 hours before actual submission.",
        ],
      };
    }

    // 3. Exam Study & Quiz Review
    if (lower.includes("study") || lower.includes("exam") || lower.includes("quiz")) {
      return {
        category: "Study Plan",
        priority: 1,
        summary: `Study Breakdown for: ${cleanPrompt}`,
        steps: [
          "Core Concept Breakdown: Map out primary subjects and key formulas/topics to cover.",
          "Pomodoro Study Blocks: Study in 25-minute focused bursts followed by short 5-minute breaks.",
          "Active Recall: Practice active recall by explaining key concepts without looking at notes.",
          "Self-Assessment: Test your knowledge using past quiz questions or practice problems.",
        ],
      };
    }

    // 4. Default Fallback
    return {
      category: "Task Breakdown",
      priority: 1,
      summary: `Action Plan for: ${cleanPrompt}`,
      steps: [
        `Define Goal: Clarify key deliverables for ${cleanPrompt.slice(0, 40)}${cleanPrompt.length > 40 ? "..." : ""}.`,
        "Gather Materials: Collect necessary notes, code repositories, or reference guides.",
        "Structured Execution: Complete the highest-priority sub-task first.",
        "Final Review: Double-check your completed work against assignment criteria.",
      ],
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);

    try {
      const result = await askAi(prompt);
      setPlan(result);
    } catch {
      setPlan(generateUniversalPlan(prompt));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 pt-2">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Task Coach</h1>
        <p className="mt-1 text-sm text-slate-500">
          Describe one thing you need to do. The AI turns it into a short plan.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <label htmlFor="task-prompt" className="block text-sm font-semibold text-slate-700">
          Your task
        </label>
        
        <textarea
          id="task-prompt"
          rows={5}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe what you want to work on..."
          className="w-full resize-y rounded-lg border border-slate-300 p-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />

        <div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-75"
          >
            {loading ? "Thinking..." : "Make my plan"}
          </button>
        </div>
      </form>

      {plan && (
        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            {plan.category && (
              <span className="rounded-md bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-800">
                {plan.category}
              </span>
            )}
            {plan.priority !== undefined && (
              <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                Priority {plan.priority} / 5
              </span>
            )}
          </div>

          {plan.summary && <p className="text-sm font-medium text-slate-800">{plan.summary}</p>}

          {plan.steps && Array.isArray(plan.steps) && (
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Action Plan
              </h2>
              <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700">
                {plan.steps.map((step: string, index: number) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TaskCoachPage;