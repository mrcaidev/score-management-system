import { Navigate } from "@solidjs/router";
import { Match, Switch } from "solid-js";
import { useAuth } from "../provider";
import { getRedirectPath } from "./utils";

export function RootGuard() {
  const [auth] = useAuth();

  return (
    <Switch>
      <Match when={auth.error}>
        <Navigate href="/login" />
      </Match>
      <Match when={auth()}>
        <Navigate href={getRedirectPath(auth()!.role)} />
      </Match>
    </Switch>
  );
}
