import { useAuth } from "components/auth/provider";
import { Button } from "components/form/button";
import { Input } from "components/form/input";
import { PasswordInput } from "components/form/password";
import { FiLoader, FiLogIn } from "solid-icons/fi";
import { Show } from "solid-js";
import { createStore } from "solid-js/store";
import toast from "solid-toast";
import { handleRequestError, request } from "utils/request";
import { setLocalStorage } from "utils/storage";

export function LoginForm() {
  const [, { refetch }] = useAuth();

  const [form, setForm] = createStore({
    id: "",
    password: "",
    isSubmitting: false,
  });

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    setForm({ isSubmitting: true });

    try {
      const token = await request.post<string>("/auth/login", {
        id: form.id,
        password: form.password,
      });

      setLocalStorage("token", token);

      const account = await refetch();

      if (!account) {
        return;
      }

      toast.success("欢迎回来，" + account.name);
    } catch (error) {
      handleRequestError(error);
    } finally {
      setForm({ isSubmitting: false });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      class="w-100 px-8 py-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-200 dark:bg-gray-800 shadow-xl"
    >
      <h1 class="mb-8 font-bold text-3xl text-center">登录</h1>
      <div class="mb-4">
        <Input
          id="id"
          label="学工号"
          name="id"
          value={form.id}
          required
          disabled={form.isSubmitting}
          onChange={(e) => setForm({ id: e.currentTarget.value })}
        />
      </div>
      <div class="mb-6">
        <PasswordInput
          id="password"
          label="密码"
          name="password"
          value={form.password}
          required
          disabled={form.isSubmitting}
          onChange={(e) => setForm({ password: e.currentTarget.value })}
        />
      </div>
      <Button
        type="submit"
        disabled={form.isSubmitting}
        class="justify-center w-full"
      >
        <Show when={form.isSubmitting} fallback={<FiLogIn />}>
          <FiLoader class="animate-spin" />
        </Show>
        登录
      </Button>
    </form>
  );
}
