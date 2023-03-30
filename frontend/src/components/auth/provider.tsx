import {
  createContext,
  createResource,
  ParentProps,
  ResourceReturn,
  useContext,
} from "solid-js";
import { request } from "utils/request";
import { Account } from "utils/types";

const AuthContext = createContext<ResourceReturn<Account>>([
  () => ({}),
  {},
] as ResourceReturn<Account>);

export function AuthProvider(props: ParentProps) {
  const authResource = createResource(() => request.get<Account>("/auth"));

  return (
    <AuthContext.Provider value={authResource}>
      {props.children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
