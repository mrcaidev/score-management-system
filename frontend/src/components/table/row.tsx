import { ParentProps } from "solid-js";

export function TableRow(props: ParentProps) {
  return (
    <tr class="even:bg-gray-200 dark:even:bg-gray-800 hover:bg-indigo-100 dark:hover:bg-indigo-900">
      {props.children}
    </tr>
  );
}
