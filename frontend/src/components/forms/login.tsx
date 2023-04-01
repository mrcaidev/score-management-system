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
      class="w-100 px-8 py-10 rounded-lg border-1 border-gray-900/5 dark:border-gray-100/5 bg-gray-200 dark:bg-gray-800 shadow-xl"
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
      <div class="mb-4">
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
      <div class="mb-6">
        <Checkbox
          id="should-rememeber"
          label="1天内记住我"
          name="shouldRememeber"
          checked={form.shouldRemember}
          disabled={form.isSubmitting}
          onChange={(e) => setForm({ shouldRemember: e.currentTarget.checked })}
        />
      </div>
      <SolidButton
        status={form.isSubmitting ? "disabled" : "normal"}
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
