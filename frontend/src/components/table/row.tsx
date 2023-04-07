import { For } from "solid-js";

type Props = {
  values: unknown[];
};

export function TableRow(props: Props) {
  return (
    <tr class="hover:bg-gray-200 dark:hover:bg-gray-800">
      <For each={props.values}>
        {(value) => (
          <td class="py-2 border border-gray-400 dark:border-gray-600">
            {String(value)}
          </td>
        )}
      </For>
    </tr>
  );
}
