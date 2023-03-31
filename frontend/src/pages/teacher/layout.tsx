import { Outlet } from "@solidjs/router";
import { RoleGuard } from "components/auth/guards";
import { NavLink } from "components/nav-link";
import { Sidebar } from "components/sidebar";
import { FiEdit, FiFileText, FiSearch } from "solid-icons/fi";
import { Role } from "utils/types";

export default function StudentLayout() {
  return (
    <RoleGuard role={Role.TEACHER}>
      <main class="fixed left-0 right-0 left-0 right-0">
        <Sidebar>
          <NavLink to="/teacher/score">
            <FiFileText size={16} />
            历次成绩
          </NavLink>
          <NavLink to="/teacher/add-score">
            <FiEdit size={16} />
            成绩录入
          </NavLink>
          <NavLink to="/teacher/review">
            <FiSearch size={16} />
            查分审核
          </NavLink>
        </Sidebar>
        <Outlet />
      </main>
    </RoleGuard>
  );
}
