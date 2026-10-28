import { useState } from "react";
import { taskSchema } from "../schemas/taskSchema";

export default function TaskCoach() {
  const [prompt, setPrompt] = useState("");
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMakePlan = async () => {
    const result = taskSchema.safeParse({ prompt });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return; // stop here, so no request is sent
    }
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("https://backend-mnio.vercel.app/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setPlan(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Task Coach</h2>
        <p className="text-gray-600">
          Describe one thing you need to do. The AI turns it into a short plan.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border space-y-4">
        <label htmlFor="task-prompt" className="block text-sm font-medium">
          Your task
        </label>
        <textarea
          id="task-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Give me a 3-step study plan for my exam"
          className="w-full p-3 border rounded-md"
          rows={4}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          onClick={handleMakePlan}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {loading ? "Generating..." : "Make my plan"}
        </button>
      </div>

      {plan && (
        <div className="bg-white p-6 rounded-lg shadow border space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="text-lg font-semibold">{plan.title || "Study Plan"}</h3>
            <span className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-xs font-medium">
              Priority {plan.priority ?? 3} / 5
            </span>
          </div>

          {Array.isArray(plan.steps) && plan.steps.length > 0 ? (
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {plan.steps.map((step: string, index: number) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-700 whitespace-pre-line">
              {plan.reply || plan.text || "No steps generated."}
            </p>
          )}
        </div>
      )}
    </div>
  );
}