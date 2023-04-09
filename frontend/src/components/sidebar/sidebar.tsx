import { ThemeToggler } from "components/theme/toggler";
import { IconTypes } from "solid-icons";
import { For } from "solid-js";
import { Logo } from "./logo";
import { Logout } from "./logout";
import { NavLink } from "./nav-link";

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
      <Logo />
      <hr class="my-3 border-gray-300 dark:border-gray-700" />
      <nav class="space-y-1 grow overscroll-auto">
        <For each={props.nav}>{(item) => <NavLink {...item} />}</For>
      </nav>
      <hr class="mb-3 border-gray-300 dark:border-gray-700" />
      <div class="space-y-1">
        <ThemeToggler />
        <Logout />
      </div>
    </aside>
  );
}
