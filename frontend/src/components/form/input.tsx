import clsx from "clsx";
import { JSX, splitProps } from "solid-js";

type Props = JSX.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
};

export function Input(props: Props) {
  const [local, rest] = splitProps(props, ["label", "class"]);

  return (
    <div class="space-y-2">
      <label for={rest.id}>{local.label}</label>
      <input
        {...rest}
        class={clsx(
          "block min-w-0 w-full px-3 py-2 rounded border border-gray-400 dark:border-gray-600 outline-none focus:outline-indigo-600 dark:focus:outline-indigo-400 focus:-outline-offset-1 bg-transparent disabled:text-gray-600 dark:disabled:text-gray-400",
          local.class
        )}
      />
    </div>
  );
}
