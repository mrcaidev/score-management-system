import { FiMoon, FiSun } from "solid-icons/fi";
import { Show } from "solid-js";
import { useTheme } from "./provider";

export function ThemeToggler() {
  const { isDark, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      class="flex items-center gap-3 w-full px-4 py-3 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700 text-sm"
    >
      <Show
        when={isDark()}
        fallback={
          <>
            <FiMoon size={16} />
            切换暗黑主题
          </>
        }
      >
        <FiSun size={16} />
        切换明亮主题
      </Show>
    </button>
  );
}
