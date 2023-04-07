import { Navigate } from "@solidjs/router";
import { Match, ParentProps, Switch } from "solid-js";
import { useAuth } from "../provider";
import { getRedirectPath } from "./utils";

export function UnauthGuard(props: ParentProps) {
  const [auth] = useAuth();

  return (
    <Switch>
      <Match when={auth.error}>{props.children}</Match>
      <Match when={auth()}>
        <Navigate href={getRedirectPath(auth()!.role)} />
      </Match>
    </Switch>
  );
}
