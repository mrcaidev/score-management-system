import { Route, Router, Routes } from "@solidjs/router";
import "@unocss/reset/tailwind.css";
import { RootGuard } from "components/auth/guards";
import { AuthProvider } from "components/auth/provider";
import { ThemeProvider } from "components/theme/provider";
import { examsData } from "pages/exams.data";
import { lazy } from "solid-js";
import { Toaster } from "solid-toast";
import "virtual:uno.css";

const Login = lazy(() => import("pages/login"));
const StudentLayout = lazy(() => import("pages/student/layout"));
const StudentHome = lazy(() => import("pages/student/home"));
const StudentScore = lazy(() => import("pages/student/score"));
const TeacherLayout = lazy(() => import("pages/teacher/layout"));
const TeacherHome = lazy(() => import("pages/teacher/home"));

export const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" component={RootGuard} />
            <Route path="login" component={Login} />
            <Route path="student" component={StudentLayout}>
              <Route path="/" component={StudentHome} />
              <Route path="score" component={StudentScore} data={examsData} />
              <Route path="review" element={<div>Student Review</div>} />
            </Route>
            <Route path="teacher" component={TeacherLayout}>
              <Route path="/" component={TeacherHome} />
              <Route path="score" element={<div>Teacher Score</div>} />
              <Route path="add-score" element={<div>Teacher Score Add</div>} />
              <Route path="review" element={<div>Teacher Review</div>} />
            </Route>
          </Routes>
          <Toaster position="top-center" />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};
