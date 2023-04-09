import { Navigate } from "@solidjs/router";
import { Match, Switch } from "solid-js";
import { Role } from "utils/types";
import { useAuth } from "../provider";

export function Redirect() {
  const [auth] = useAuth();

  return (
    <Switch fallback={<Navigate href="/" />}>
      <Match when={auth()!.role === Role.STUDENT}>
        <Navigate href="/student" />
      </Match>
      <Match when={auth()!.role === Role.TEACHER}>
        <Navigate href="/teacher" />
      </Match>
    </Switch>
  );
}
