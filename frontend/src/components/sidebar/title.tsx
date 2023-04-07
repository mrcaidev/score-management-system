import { A } from "@solidjs/router";
import { getRedirectPath } from "components/auth/guards";
import { useAuth } from "components/auth/provider";

export function Title() {
  const [auth] = useAuth();

  return (
    <p class="font-bold text-lg">
      <A
        href={getRedirectPath(auth()!.role)}
        class="flex items-center gap-3 px-3 py-1"
      >
        <img
          src="/favicon.svg"
          alt="Logo"
          width="24"
          height="24"
          class="w-6 h-6"
        />
        成绩管理系统
      </A>
    </p>
  );
}
