import { ParentProps, Show } from "solid-js";
import { useAuth } from "../provider";
import { Redirect } from "./redirect";

export function UnauthGuard(props: ParentProps) {
  const [auth] = useAuth();

  return (
    <Show when={auth.error} fallback={<Redirect />}>
      {props.children}
    </Show>
  );
}
