import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { askAi } from "../api/client";
import type { AiListing } from "../types/index";

// Same rule as the backend: the server checks it again, this one just
// saves a round trip and shows the message next to the field.
const formSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(20, "Describe the item in at least 20 characters.")
    .max(2000, "Keep the description under 2000 characters."),
});

type FormValues = z.infer<typeof formSchema>;

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function ListingResult({ listing }: { listing: AiListing }) {
  const detailed = listing.detailLevel === "detailed";

  return (
    <div className="mt-6 space-y-4 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <div>
        <p className="text-xs uppercase text-gray-500 dark:text-gray-400">
          Suggested title
        </p>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {listing.title}
        </h2>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
          {capitalize(listing.category)}
        </span>
        <span
          className={`rounded-full px-3 py-1 text-sm font-medium ${
            detailed
              ? "bg-green-100 text-green-800"
              : "bg-amber-100 text-amber-800"
          }`}
        >
          {capitalize(listing.detailLevel)}
        </span>
      </div>

      <div>
        <p className="mb-1 text-xs uppercase text-gray-500 dark:text-gray-400">
          Search tags
        </p>
        <div className="flex flex-wrap gap-2">
          {listing.tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-gray-100 px-2 py-1 text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-200"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-1 text-xs uppercase text-gray-500 dark:text-gray-400">
          Details to add
        </p>
        <ul className="list-disc space-y-1 pl-5 text-gray-800 dark:text-gray-200">
          {listing.missingDetails.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function ListingAssistantPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { prompt: "" },
  });

  const mutation = useMutation({ mutationFn: askAi });

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values.prompt);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Listing Assistant
      </h1>
      <p className="mb-4 text-gray-600 dark:text-gray-400">
        Describe an item you lost or found. The assistant suggests a listing
        title, a category, search tags and details to add.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
        <textarea
          {...register("prompt")}
          rows={5}
          placeholder="Found a black wallet near the cafeteria with a school ID inside..."
          className="w-full rounded border border-gray-300 bg-white p-3 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />
        {errors.prompt && (
          <p className="text-sm text-red-600">{errors.prompt.message}</p>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {mutation.isPending ? "Thinking..." : "Suggest listing"}
        </button>
      </form>

      {mutation.isError && (
        <p className="mt-4 rounded border border-red-300 bg-red-50 p-3 text-red-700">
          {mutation.error.message}
        </p>
      )}

      {mutation.isSuccess && <ListingResult listing={mutation.data} />}
    </div>
  );
}