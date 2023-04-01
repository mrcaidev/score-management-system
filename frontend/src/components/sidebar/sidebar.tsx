import { A } from "@solidjs/router";
import { ThemeToggler } from "components/theme/toggler";
import { ParentProps } from "solid-js";
import { Logout } from "./logout";

export function Sidebar(props: ParentProps) {
  return (
    <aside class="flex flex-col fixed left-0 top-0 bottom-0 w-90 p-3 bg-gray-200 dark:bg-gray-800">
      <p class="font-bold text-xl">
        <A href="/student" class="inline-block px-3 py-1">
          成绩管理系统
        </A>
      </p>
      <hr class="my-3 border-gray-400 dark:border-gray-600" />
      <nav class="space-y-1 grow overscroll-auto">{props.children}</nav>
      <hr class="mb-3 border-gray-400 dark:border-gray-600" />
      <div class="space-y-1">
        <ThemeToggler />
        <Logout />
      </div>
    </aside>
  );
}
