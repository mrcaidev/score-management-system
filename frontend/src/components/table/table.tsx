import { For, ParentProps } from "solid-js";

type Props = ParentProps<{
  head: string[];
  columnWidths: number[];
}>;

export function Table(props: Props) {
  const percentages = () => {
    const totalWidth = props.columnWidths.reduce((a, b) => a + b, 0);
    return props.columnWidths.map((width) => (width / totalWidth) * 100 + "%");
  };

  return (
    <table class="max-w-5xl w-full border border-gray-400 dark:border-gray-600 text-center">
      <colgroup>
        <For each={percentages()}>{(width) => <col width={width} />}</For>
      </colgroup>
      <thead class="border border-gray-400 dark:border-gray-600 bg-gray-300 dark:bg-gray-700">
        <tr>
          <For each={props.head}>{(name) => <th class="py-3">{name}</th>}</For>
        </tr>
      </thead>
      <tbody>{props.children}</tbody>
    </table>
  );
}
