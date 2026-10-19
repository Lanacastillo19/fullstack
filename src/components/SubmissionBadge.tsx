// src/components/SubmissionBadge.tsx
import React from "react";
import type { Submission } from "../types";

export const SubmissionBadge: React.FC<{ submission: Submission }> = ({ submission }) => {
  const dateString = submission.submittedAt
    ? new Date(submission.submittedAt).toLocaleDateString()
    : "N/A";

  const repoUrl = submission.repoUrl ?? "";

  return (
    <div>
      <span>{dateString}</span>
      {repoUrl.startsWith("http") && (
        <a href={repoUrl} target="_blank" rel="noreferrer">
          Repository
        </a>
      )}
      {submission.score !== undefined && <span>{submission.score} / 100</span>}
    </div>
  );
};

export default SubmissionBadge;