import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "./components/Layout";
import DashboardPage from "./pages/DashboardPage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import SubmissionsPage from "./components/SubmissionsPage";
import TaskCoachPage from "./pages/TaskCoachPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route index element={<DashboardPage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="courses/:id" element={<CourseDetailPage />} />
          <Route path="coach" element={<TaskCoachPage />} />
          <Route path="submissions" element={<SubmissionsPage />} />
          <Route path="login" element={<LoginPage />} />

          {/* Fallback 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;