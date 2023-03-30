import { useAuth } from "components/auth/provider";
import { FiLoader, FiLogIn } from "solid-icons/fi";
import { Show } from "solid-js";
import { createStore } from "solid-js/store";
import toast from "solid-toast";
import { request } from "utils/request";
import { setLocalStorage } from "utils/storage";
import { SolidButton } from "./button";
import { Checkbox, Input, PasswordInput } from "./input";

export function LoginForm() {
  const [, { refetch }] = useAuth();

  const [form, setForm] = createStore({
    id: "",
    password: "",
    shouldRemember: true,
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

      if (form.shouldRemember) {
        setLocalStorage("token", token);
      }

      toast.success("登录成功");

      await refetch();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        return;
      }

      toast.error("未知错误，请稍后再试");
    } finally {
      setForm({ isSubmitting: false });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      class="w-100 px-8 py-10 rounded-lg bg-gray-200 dark:bg-gray-800 shadow-lg"
    >
      <h1 class="mb-8 font-bold text-3xl text-center">登录</h1>
      <div class="mb-4">
        <Input
          id="id"
          label="学工号"
          required
          disabled={form.isSubmitting}
          value={form.id}
          onChange={(e) => setForm({ id: e.currentTarget.value })}
        />
      </div>
      <div class="mb-4">
        <PasswordInput
          id="password"
          label="密码"
          required
          disabled={form.isSubmitting}
          value={form.password}
          onChange={(e) => setForm({ password: e.currentTarget.value })}
        />
      </div>
      <div class="mb-6">
        <Checkbox
          id="should-rememeber"
          label="1天内记住我"
          disabled={form.isSubmitting}
          checked={form.shouldRemember}
          onChange={(e) => setForm({ shouldRemember: e.currentTarget.checked })}
        />
      </div>
      <SolidButton
        variant={form.isSubmitting ? "disabled" : "primary"}
        type="submit"
        disabled={form.isSubmitting}
        class="flex justify-center items-center gap-1"
      >
        登录
        <Show when={form.isSubmitting} fallback={<FiLogIn />}>
          <FiLoader class="animate-spin" />
        </Show>
      </SolidButton>
    </form>
  );
}
