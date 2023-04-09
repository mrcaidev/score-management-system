import { useAuth } from "components/auth/provider";
import { Button } from "components/form/button";
import { Input } from "components/form/input";
import { PasswordInput } from "components/form/password";
import { FiLogIn } from "solid-icons/fi";
import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import toast from "solid-toast";
import { handleRequestError, request } from "utils/request";
import { setLocalStorage } from "utils/storage";

export function Form() {
  const [, { refetch }] = useAuth();

  const [form, setForm] = createStore({
    id: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = createSignal(false);

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const token = await request.post<string>("/auth/login", { ...form });

      setLocalStorage("token", token);

      const account = await refetch();

      if (!account) {
        return;
      }

      toast.success("欢迎回来，" + account.name);
    } catch (error) {
      handleRequestError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      class="space-y-4 w-100 px-8 py-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-200 dark:bg-gray-800 shadow-xl"
    >
      <h1 class="pb-4 font-bold text-3xl text-center">登录</h1>
      <Input
        id="id"
        label="学工号"
        name="id"
        value={form.id}
        required
        disabled={isSubmitting()}
        onChange={(e) => setForm({ id: e.target.value })}
      />
      <PasswordInput
        id="password"
        label="密码"
        name="password"
        value={form.password}
        required
        disabled={isSubmitting()}
        onChange={(e) => setForm({ password: e.target.value })}
      />
      <div class="pt-2">
        <Button
          type="submit"
          icon={FiLogIn}
          isLoading={isSubmitting()}
          class="justify-center w-full"
        >
          登录
        </Button>
      </div>
    </form>
  );
}
