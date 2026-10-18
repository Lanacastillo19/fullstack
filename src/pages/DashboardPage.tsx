import { useState } from "react";
import useToggle from "../hooks/useToggle";
import { mockUser } from "../data/mockData";

export default function DashboardPage() {
  // Use mockUser directly
  const [selectedUser, setSelectedUser] = useState<string | null>(mockUser.name);
  const [showDetails, toggleDetails] = useToggle(true);

  // Toggle selection on click
  const handleToggleSelect = () => {
    setSelectedUser((prev) => (prev ? null : mockUser.name));
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 p-6 transition-colors dark:bg-slate-900 md:p-10">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Dashboard Overview
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage your profile and track active lost and found reports.
            </p>
          </div>
          <button
            onClick={toggleDetails}
            className="w-fit rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-100 hover:text-slate-900 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white"
          >
            {showDetails ? "Hide Details" : "Show Details"}
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* User Profile Card */}
          <div className="flex flex-col items-center rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-800/60">
            <div className="relative mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white shadow-md ring-4 ring-blue-500/10 dark:ring-blue-500/20">
              {mockUser.name.charAt(0)}
              <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-800" />
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {mockUser.name}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {mockUser.email}
            </p>

            {/* Expandable Details */}
            {showDetails && (
              <div className="mt-6 w-full space-y-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-900/50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Role</span>
                  <span className="font-semibold capitalize text-slate-800 dark:text-slate-200">
                    {mockUser.role}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Status</span>
                  <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
                    Active
                  </span>
                </div>
              </div>
            )}

            {/* Dynamic Select/Deselect Button */}
            <button
              onClick={handleToggleSelect}
              className={`mt-6 w-full rounded-xl py-2.5 text-sm font-semibold text-white shadow-md transition-all active:scale-[0.98] ${
                selectedUser
                  ? "bg-slate-700 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600"
                  : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20 dark:bg-blue-500 dark:hover:bg-blue-600"
              }`}
            >
              {selectedUser ? "Deselect Profile" : "Select Profile"}
            </button>
          </div>

          {/* Activity Cards & Stats */}
          <div className="space-y-6 md:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-800/60">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Total Reported
                </span>
                <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
                  4 Items
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Active listings in system
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-800/60">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Submitted Claims
                </span>
                <p className="mt-2 text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                  1 Claim
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Pending review
                </p>
              </div>
            </div>

            {/* Selected User Banner */}
            <div className="rounded-2xl border border-blue-200/80 bg-blue-50/60 p-6 shadow-sm dark:border-blue-900/40 dark:bg-blue-950/30">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Active Selection
              </span>
              <p className="mt-2 text-base text-slate-700 dark:text-slate-300">
                Selected:{" "}
                <span className="font-bold text-slate-900 dark:text-white">
                  {selectedUser ?? "None"}
                </span>{" "}
                {selectedUser && (
                  <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
                    ({mockUser.role})
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}