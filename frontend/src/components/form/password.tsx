import clsx from "clsx";
import { FiEye, FiEyeOff } from "solid-icons/fi";
import { JSX, Show, createSignal, createUniqueId, splitProps } from "solid-js";

type Props = JSX.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function PasswordInput(props: Props) {
  const [local, rest] = splitProps(props, ["label", "class"]);

  const id = createUniqueId();

  const [isVisible, setIsVisible] = createSignal(false);

  return (
    <div class="space-y-2">
      <label for={id}>{local.label}</label>
      <div class="group relative">
        <input
          {...rest}
          type={isVisible() ? "text" : "password"}
          id={id}
          class={clsx(
            "peer block min-w-0 w-full px-3 py-2 rounded border border-gray-400 dark:border-gray-600 outline-none group-focus-within:outline-indigo-600 dark:group-focus-within:outline-indigo-400 group-focus-within:-outline-offset-1 bg-transparent disabled:text-gray-600 dark:disabled:text-gray-400",
            local.class
          )}
        />
        <button
          type="button"
          onClick={() => setIsVisible((isVisible) => !isVisible)}
          class="hidden group-hover:block peer-disabled:hidden absolute right-3 top-1/2 -translate-y-1/2 p-1"
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
