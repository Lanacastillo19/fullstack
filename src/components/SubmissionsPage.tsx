import React, { useState, useEffect } from "react";

interface Submission {
  _id?: string;
  courseId: string;
  title: string;
  repoUrl: string;
  status?: string;
  createdAt?: string;
}

interface Course {
  _id: string;
  code: string;
  title: string;
}

// Default list of subjects if backend list is empty
const INITIAL_COURSES = [
  { code: "CS101", title: "Introduction to CS" },
  { code: "WEB201", title: "Web Systems & Technologies" },
  { code: "DBMS301", title: "Database Management Systems" },
  { code: "ITE401", title: "Full-Stack Web Development" },
  { code: "NET501", title: "Computer Networking" },
  { code: "SE601", title: "Software Engineering" },
  // ADD NEW SUBJECTS HERE:
  { code: "CYBER701", title: "Cybersecurity Fundamentals" },
  { code: "AI801", title: "Artificial Intelligence" },
  { code: "DATA901", title: "Data Science & Analytics" },
];

export function Submissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Form Fields
  const [selectedCourse, setSelectedCourse] = useState<string>("CS101");
  const [title, setTitle] = useState<string>("");
  const [repoUrl, setRepoUrl] = useState<string>("");

  const API_URL = import.meta.env.VITE_API_URL || "https://backend-21o5.vercel.app";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [coursesRes, submissionsRes] = await Promise.all([
        fetch(`${API_URL}/api/courses`),
        fetch(`${API_URL}/api/submissions`),
      ]);

      if (coursesRes.ok) {
        const coursesData = await coursesRes.json();
        if (coursesData && coursesData.length > 0) {
          setCourses(coursesData);
          setSelectedCourse(coursesData[0].code || coursesData[0]._id);
        }
      }

      if (submissionsRes.ok) {
        const submissionsData = await submissionsRes.json();
        setSubmissions(submissionsData);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Submit project to backend database
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !title || !repoUrl) {
      setError("Please fill out all fields.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: selectedCourse,
          title,
          repoUrl,
        }),
      });

      if (!response.ok) throw new Error("Failed to post submission");

      const savedSubmission = await response.json();
      setSubmissions((prev) => [savedSubmission, ...prev]);

      // Reset input fields
      setTitle("");
      setRepoUrl("");
    } catch (err) {
      console.error("Error saving submission:", err);
      setError("Failed to save to database. Check backend connection.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Submission Form Section */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Submit Project</h2>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Select Course / Subject */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Course / Subject
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                required
              >
                {courses.length > 0
                  ? courses.map((course) => (
                      <option key={course._id} value={course.code || course._id}>
                        {course.code ? `${course.code} - ${course.title}` : course.title}
                      </option>
                    ))
                  : INITIAL_COURSES.map((course) => (
                      <option key={course.code} value={course.code}>
                        {`${course.code} - ${course.title}`}
                      </option>
                    ))}
              </select>
            </div>

            {/* Project Title */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Project Title
              </label>
              <input
                type="text"
                placeholder="e.g. Final Portfolio Project"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                required
              />
            </div>

            {/* Repository URL */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Repository URL
              </label>
              <input
                type="url"
                placeholder="https://github.com/username/repo"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Project"}
            </button>
          </div>
        </form>
      </div>

      {/* Submissions Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-semibold text-slate-900 dark:text-white">Previous Submissions</h3>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">Loading submissions...</div>
        ) : submissions.length === 0 ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">No submissions found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500 dark:bg-slate-800/50 dark:border-slate-800 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-3">Course</th>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Repository</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Submitted Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {submissions.map((sub, index) => (
                  <tr key={sub._id || index} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                      {sub.courseId}
                    </td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                      {sub.title || "Project Submission"}
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={sub.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline dark:text-blue-400"
                      >
                        {sub.repoUrl}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-900/20 dark:text-green-400">
                        {sub.status || "Submitted"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                      {sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : "Just now"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Submissions;