import React, { useState, useEffect } from "react";

interface Submission {
  _id?: string;
  course: string;
  title: string;
  repository: string;
  status: string;
  submittedDate: string;
}

export const Submissions: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Replace with your actual backend fetch logic if connecting to live API
    const fetchSubmissions = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/submissions`);
        if (res.ok) {
          const data = await res.json();
          setSubmissions(data);
        }
      } catch (err) {
        console.error("Failed to fetch submissions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-4 px-6">Course</th>
                <th className="py-4 px-6">Title</th>
                <th className="py-4 px-6">Repository</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Submitted Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-500">
                    Loading submissions...
                  </td>
                </tr>
              ) : submissions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-500">
                    No submissions found.
                  </td>
                </tr>
              ) : (
                submissions.map((sub, idx) => (
                  <tr key={sub._id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                      {sub.course}
                    </td>
                    <td className="py-4 px-6 text-slate-700 dark:text-slate-300">
                      {sub.title}
                    </td>
                    <td className="py-4 px-6">
                      <a
                        href={sub.repository}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                      >
                        GitHub Link
                      </a>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          sub.status?.toUpperCase() === "GRADED"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        }`}
                      >
                        {sub.status?.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 dark:text-slate-400">
                      {sub.submittedDate}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Submissions;