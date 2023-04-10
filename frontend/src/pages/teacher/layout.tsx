import { Outlet } from "@solidjs/router";
import { RoleGuard } from "components/auth/guards";
import { Sidebar } from "components/sidebar";
import {
  FiBookOpen,
  FiEdit,
  FiFileText,
  FiSearch,
  FiUser,
} from "solid-icons/fi";
import { Role } from "utils/types";

const navigation = [
  {
    text: "学生管理",
    link: "/teacher/student",
    icon: FiUser,
  },
  {
    text: "考试管理",
    link: "/teacher/exam",
    icon: FiBookOpen,
  },
  {
    text: "历次成绩",
    link: "/teacher/score",
    icon: FiFileText,
  },
  {
    text: "成绩录入",
    link: "/teacher/add-score",
    icon: FiEdit,
  },
  {
    text: "查分审核",
    link: "/teacher/review",
    icon: FiSearch,
  },
];

export default function StudentLayout() {
  return (
    <RoleGuard role={Role.TEACHER}>
      <Sidebar nav={navigation} />
      <main class="fixed left-90 right-0 top-0 bottom-0">
        <Outlet />
      </main>
    </RoleGuard>
  );
}
