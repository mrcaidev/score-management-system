import { UnauthGuard } from "components/auth/guards";
import { Form } from "./form";

export function Page() {
  return (
    <UnauthGuard>
      <main class="grid place-items-center fixed left-0 right-0 top-0 bottom-0">
        <Form />
      </main>
    </UnauthGuard>
  );
}
