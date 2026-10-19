import type { ReactNode } from "react";
import type { ApiSubmission } from "../types";

interface SubmissionBadgeProps {
  submission: ApiSubmission;
  children?: ReactNode;
}

export default function SubmissionBadge({
  submission,
  children,
}: SubmissionBadgeProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-blue-600 dark:text-blue-400">
          {submission.courseCode}
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {new Date(submission.submittedAt).toLocaleDateString()}
        </span>
      </div>

      <p className="mt-2 text-sm text-slate-800 dark:text-slate-200">
        <span className="font-medium">Repository:</span>{" "}
        <a
          href={
            submission.repoUrl.startsWith("http")
              ? submission.repoUrl
              : `https://${submission.repoUrl}`
          }
          target="_blank"
          rel="noreferrer"
          className="text-blue-500 underline hover:text-blue-600"
        >
          {submission.repoUrl}
        </a>
      </p>

      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        <span className="font-medium">Score:</span>{" "}
        {submission.score !== undefined ? (
          <span className="font-semibold text-green-600 dark:text-green-400">
            {submission.score} / 100
          </span>
        ) : (
          <span className="italic text-amber-500">Not graded yet</span>
        )}
      </p>

      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}