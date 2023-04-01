import { Outlet } from "@solidjs/router";
import { RoleGuard } from "components/auth/guards";
import { Sidebar } from "components/sidebar";
import { FiFileText, FiSearch } from "solid-icons/fi";
import { Role } from "utils/types";

const navigation = [
  {
    text: "历次成绩",
    link: "/student/score",
    icon: FiFileText,
  },
  {
    text: "查分申请",
    link: "/student/review",
    icon: FiSearch,
  },
];

export default function StudentLayout() {
  return (
    <RoleGuard role={Role.STUDENT}>
      <Sidebar nav={navigation} />
      <main class="fixed left-90 right-0 top-0 bottom-0">
        <Outlet />
      </main>
    </RoleGuard>
  );
}
