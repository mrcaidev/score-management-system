import clsx from "clsx";
import { FiEye, FiEyeOff } from "solid-icons/fi";
import { createSignal, Show, splitProps } from "solid-js";
import { InputProps } from "./types";

export function PasswordInput(props: InputProps) {
  const [local, rest] = splitProps(props, ["id", "label", "class"]);

  const [isVisible, setIsVisible] = createSignal(false);
  const inputType = () => (isVisible() ? "text" : "password");

  return (
    <div class="group/field space-y-2">
      <label
        for={local.id}
        class="block group-focus-within/field:text-indigo-600 dark:group-focus-within/field:text-indigo-400"
      >
        {local.label}
      </label>
      <div class="group/input relative">
        <input
          {...rest}
          type={inputType()}
          id={local.id}
          class={clsx(
            "min-w-0 w-full px-3 py-2 rounded border border-gray-400 dark:border-gray-600 outline-none group-focus-within/input:outline-indigo-600 dark:group-focus-within/input:outline-indigo-400 group-focus-within/input:-outline-offset-1 bg-transparent",
            local.class
          )}
        />
        <button
          type="button"
          onClick={() => setIsVisible((isVisible) => !isVisible)}
          class="hidden group-hover/input:block absolute right-3 top-1/2 -translate-y-1/2 p-1"
        >
          <Show
            when={isVisible()}
            fallback={
              <>
                <FiEye />
                <span class="sr-only">显示密码</span>
              </>
            }
          >
            <FiEyeOff />
            <span class="sr-only">隐藏密码</span>
          </Show>
        </button>
      </div>
    </div>
  );
}
