import { Navigate, Outlet, Route, Router, Routes } from "@solidjs/router";
import "@unocss/reset/tailwind.css";
import { AuthProvider } from "components/auth/provider";
import { lazy } from "solid-js";
import { Toaster } from "solid-toast";
import "virtual:uno.css";

const Login = lazy(() => import("pages/login"));

export const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate href="/login" />} />
          <Route path="login" component={Login} />
          <Route
            path="student"
            element={
              <div>
                Student Layout
                <Outlet />
              </div>
            }
          >
            <Route path="/" element={<div>Student Home</div>} />
            <Route path="review" element={<div>Student Review</div>} />
            <Route path="score" element={<div>Student Score</div>} />
          </Route>
          <Route
            path="teacher"
            element={
              <div>
                Teacher Layout
                <Outlet />
              </div>
            }
          >
            <Route path="/" element={<div>Teacher Home</div>} />
            <Route path="review" element={<div>Teacher Review</div>} />
            <Route path="score" element={<div>Teacher Score</div>} />
          </Route>
        </Routes>
        <Toaster position="top-center" />
      </Router>
    </AuthProvider>
  );
};
