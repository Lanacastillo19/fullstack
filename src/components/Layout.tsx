import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router";
import useAuthStore from "../store/authStore";

export function Layout() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = useAuthStore((state: any) => state.user);
  const logout = useAuthStore((state: any) => state.logout);

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleLogout = () => {
    if (logout) logout();
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-200 ${
      isDarkMode ? "dark bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"
    }`}>
      {/* Top Navbar */}
      <header className={`border-b shadow-sm ${
        isDarkMode ? "border-slate-800 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-900"
      }`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
          <div className="flex items-center space-x-8">
            <Link to="/" className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
              Course Portal
            </Link>

            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link to="/" className={`hover:text-blue-500 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                Dashboard
              </Link>
              <Link to="/courses" className={`hover:text-blue-500 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                Courses
              </Link>
              <Link to="/submissions" className={`hover:text-blue-500 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                Submissions
              </Link>
              <Link
                to="/coach"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Task Coach
              </Link>
            </nav>
          </div>

          {/* Controls: Logout & Dark Mode Toggle */}
          <div className="flex items-center space-x-4">
            {token ? (
              <button
                onClick={handleLogout}
                className={`text-sm font-normal ${isDarkMode ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"}`}
              >
                Logout ({user?.username || "lana_lee_castillio"})
              </button>
            ) : (
              <Link
                to="/login"
                className={`text-sm font-medium ${isDarkMode ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"}`}
              >
                Login
              </Link>
            )}

            {/* Dark Mode Toggle Button */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                isDarkMode
                  ? "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                  : "border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="mx-auto max-w-7xl p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;