// Example: Ensure your base endpoints prefix with /api
export async function fetchCourses() {
  const response = await fetch("/api/courses", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch courses");
  return response.json();
}

export async function fetchSubmissions() {
  const response = await fetch("/api/submissions", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch submissions");
  return response.json();
}