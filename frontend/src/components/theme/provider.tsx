import {
  ParentProps,
  createContext,
  createEffect,
  createSignal,
  onMount,
  useContext,
} from "solid-js";
import { getLocalStorage, setLocalStorage } from "utils/storage";

type State = {
  isDark: () => boolean;
  toggle: () => void;
};

const ThemeContext = createContext<State>({} as State);

export function ThemeProvider(props: ParentProps) {
  const [isDark, setIsDark] = createSignal(false);

  onMount(() => {
    const isDarkUser = getLocalStorage<boolean>("dark");
    const isDarkOs = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(isDarkUser || (isDarkUser === null && isDarkOs));
  });

  createEffect(() => {
    const root = document.documentElement;
    if (isDark()) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  });

  const toggle = () => {
    setIsDark((isDark) => !isDark);
    setLocalStorage("dark", isDark());
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggle }}>
      {props.children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
