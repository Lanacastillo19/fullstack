import { Link, Outlet, useNavigate } from "react-router";
import useAuthStore from "../store/authStore";

export function Layout() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = useAuthStore((state: any) => state.user);
  const logout = useAuthStore((state: any) => state.logout);

  const handleLogout = () => {
    if (logout) logout();
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Top Navbar */}
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center px-8 py-4">
          <Link to="/" className="text-xl font-bold text-slate-900 mr-12">
            Course Portal
          </Link>

          <nav className="flex items-center space-x-8 text-sm font-medium text-slate-600">
            <Link to="/" className="hover:text-slate-900">
              Dashboard
            </Link>
            <Link to="/courses" className="hover:text-slate-900">
              Courses
            </Link>
            <Link to="/submissions" className="hover:text-slate-900">
              Submissions
            </Link>
            <Link
              to="/coach"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Task Coach
            </Link>

            {token ? (
              <button
                onClick={handleLogout}
                className="text-sm font-normal text-slate-600 hover:text-slate-900"
              >
                Logout ({user?.username || "lana_lee_castillio"})
              </button>
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                Login
              </Link>
            )}
          </nav>
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