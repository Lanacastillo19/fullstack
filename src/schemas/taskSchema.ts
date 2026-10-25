import { z } from "zod";

// Same rule as the backend's aiRequestSchema, so the form catches a
// bad prompt before any request is sent.
export const taskSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(20, "Describe your task in at least 20 characters.")
    .max(2000, "Keep the description under 2000 characters."),
});

export type TaskFormValues = z.infer<typeof taskSchema>;