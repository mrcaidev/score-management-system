import { Loading } from "components/loading";
import {
  createContext,
  createResource,
  ParentProps,
  ResourceReturn,
  Show,
  useContext,
} from "solid-js";
import { request } from "utils/request";
import { Account } from "utils/types";

type State = ResourceReturn<Account>;

const AuthContext = createContext<State>([() => 0, {}] as State);

export function AuthProvider(props: ParentProps) {
  const authResource = createResource(() => request.get<Account>("/auth"));

  return (
    <AuthContext.Provider value={authResource}>
      <Show when={authResource[0].loading} fallback={props.children}>
        <Loading />
      </Show>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
