import clsx from "clsx";
import { IconTypes } from "solid-icons";
import { FiLoader } from "solid-icons/fi";
import { JSX, Show, mergeProps, splitProps } from "solid-js";

type Props = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "success" | "danger" | "ghost";
  size?: "normal" | "small";
  icon?: IconTypes;
  isLoading?: boolean;
};

export function Button(props: Props) {
  const mergedProps = mergeProps(
    {
      variant: "primary" as const,
      size: "normal" as const,
      isLoading: false,
      type: "button" as const,
    },
    props
  );

  const [local, rest] = splitProps(mergedProps, [
    "variant",
    "size",
    "icon",
    "isLoading",
    "disabled",
    "class",
    "children",
  ]);

  const buttonColor = () => {
    switch (local.variant) {
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

  const buttonSize = () => {
    switch (local.size) {
      case "normal":
        return "gap-2 px-4 py-3 rounded-md font-bold";
      case "small":
        return "gap-1 px-2 py-1 rounded text-sm";
    }
  };

  const iconSize = () => {
    switch (local.size) {
      case "normal":
        return 16;
      case "small":
        return 14;
    }
  };

  return (
    <button
      {...rest}
      disabled={local.isLoading || local.disabled || false}
      class={clsx(
        "flex items-center disabled:bg-gray-600 dark:disabled:bg-gray-500 disabled:hover:bg-gray-600 dark:disabled:hover:bg-gray-500 transition-colors",
        buttonColor(),
        buttonSize(),
        local.class
      )}
    >
      {local.icon && (
        <Show
          when={local.isLoading}
          fallback={<local.icon size={iconSize()} />}
        >
          <FiLoader size={iconSize()} class="animate-spin" />
        </Show>
      )}
      {local.children}
    </button>
  );
}
