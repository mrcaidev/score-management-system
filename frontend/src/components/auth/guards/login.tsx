import { Navigate } from "@solidjs/router";
import { PageLoading } from "components/loading";
import { Match, ParentProps, Switch } from "solid-js";
import { useAuth } from "../provider";
import { getRedirectPath } from "./utils";

export function LoginGuard(props: ParentProps) {
  const [auth] = useAuth();

  return (
    <Switch fallback={<Navigate href={getRedirectPath(auth()!.role)} />}>
      <Match when={auth.loading}>
        <PageLoading />
      </Match>
      <Match when={auth.error}>{props.children}</Match>
    </Switch>
  );
}