import { Navigate } from "@solidjs/router";
import { Match, ParentProps, Switch } from "solid-js";
import { Role } from "utils/types";
import { useAuth } from "../provider";
import { Redirect } from "./redirect";

type Props = ParentProps<{
  role: Role;
}>;

export function RoleGuard(props: Props) {
  const [auth] = useAuth();

  return (
    <Switch fallback={props.children}>
      <Match when={auth.error}>
        <Navigate href="/login" />
      </Match>
      <Match when={auth()!.role !== props.role}>
        <Redirect />
      </Match>
    </Switch>
  );
}
