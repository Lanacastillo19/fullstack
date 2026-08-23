import { z } from "zod";

export const submissionSchema = z.object({
  // .min(1) is what "required" means for a string: not empty.
  courseCode: z.string().min(1, "Choose a course."),

  // z.url() checks the whole shape of a URL, scheme included.
  // .refine() adds any rule Zod does not ship: yours, as a function.
  repoUrl: z
    .string()
    .url("That is not a valid URL -- include https://")
    .refine((url) => url.includes("github.com"), {
      message: "It has to be a GitHub URL.",
    }),
});

// z.infer reads the schema and hands back the TypeScript type
export type SubmissionFormValues = z.infer<typeof submissionSchema>;