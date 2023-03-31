import { A } from "@solidjs/router";
import { ParentProps } from "solid-js";

type Props = ParentProps<{
  to: string;
}>;

export function NavLink(props: Props) {
  return (
    <A
      href={props.to}
      activeClass="bg-gray-300 dark:bg-gray-700"
      inactiveClass="hover:bg-gray-300 dark:hover:bg-gray-700"
      class="flex items-center gap-3 w-full px-4 py-3 rounded-md text-sm"
    >
      {props.children}
    </A>
  );
}
