import clsx from "clsx";
import { JSX, splitProps } from "solid-js";

type Props = JSX.SelectHTMLAttributes<HTMLSelectElement> & {
  id: string;
  label: string;
};

export function Select(props: Props) {
  const [local, rest] = splitProps(props, ["id", "label", "class", "children"]);

  return (
    <div class="group space-y-2">
      <label
        for={local.id}
        class="block group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400"
      >
        {local.label}
      </label>
      <select
        {...rest}
        id={local.id}
        class={clsx(
          "w-full px-3 py-2 rounded border border-gray-400 dark:border-gray-600 outline-none focus:outline-indigo-600 dark:focus:outline-indigo-400 focus:-outline-offset-1 bg-transparent",
          local.class
        )}
      >
        {local.children}
      </select>
    </div>
  );
}
