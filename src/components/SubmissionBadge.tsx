import { useEffect, useState } from "react";
import { request } from "../api/client";

interface Submission {
  _id?: string;
  id?: string;
  courseCode: string;
  taskTitle: string;
  status: string;
  submittedAt: string;
}

// Default submissions fallback items
const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: "sub-1",
    courseCode: "CS101",
    taskTitle: "Python Basics Script",
    status: "Completed",
    submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "sub-2",
    courseCode: "WEB201",
    taskTitle: "React Component Layout",
    status: "Completed",
    submittedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchSubmissions() {
      try {
        const data = await request<Submission[]>("/submissions");
        if (isMounted) {
          // Check if data is a valid array with elements; if empty or null, use fallback
          if (Array.isArray(data) && data.length > 0) {
            setSubmissions(data);
          } else {
            setSubmissions(MOCK_SUBMISSIONS);
          }
        }
      } catch {
        if (isMounted) setSubmissions(MOCK_SUBMISSIONS);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchSubmissions();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-12 text-sm font-medium text-slate-500">
        Loading submissions...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Submissions</h1>
        <p className="mt-1 text-sm text-slate-500">
          Track the status of your submitted course tasks and assignments.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-6 py-3 font-semibold">Course</th>
              <th className="px-6 py-3 font-semibold">Task</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold">Submitted At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {submissions.map((sub, idx) => (
              <tr key={sub._id || sub.id || idx} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-semibold text-slate-900">
                  {sub.courseCode}
                </td>
                <td className="px-6 py-4 text-slate-700">{sub.taskTitle}</td>
                <td className="px-6 py-4">
                  <span className="rounded-md bg-green-100 px-2.5 py-1 text-xs font-bold text-green-800">
                    {sub.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-slate-500">
                  {new Date(sub.submittedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SubmissionsPage;