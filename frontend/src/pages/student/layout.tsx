import { Outlet } from "@solidjs/router";
import { RoleGuard } from "components/auth/guards";
import { NavLink } from "components/nav-link";
import { Sidebar } from "components/sidebar";
import { FiFileText, FiSearch } from "solid-icons/fi";
import { Role } from "utils/types";

export default function StudentLayout() {
  return (
    <RoleGuard role={Role.STUDENT}>
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
      <main class="fixed left-90 right-0 top-0 bottom-0">
        <Outlet />
      </main>
    </RoleGuard>
  );
}
