import { FiX } from "solid-icons/fi";
import { ParentProps, Show, createEffect, onCleanup } from "solid-js";
import { Portal } from "solid-js/web";

type Props = ParentProps<{
  title: string;
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

  // TODO: Click outside to close modal.

  return (
    <Show when={props.isOpen}>
      <Portal>
        <div class="grid place-items-center fixed left-0 right-0 top-0 bottom-0 bg-gray-900/75">
          <div
            role="dialog"
            class="max-w-3xl px-8 py-6 m-8 rounded-lg bg-gray-200 dark:bg-gray-800"
          >
            <div class="flex justify-between items-center gap-8 mb-6">
              <p class="font-bold text-2xl">{props.title}</p>
              <button
                type="button"
                onClick={() => props.onClose()}
                class="p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>
            {props.children}
          </div>
        </div>
      </Portal>
    </Show>
  );
}
