import { FiX } from "solid-icons/fi";
import { ParentProps, Show, createEffect, onCleanup } from "solid-js";
import { Portal } from "solid-js/web";

type Props = ParentProps<{
  isOpen: boolean;
  onClose: () => void;
}>;

export function Modal(props: Props) {
  createEffect(() => {
    if (props.isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  });

  createEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        props.onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    onCleanup(() => document.removeEventListener("keydown", handleEscape));
  });

  return (
    <Show when={props.isOpen}>
      <Portal>
        <div
          role="presentation"
          onClick={() => props.onClose()}
          class="fixed left-0 right-0 top-0 bottom-0 bg-gray-900/75"
        />
        <div
          role="dialog"
          class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-3/5 max-w-3xl px-8 py-6 m-8 rounded-lg bg-gray-200 dark:bg-gray-800"
        >
          <button
            type="button"
            onClick={() => props.onClose()}
            class="absolute right-6 top-6 p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            <FiX size={24} />
            <span class="sr-only">关闭</span>
          </button>
          {props.children}
        </div>
      </Portal>
    </Show>
  );
}
