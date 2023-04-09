import clsx from "clsx";
import { JSX, splitProps } from "solid-js";

type Props = JSX.OptionHTMLAttributes<HTMLOptionElement>;

export function Option(props: Props) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <option
      {...rest}
      class={clsx("bg-gray-200 dark:bg-gray-800", local.class)}
    />
  );
}
