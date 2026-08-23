import { useForm, type SubmitHandler } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { claimSchema, type ClaimFormValues } from "../schemas/claimSchema";
import { api, type ClaimRecord, type NewClaim } from "../api/client";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
export default function ClaimsPage() {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClaimFormValues>({
    resolver: zodResolver(claimSchema),
    mode: "onBlur",
    defaultValues: {
      itemId: "",
      proofDescription: "",
      contactEmail: "",
    },
  });

  const createClaim = useMutation<ClaimRecord, Error, NewClaim>({
    mutationFn: api.createClaim,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["claims"] });
      reset();
    },
  });

  const onSubmit: SubmitHandler<ClaimFormValues> = (data) => {
    createClaim.mutate({
      itemId: data.itemId,
      userId: data.contactEmail,
      notes: data.proofDescription,
      status: "Pending",
      submittedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Submit a Claim</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="itemId">Item ID</Label>
          <Input
            id="itemId"
            {...register("itemId")}
            placeholder="e.g., ITEM-123"
            aria-invalid={errors.itemId ? true : undefined}
          />
          {errors.itemId && (
            <p className="text-sm text-red-500 mt-1">{errors.itemId.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="proofDescription">Proof Description</Label>
          <Input
            id="proofDescription"
            {...register("proofDescription")}
            placeholder="Describe features, distinctive markings, etc."
            aria-invalid={errors.proofDescription ? true : undefined}
          />
          {errors.proofDescription && (
            <p className="text-sm text-red-500 mt-1">
              {errors.proofDescription.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="contactEmail">Institutional Email</Label>
          <Input
            id="contactEmail"
            type="email"
            {...register("contactEmail")}
            placeholder="yourname@dlsl.edu.ph"
            aria-invalid={errors.contactEmail ? true : undefined}
          />
          {errors.contactEmail && (
            <p className="text-sm text-red-500 mt-1">
              {errors.contactEmail.message}
            </p>
          )}
        </div>

        {createClaim.isError && (
          <p className="text-sm text-red-500" role="alert">
            Unable to submit your claim. Please try again.
          </p>
        )}

        <Button type="submit" className="w-full" disabled={createClaim.isPending}>
          {createClaim.isPending ? "Submitting..." : "Submit Claim"}
        </Button>
      </form>
    </div>
  );
}