import { LoginGuard } from "components/auth/guards";
import { LoginForm } from "components/forms/login";

export default function Login() {
  return (
    <LoginGuard>
      <main class="grid place-items-center fixed left-0 right-0 top-0 bottom-0">
        <LoginForm />
      </main>
    </LoginGuard>
  );
}
