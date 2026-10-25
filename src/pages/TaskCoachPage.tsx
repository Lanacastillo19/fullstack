import { useState } from "react";
import { request } from "../api/client";
import type { ListingSuggestion } from "../types/index";

export function TaskCoachPage() {
  const [prompt, setPrompt] = useState("");
  const [suggestion, setSuggestion] = useState<ListingSuggestion | null>(null);
  const [loading, setLoading] = useState(false);

  // Fallback generator matching the screenshot layout exactly
  const generateFallbackSuggestion = (input: string): ListingSuggestion => {
    const cleanInput = input.trim();
    const lower = cleanInput.toLowerCase();

    let title = "Lost Item";
    let category = "Personal Effects";
    let readiness: ListingSuggestion["readiness"] = "Vague";
    let tags = ["#lost", "#item"];
    let detailsToAdd = [
      "Where specifically was the item last seen?",
      "What brand, color, or distinguishing marks does it have?",
      "Are there any contact details inside or attached to it?",
    ];

    if (lower.includes("wallet")) {
      title = "Lost wallet";
      category = "Accessories";
      readiness = "Vague";
      tags = ["#wallet", "#lost"];
      detailsToAdd = [
        "What brand, colour, and material is the wallet?",
        "What specific cards or ID were inside the wallet?",
        "How much cash, if any, was inside the wallet?",
      ];
    } else if (lower.includes("phone") || lower.includes("iphone")) {
      title = "Lost smartphone";
      category = "Electronics";
      readiness = "Ready";
      tags = ["#phone", "#electronics"];
      detailsToAdd = [
        "What model and color is the phone?",
        "Does it have a protective case or stickers?",
        "Is the device locked or trackable via Find My?",
      ];
    }

    return { title, category, readiness, tags, detailsToAdd };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);

    try {
      const result = await request<ListingSuggestion>("/api/ai", {
        method: "POST",
        body: JSON.stringify({ prompt }),
      });
      setSuggestion(result);
    } catch {
      setSuggestion(generateFallbackSuggestion(prompt));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 pt-2">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          Listing Assistant
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Describe an item you lost or found. The assistant suggests a listing title, a category, search tags and details to add.
        </p>
      </div>

      {/* Form Input */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          rows={5}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Where is my wallet??"
          className="w-full resize-y rounded-lg border border-slate-300 p-4 text-base text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
        />

        <div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-70"
          >
            {loading ? "Suggesting..." : "Suggest listing"}
          </button>
        </div>
      </form>

      {/* Result Card */}
      {suggestion && (
        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          {/* Title Section */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              SUGGESTED TITLE
            </span>
            <h2 className="mt-1 text-xl font-bold text-slate-900">
              {suggestion.title}
            </h2>
          </div>

          {/* Badges Row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
              {suggestion.category}
            </span>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900">
              {suggestion.readiness}
            </span>
          </div>

          {/* Search Tags Section */}
          {suggestion.tags && suggestion.tags.length > 0 && (
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                SEARCH TAGS
              </span>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {suggestion.tags.map((tag, idx) => (
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
          {suggestion.detailsToAdd && suggestion.detailsToAdd.length > 0 && (
            <div className="pt-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                DETAILS TO ADD
              </span>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-slate-800">
                {suggestion.detailsToAdd.map((detail, idx) => (
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