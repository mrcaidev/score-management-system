import { A } from "@solidjs/router";
import { IconTypes } from "solid-icons";

type Props = {
  text: string;
  link: string;
  icon: IconTypes;
};

export function NavLink(props: Props) {
  return (
    <A
      href={props.link}
      activeClass="bg-gray-300 dark:bg-gray-700"
      inactiveClass="hover:bg-gray-300 dark:hover:bg-gray-700"
      class="flex items-center gap-3 w-full px-4 py-3 rounded-md text-sm"
    >
      <props.icon size={16} />
      {props.text}
    </A>
  );
}
