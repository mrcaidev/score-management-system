import { Navigate } from "@solidjs/router";
import { Show } from "solid-js";
import { useAuth } from "../provider";
import { Redirect } from "./redirect";

export function RootGuard() {
  const [auth] = useAuth();

  return (
    <Show when={auth.error} fallback={<Redirect />}>
      <Navigate href="/login" />
    </Show>
  );
}
