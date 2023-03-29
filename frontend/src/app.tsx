import { Navigate, Outlet, Route, Router, Routes } from "@solidjs/router";
import "@unocss/reset/tailwind.css";
import "virtual:uno.css";

export const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate href="/login" />} />
        <Route path="login" element={<div>Login</div>} />
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
    </Router>
  );
};
