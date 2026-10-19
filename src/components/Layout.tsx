import { useEffect } from "react";
import { NavLink, Outlet } from "react-router";
import useAuthStore from "../store/authStore";
import useUiStore from "../store/uiStore";

function Layout() {
  const isDarkMode = useUiStore((state) => state.isDarkMode);
  const toggleDarkMode = useUiStore((state) => state.toggleDarkMode);
  const userName = useAuthStore((state) => state.userName);
  const logout = useAuthStore((state) => state.logout);

  const base = "rounded px-3 py-1.5 text-sm";
  const activeLink = `${base} bg-blue-600 font-semibold text-white`;
  const idleLink = `${base} text-gray-700 hover:bg-gray-200 dark:text-gray-300`;

  const linkClass = ({ isActive }: { isActive: boolean }): string =>
    isActive ? activeLink : idleLink;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-slate-50 transition-colors dark:bg-slate-950">
      <nav className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white p-4 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-900">
        <span className="mr-4 font-bold text-gray-900 dark:text-white">
          Course Portal
        </span>
        <NavLink to="/" end className={linkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/courses" className={linkClass}>
          Courses
        </NavLink>
        <NavLink to="/submissions" className={linkClass}>
          Submissions
        </NavLink>

        {userName === null ? (
          <NavLink to="/login" className={linkClass}>
            Login
          </NavLink>
        ) : (
          <button
            onClick={logout}
            className="rounded px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300"
          >
            Logout ({userName})
          </button>
        )}

        <button
          onClick={toggleDarkMode}
          className="ml-auto rounded bg-gray-800 px-3 py-1.5 text-sm text-white dark:bg-gray-200 dark:text-gray-900"
        >
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </nav>
      <main className="mx-auto max-w-7xl p-5 sm:p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;