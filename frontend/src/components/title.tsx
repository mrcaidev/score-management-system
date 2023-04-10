import { IconTypes } from "solid-icons";
import { ParentProps } from "solid-js";

type Props = ParentProps<{
  icon?: IconTypes;
}>;

export function Title(props: Props) {
  return (
    <h1 class="flex items-center gap-3 font-bold text-3xl">
      {props.icon && <props.icon />}
      {props.children}
    </h1>
  );
}
