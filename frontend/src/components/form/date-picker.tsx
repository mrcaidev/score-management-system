import clsx from "clsx";
import { JSX, splitProps } from "solid-js";

type Props = JSX.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  value?: string;
};

export function DatePicker(props: Props) {
  const [local, rest] = splitProps(props, ["label", "value", "class"]);

  const value = () => (local.value ? formatDate(new Date(local.value)) : "");

  return (
    <div class="space-y-2">
      <label for={rest.id}>{local.label}</label>
      <input
        {...rest}
        type="date"
        value={value()}
        class={clsx(
          "block min-w-0 w-full px-3 py-2 rounded border border-gray-400 dark:border-gray-600 outline-none focus:outline-indigo-600 dark:focus:outline-indigo-400 focus:-outline-offset-1 bg-transparent disabled:text-gray-600 dark:disabled:text-gray-400 dark:[color-scheme:dark]",
          local.class
        )}
      />
    </div>
  );
}

function formatDate(date: Date) {
  return Intl.DateTimeFormat("zh", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(date)
    .replaceAll("/", "-");
}
