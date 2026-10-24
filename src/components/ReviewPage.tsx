import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { askAi } from "../api/client";
import type { AiReview } from "../types/index";
import { reviewFormSchema, type ReviewFormValues } from "../schemas/reviewSchema";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const READINESS_STYLE: Record<string, string> = {
  ready: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  almost: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  needs_work: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  not_ready: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export default function ReviewPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: { prompt: "" },
  });

  const review = useMutation<AiReview, Error, string>({
    mutationFn: askAi,
  });

  const onSubmit = (values: ReviewFormValues) => {
    review.mutate(values.prompt);
  };

  const readinessKey = review.data?.readiness || "needs_work";

  return (
    <div className="max-w-2xl">
      <h2 className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">AI Review</h2>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Describe your project and get feedback before you submit it.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="prompt" className="text-foreground">Project description</Label>
          <textarea
            id="prompt"
            rows={6}
            {...register("prompt")}
            aria-invalid={errors.prompt ? true : undefined}
            placeholder="What it does, how it is built, where it runs..."
            className="rounded-lg border border-input bg-background p-2.5 text-sm text-foreground"
          />
          {errors.prompt && (
            <p className="text-sm text-red-600">{errors.prompt.message}</p>
          )}
        </div>

        <Button type="submit" disabled={review.isPending} className="justify-self-start">
          {review.isPending ? "Reviewing..." : "Review my project"}
        </Button>
      </form>

      {review.isError && (
        <p className="mt-4 text-sm text-red-700">{review.error.message}</p>
      )}

      {review.data && (
        <div className="mt-6 grid gap-4 rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <span
            className={`justify-self-start rounded px-2 py-0.5 text-sm font-semibold ${
              READINESS_STYLE[readinessKey] || READINESS_STYLE["needs_work"]
            }`}
          >
            {review.data.readiness || "needs_work"}
          </span>
          <p className="text-gray-900 dark:text-white">{review.data.summary}</p>

          {review.data.strengths && review.data.strengths.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Strengths</h3>
              <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300">
                {review.data.strengths.map((s: string) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {review.data.improvements && review.data.improvements.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Before you submit</h3>
              <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300">
                {review.data.improvements.map((s: string) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}