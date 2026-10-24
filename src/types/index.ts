export interface Course {
  _id?: string;
  id?: string;
  code: string;
  title: string;
  description: string;
}

export interface Submission {
  _id?: string;
  id?: string;
  courseCode: string;
  title: string;
  content: string;
  createdAt?: string;
}

export interface AiReview {
  readiness?: "ready" | "needs_work" | "not_ready";
  summary?: string;
  strengths?: string[];
  improvements?: string[];
  [key: string]: any;
}