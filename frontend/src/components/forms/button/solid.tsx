import clsx from "clsx";
import { mergeProps, splitProps } from "solid-js";
import { ButtonProps } from "./types";

export function SolidButton(props: ButtonProps) {
  const fullProps = mergeProps(
    {
      variant: "primary" as const,
      type: "button" as const,
    },
    props
  );

  const [local, rest] = splitProps(fullProps, ["variant", "class", "children"]);

  const bgColors = () => {
    switch (local.variant) {
      case "primary":
        return "bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600";
      case "success":
        return "bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600";
      case "error":
        return "bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-600";
      case "disabled":
        return "bg-gray-600 dark:bg-gray-500";
      default:
        return "";
    }
  };

  return (
    <button
      {...rest}
      class={clsx(
        "w-full px-4 py-3 rounded-md font-bold text-gray-100 transition-colors",
        bgColors(),
        local.class
      )}
    >
      {local.children}
    </button>
  );
}
