import clsx from "clsx";
import { JSX, mergeProps, splitProps } from "solid-js";

type Props = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  status?: "normal" | "success" | "error" | "disabled";
  size?: "normal" | "small";
};

export function SolidButton(props: Props) {
  const fullProps = mergeProps(
    {
      status: "normal" as const,
      size: "normal" as const,
      type: "button" as const,
    },
    props
  );

  const [local, rest] = splitProps(fullProps, [
    "status",
    "size",
    "class",
    "children",
  ]);

  const bgColors = () => {
    switch (local.status) {
      case "normal":
        return "bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600";
      case "success":
        return "bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600";
      case "error":
        return "bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-600";
      case "disabled":
        return "bg-gray-600 dark:bg-gray-400";
      default:
        return "";
    }
  };

  const size = () => {
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
        "w-full rounded-md text-gray-100 transition-colors",
        bgColors(),
        size(),
        local.class
      )}
    >
      {local.children}
    </button>
  );
}
