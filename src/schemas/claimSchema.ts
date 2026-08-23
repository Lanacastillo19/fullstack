import { z } from "zod";

export const claimSchema = z.object({
  itemId: z.string().min(1, "Please select an item."),
  proofDescription: z
    .string()
    .min(10, "Proof description must be at least 10 characters long."),
  contactEmail: z
    .string()
    .email("Must be a valid email address.")
    .refine((email) => email.endsWith("@dlsl.edu.ph"), {
      message: "Email must be an official @dlsl.edu.ph institutional email.",
    }),
});

export type ClaimFormValues = z.infer<typeof claimSchema>;