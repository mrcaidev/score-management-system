import { FiLoader } from "solid-icons/fi";
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
        <div class="grid place-items-center fixed left-0 right-0 top-0 bottom-0">
          <FiLoader size={36} class="animate-spin" />
        </div>
      </Show>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
