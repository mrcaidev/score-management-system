import { ParentProps } from "solid-js";

export function PageTitle(props: ParentProps) {
  return (
    <h1 class="flex items-center gap-3 font-bold text-3xl">{props.children}</h1>
  );
}
