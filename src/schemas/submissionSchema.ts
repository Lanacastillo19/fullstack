import { z } from "zod";

export const submissionSchema = z.object({
  courseCode: z.string().min(1, "Please select a course."),
  repoUrl: z
    .string()
    .min(1, "Repository URL is required.")
    .url("Must be a valid URL (e.g., https://github.com/user/repo).")
    .refine(
      (val) => val.includes("github.com"),
      "URL must contain github.com"
    ),
});

export type SubmissionFormValues = z.infer<typeof submissionSchema>;