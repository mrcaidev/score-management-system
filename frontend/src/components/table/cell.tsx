import { ParentProps } from "solid-js";

export function TableCell(props: ParentProps) {
  return (
    <td class="py-2 border border-gray-400 dark:border-gray-600">
      {props.children}
    </td>
  );
}
