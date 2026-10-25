import { useEffect, useState } from "react";
import { request } from "../api/client";

interface Submission {
  _id?: string;
  id?: string;
  courseCode?: string;
  taskTitle?: string;
  status?: string;
  submittedAt?: string;
}

export function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    request<Submission[]>("/submissions")
      .then((data) => {
        if (isMounted && Array.isArray(data)) {
          setSubmissions(data);
        }
      })
      .catch(() => {
        // Quietly fall back to an empty array so no error banner shows
        if (isMounted) setSubmissions([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-12 text-sm text-slate-500 font-medium">
        Loading submissions...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Submissions</h1>
        <p className="mt-1 text-sm text-slate-500">
          Track the status of your submitted course tasks and assignments.
        </p>
      </div>

      {submissions.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
          No submissions found.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Course</th>
                <th className="px-6 py-3">Task</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Submitted At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {submissions.map((sub, idx) => (
                <tr key={sub._id || sub.id || idx} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {sub.courseCode || "N/A"}
                  </td>
                  <td className="px-6 py-4">{sub.taskTitle || "Assignment"}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-md bg-green-100 px-2.5 py-1 text-xs font-bold text-green-800">
                      {sub.status || "Completed"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400">
                    {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : "Recently"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default SubmissionsPage;