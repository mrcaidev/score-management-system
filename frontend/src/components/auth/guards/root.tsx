import { Navigate } from "@solidjs/router";
import { PageLoading } from "components/loading";
import { Match, Switch } from "solid-js";
import { useAuth } from "../provider";
import { getRedirectPath } from "./utils";

export function RootGuard() {
  const [auth] = useAuth();

  return (
    <Switch fallback={<Navigate href={getRedirectPath(auth()!.role)} />}>
      <Match when={auth.loading}>
        <PageLoading />
      </Match>
      <Match when={auth.error}>
        <Navigate href="/login" />
      </Match>
    </Switch>
  );
}
