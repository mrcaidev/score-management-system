import clsx from "clsx";
import { JSX, mergeProps, splitProps } from "solid-js";

type Props = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: "primary" | "success" | "danger" | "ghost";
  size?: "normal" | "small";
};

export function Button(props: Props) {
  const mergedProps = mergeProps(
    {
      type: "button" as const,
      color: "primary" as const,
      size: "normal" as const,
    },
    props
  );

  const [local, rest] = splitProps(mergedProps, [
    "color",
    "size",
    "class",
    "children",
  ]);

  const colors = () => {
    switch (local.color) {
      case "primary":
        return "bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-gray-100";
      case "success":
        return "bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-gray-100";
      case "danger":
        return "bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-600 text-gray-100";
      case "ghost":
        return "bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600";
    }
  };

  const sizes = () => {
    switch (local.size) {
      case "normal":
        return "gap-2 px-4 py-3 rounded-md font-bold";
      case "small":
        return "gap-1 px-2 py-1 rounded text-sm";
    }
  };

  return (
    <button
      {...rest}
      class={clsx(
        "flex items-center disabled:bg-gray-600 dark:disabled:bg-gray-500 disabled:hover:bg-gray-600 dark:disabled:hover:bg-gray-500 transition-colors",
        colors(),
        sizes(),
        local.class
      )}
    >
      {local.children}
    </button>
  );
}
