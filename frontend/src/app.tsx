import { Route, Router, Routes } from "@solidjs/router";
import "@unocss/reset/tailwind.css";
import { RootGuard } from "components/auth/guards";
import { AuthProvider } from "components/auth/provider";
import { ThemeProvider } from "components/theme/provider";
import { examsData } from "pages/exams.data";
import { reviewsData } from "pages/reviews.data";
import { lazy } from "solid-js";
import { Toaster } from "solid-toast";
import "virtual:uno.css";

const Login = lazy(() => import("pages/login"));
const StudentLayout = lazy(() => import("pages/student/layout"));
const StudentHome = lazy(() => import("pages/student/home"));
const StudentScore = lazy(() => import("pages/student/score"));
const StudentReview = lazy(() => import("pages/student/review"));
const TeacherLayout = lazy(() => import("pages/teacher/layout"));
const TeacherHome = lazy(() => import("pages/teacher/home"));
const TeacherScore = lazy(() => import("pages/teacher/score"));
const TeacherAddScore = lazy(() => import("pages/teacher/add-score"));
const TeacherReview = lazy(() => import("pages/teacher/review"));

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
              <Route
                path="review"
                component={StudentReview}
                data={reviewsData}
              />
            </Route>
            <Route path="teacher" component={TeacherLayout}>
              <Route path="/" component={TeacherHome} />
              <Route path="score" component={TeacherScore} data={examsData} />
              <Route path="add-score" component={TeacherAddScore} />
              <Route
                path="review"
                component={TeacherReview}
                data={reviewsData}
              />
            </Route>
          </Routes>
        </Router>
        <Toaster position="top-center" />
      </AuthProvider>
    </ThemeProvider>
  );
};
