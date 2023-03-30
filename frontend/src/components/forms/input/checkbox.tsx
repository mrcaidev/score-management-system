import clsx from "clsx";
import { FiCheck } from "solid-icons/fi";
import { splitProps } from "solid-js";
import { InputProps } from "./types";

export function Checkbox(props: InputProps) {
  const [local, rest] = splitProps(props, ["id", "label", "class"]);

  return (
    <div class="flex items-center gap-1.5 relative">
      <input
        {...rest}
        type="checkbox"
        id={local.id}
        class={clsx(
          "peer appearance-none w-4 h-4 rounded border border-gray-400 dark:border-gray-600 outline-none focus:outline-indigo-600 dark:focus:outline-indigo-400 focus:-outline-offset-1 bg-transparent",
          local.class
        )}
      />
      <FiCheck class="hidden peer-checked:inline absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none" />
      <label for={local.id} class="text-sm select-none">
        {local.label}
      </label>
    </div>
  );
}
