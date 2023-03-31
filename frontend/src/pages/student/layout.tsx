import { Outlet } from "@solidjs/router";
import { RoleGuard } from "components/auth/guards";
import { NavLink } from "components/nav-link";
import { Sidebar } from "components/sidebar";
import { FiFileText, FiSearch } from "solid-icons/fi";
import { Role } from "utils/types";

export default function StudentLayout() {
  return (
    <RoleGuard role={Role.STUDENT}>
      <main class="fixed left-0 right-0 left-0 right-0">
        <Sidebar>
          <NavLink to="/student/score">
            <FiFileText size={16} />
            历次成绩
          </NavLink>
          <NavLink to="/student/review">
            <FiSearch size={16} />
            查分申请
          </NavLink>
        </Sidebar>
        <Outlet />
      </main>
    </RoleGuard>
  );
}
