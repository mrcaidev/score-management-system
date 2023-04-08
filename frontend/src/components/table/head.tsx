import { For } from "solid-js";

type Props = {
  names: string[];
};

export function TableHead(props: Props) {
  return (
    <thead class="bg-gray-300 dark:bg-gray-700">
      <tr>
        <For each={props.names}>
          {(name) => (
            <th class="py-3 border border-gray-400 dark:border-gray-600">
              {name}
            </th>
          )}
        </For>
      </tr>
    </thead>
  );
}
