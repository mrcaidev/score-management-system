import clsx from "clsx";
import { JSX, mergeProps, splitProps } from "solid-js";

type Props = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: "primary" | "success" | "danger";
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

  const buttonBackground = () => {
    switch (local.color) {
      case "primary":
        return "bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600";
      case "success":
        return "bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600";
      case "danger":
        return "bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-600";
    }
  };

  const buttonSize = () => {
    switch (local.size) {
      case "normal":
        return "px-4 py-3 font-bold";
      case "small":
        return "px-2 py-1 text-sm";
    }
  };

  return (
    <button
      {...rest}
      class={clsx(
        "flex items-center gap-2 w-full rounded-md disabled:bg-gray-600 disabled:hover:bg-gray-600 dark:disabled:bg-gray-400 dark:disabled:hover:bg-gray-400 text-gray-100 transition-colors",
        buttonBackground(),
        buttonSize(),
        local.class
      )}
    >
      {local.children}
    </button>
  );
}
