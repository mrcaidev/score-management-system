import { Route, Router, Routes } from "@solidjs/router";
import "@unocss/reset/tailwind.css";
import { RootGuard } from "components/auth/guards";
import { AuthProvider } from "components/auth/provider";
import { ThemeProvider } from "components/theme/provider";
import { lazy } from "solid-js";
import { Toaster } from "solid-toast";
import "virtual:uno.css";

const Login = lazy(() => import("pages/login"));
const StudentLayout = lazy(() => import("pages/student/layout"));
const TeacherLayout = lazy(() => import("pages/teacher/layout"));

export const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<RootGuard />} />
            <Route path="login" component={Login} />
            <Route path="student" component={StudentLayout}>
              <Route path="/" element={<div>Student Home</div>} />
              <Route path="review" element={<div>Student Review</div>} />
              <Route path="score" element={<div>Student Score</div>} />
            </Route>
            <Route path="teacher" component={TeacherLayout}>
              <Route path="/" element={<div>Teacher Home</div>} />
              <Route path="review" element={<div>Teacher Review</div>} />
              <Route path="score" element={<div>Teacher Score</div>} />
              <Route path="add-score" element={<div>Teacher Score Add</div>} />
            </Route>
          </Routes>
          <Toaster position="top-center" />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};
