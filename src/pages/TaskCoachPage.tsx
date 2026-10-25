import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { askAi } from "../api/client";
import { taskSchema, type TaskFormValues } from "../schemas/taskSchema";
import type { TaskCategory } from "../types/index";

// One colour per category, so the badge is readable at a glance.
const categoryStyle: Record<TaskCategory, string> = {
  work: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  personal: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  urgent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

function TaskCoachPage() {
  // The form: react-hook-form runs taskSchema before onSubmit is called.
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: { prompt: "" },
  });

  // The call to the backend: askAi sends the prompt, mutation holds the
  // loading state, the error, and the TaskPlan that comes back.
  const mutation = useMutation({ mutationFn: askAi });

  const onSubmit = (values: TaskFormValues) => {
    mutation.mutate(values.prompt);
  };

  const plan = mutation.data;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Task Coach
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Describe one thing you need to do. The AI turns it into a short plan.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900"
      >
        <label
          htmlFor="prompt"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Your task
        </label>
        <textarea
          id="prompt"
          rows={5}
          placeholder="Example: I need to finish my ITELECT4 project and deploy it before Friday."
          className="w-full rounded border border-slate-300 bg-white p-2 text-sm text-gray-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          {...register("prompt")}
        />
        {errors.prompt && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {errors.prompt.message}
          </p>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {mutation.isPending ? "Thinking..." : "Make my plan"}
        </button>
      </form>

      {/* The backend's own message: 400, 429 or 502. */}
      {mutation.isError && (
        <p className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          {(mutation.error as Error).message}
        </p>
      )}

      {/* Every field of the reply: summary, steps, category, priority. */}
      {plan && (
        <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded px-2 py-1 text-xs font-semibold uppercase ${
                plan.category && (plan.category as TaskCategory) in categoryStyle
                  ? categoryStyle[plan.category as TaskCategory]
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {plan.category}
            </span>
            <span className="rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
              Priority {plan.priority} / 5
            </span>
          </div>

          <p className="text-gray-900 dark:text-white">{plan.summary}</p>

          {plan.steps && Array.isArray(plan.steps) && (
            <div>
              <h2 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Steps
              </h2>
              <ol className="list-decimal space-y-1 pl-5 text-sm text-gray-800 dark:text-gray-200">
                {plan.steps.map((step: string, index: number) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default TaskCoachPage;