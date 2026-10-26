export interface Course {
  _id?: string;
  code: string;
  name?: string;
  title?: string;
  description?: string;
}

export interface TaskPlan {
  category?: string;
  priority?: number;
  summary?: string;
  steps?: string[];
}

const API_BASE_URL = "/api";

/**
 * Generic request helper used across components for authenticated and custom API calls.
 */
export async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export async function fetchCourses(): Promise<Course[]> {
  return request<Course[]>("/courses");
}

export async function getCourses(): Promise<Course[]> {
  return fetchCourses();
}

export async function fetchCourseByCode(code: string): Promise<Course> {
  return request<Course>(`/courses/${code}`);
}

export async function askAi(prompt: string): Promise<TaskPlan> {
  return request<TaskPlan>("/coach", {
    method: "POST",
    body: JSON.stringify({ prompt }),
  });
}