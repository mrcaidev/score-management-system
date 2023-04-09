import { IconProps } from "solid-icons";
import { FiLoader } from "solid-icons/fi";

export function Loading(props: IconProps) {
  return <FiLoader {...props} class="animate-spin" />;
}
