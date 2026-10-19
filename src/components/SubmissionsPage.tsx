import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetchSubmissions, createSubmission, fetchCourses } from "../api/client";
import { submissionSchema, type SubmissionFormValues } from "../schemas/submissionSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SubmissionsPage() {
  const queryClient = useQueryClient();

  const { data: courses = [] } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ["submissions"],
    queryFn: fetchSubmissions,
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionSchema),
    defaultValues: { courseCode: "", repoUrl: "" },
  });

  useEffect(() => {
    if (courses.length > 0) {
      setValue("courseCode", courses[0].code);
    }
  }, [courses, setValue]);

  const mutation = useMutation({
    mutationFn: createSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      reset({ courseCode: courses[0]?.code || "", repoUrl: "" });
    },
  });

  const onSubmit = (data: SubmissionFormValues) => {
    mutation.mutate({
      studentId: 1,
      courseCode: data.courseCode,
      repoUrl: data.repoUrl,
      submittedAt: new Date(),
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Submissions</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 space-y-4"
      >
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Submit Repository</h2>
        <div className="flex flex-col gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="courseCode">Course</Label>
            <select
              id="courseCode"
              {...register("courseCode")}
              className="w-full rounded border border-slate-300 p-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {courses.map((course) => (
                <option key={course.code} value={course.code}>
                  {course.code}
                </option>
              ))}
            </select>
            {errors.courseCode && (
              <p className="text-xs text-red-500">{errors.courseCode.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="repoUrl">Repository URL</Label>
            <Input
              id="repoUrl"
              type="text"
              placeholder="https://github.com/user/repo"
              {...register("repoUrl")}
            />
            {errors.repoUrl && (
              <p className="text-xs text-red-500">{errors.repoUrl.message}</p>
            )}
          </div>

          <Button type="submit" disabled={mutation.isPending} className="w-fit">
            {mutation.isPending ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>

      {isLoading ? (
        <p className="text-slate-500">Loading submissions...</p>
      ) : (
        <div className="space-y-3">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
            >
              <div>
                <span className="font-bold text-blue-600 dark:text-blue-400">{sub.courseCode}</span>
                <p className="text-sm text-slate-700 dark:text-slate-300">{sub.repoUrl}</p>
                <p className="text-xs text-slate-400">
                  {new Date(sub.submittedAt).toLocaleDateString()}
                </p>
              </div>
              {sub.score !== undefined && (
                <span className="rounded bg-green-100 px-2 py-1 text-xs font-bold text-green-800 dark:bg-green-900 dark:text-green-200">
                  Score: {sub.score}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}