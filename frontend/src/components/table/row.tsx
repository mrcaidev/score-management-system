import { ParentProps } from "solid-js";

export function TableRow(props: ParentProps) {
  return (
    <tr class="hover:bg-gray-200 dark:hover:bg-gray-800">{props.children}</tr>
  );
}
