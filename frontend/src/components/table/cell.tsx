import { ParentProps } from "solid-js";

export function TableCell(props: ParentProps) {
  return (
    <td class="py-2">
      <div class="flex justify-center items-center gap-3">{props.children}</div>
    </td>
  );
}
