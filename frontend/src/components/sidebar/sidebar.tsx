import { A } from "@solidjs/router";
import { ThemeToggler } from "components/theme/toggler";
import { IconTypes } from "solid-icons";
import { For } from "solid-js";
import { Logout } from "./logout";

type Props = {
  nav: {
    text: string;
    link: string;
    icon: IconTypes;
  }[];
};

export function Sidebar(props: Props) {
  return (
    <aside class="flex flex-col fixed left-0 top-0 bottom-0 w-90 p-3 bg-gray-200 dark:bg-gray-800">
      <p class="font-bold text-xl">
        <A href="/student" class="inline-block px-3 py-1">
          成绩管理系统
        </A>
      </p>
      <hr class="my-3 border-gray-400 dark:border-gray-600" />
      <nav class="space-y-1 grow overscroll-auto">
        <For each={props.nav}>
          {({ text, link, icon: Icon }) => (
            <A
              href={link}
              activeClass="bg-gray-300 dark:bg-gray-700"
              inactiveClass="hover:bg-gray-300 dark:hover:bg-gray-700"
              class="flex items-center gap-3 w-full px-4 py-3 rounded-md text-sm"
            >
              <Icon size={16} />
              {text}
            </A>
          )}
        </For>
      </nav>
      <hr class="mb-3 border-gray-400 dark:border-gray-600" />
      <div class="space-y-1">
        <ThemeToggler />
        <Logout />
      </div>
    </aside>
  );
}
