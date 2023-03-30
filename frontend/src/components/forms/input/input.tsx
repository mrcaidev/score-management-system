import clsx from "clsx";
import { JSX, mergeProps, splitProps } from "solid-js";

type Props = JSX.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
};

export function Input(props: Props) {
  const fullProps = mergeProps({ type: "text" }, props);

  const [local, rest] = splitProps(fullProps, ["id", "label", "class"]);

  return (
    <div class="group space-y-2">
      <label
        for={local.id}
        class="block group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400"
      >
        {local.label}
      </label>
      <input
        {...rest}
        id={local.id}
        class={clsx(
          "min-w-0 w-full px-3 py-2 rounded border border-gray-400 dark:border-gray-600 outline-none focus:outline-indigo-600 dark:focus:outline-indigo-400 focus:-outline-offset-1 bg-transparent",
          local.class
        )}
      />
    </div>
  );
}
