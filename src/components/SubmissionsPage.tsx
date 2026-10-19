import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { fetchSubmissions, createSubmission, fetchCourses } from "../api/client";
import type { Course, Submission } from "../types";

interface FormInputs {
  courseCode: string;
  repoUrl: string;
}

export const SubmissionsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, setValue } = useForm<FormInputs>();

  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  const { data: submissions = [] } = useQuery<Submission[]>({
    queryKey: ["submissions"],
    queryFn: fetchSubmissions,
  });

  const mutation = useMutation({
    mutationFn: (newSub: Partial<Submission>) => createSubmission(newSub),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      reset();
    },
  });

  React.useEffect(() => {
    if (courses.length > 0) {
      setValue("courseCode", courses[0].code);
    }
  }, [courses, setValue]);

  const onSubmit = (data: FormInputs) => {
    mutation.mutate({
      courseCode: data.courseCode,
      repoUrl: data.repoUrl,
      submittedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Submissions</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium">Course</label>
          <select {...register("courseCode")} className="border p-2 rounded w-full">
            {courses.map((course: Course) => (
              <option key={course._id || course.code} value={course.code}>
                {course.title} ({course.code})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Repository URL</label>
          <input
            {...register("repoUrl", { required: true })}
            type="url"
            placeholder="https://github.com/username/repo"
            className="border p-2 rounded w-full"
          />
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {mutation.isPending ? "Submitting..." : "Submit Project"}
        </button>
      </form>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Previous Submissions</h2>
        {submissions.map((sub: Submission) => (
          <div key={sub._id || sub.id} className="border p-3 rounded flex justify-between">
            <span>{sub.courseCode || sub.title}</span>
            <a href={sub.repoUrl} target="_blank" rel="noreferrer" className="text-blue-500 underline">
              {sub.repoUrl}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubmissionsPage;