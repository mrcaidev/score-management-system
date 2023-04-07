import { UnauthGuard } from "components/auth/guards";
import { LoginForm } from "components/form/login";

export default function Login() {
  return (
    <UnauthGuard>
      <main class="grid place-items-center fixed left-0 right-0 top-0 bottom-0">
        <LoginForm />
      </main>
    </UnauthGuard>
  );
}
