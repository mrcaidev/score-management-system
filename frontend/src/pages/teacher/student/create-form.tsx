import { useRouteData } from "@solidjs/router";
import { Button, Input } from "components/form";
import { studentsData } from "pages/students.data";
import { FiCheck, FiX } from "solid-icons/fi";
import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import toast from "solid-toast";
import { handleRequestError, request } from "utils/request";
import { Account } from "utils/types";

type Props = {
  onClose: () => void;
};

export function CreateForm(props: Props) {
  const [, { mutate }] = useRouteData<typeof studentsData>();

  const [form, setForm] = createStore({
    id: "",
    name: "",
  });

  const [isSubmitting, setIsSubmitting] = createSignal(false);

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const account = await request.post<Account>("/accounts", { ...form });
      mutate((accounts) => [...accounts, account]);
      props.onClose();
      toast.success("添加成功");
    } catch (error) {
      handleRequestError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} class="space-y-4 w-100">
      <p class="pb-2 font-bold text-2xl">添加学生</p>
      <Input
        label="学号"
        name="id"
        value={form.id}
        required
        disabled={isSubmitting()}
        onChange={(e) => setForm({ id: e.target.value })}
      />
      <Input
        label="姓名"
        name="name"
        value={form.name}
        required
        disabled={isSubmitting()}
        onChange={(e) => setForm({ name: e.target.value })}
      />
      <div class="flex justify-end items-center gap-3 pt-2">
        <Button variant="ghost" icon={FiX} onClick={props.onClose}>
          取消
        </Button>
        <Button type="submit" icon={FiCheck} isLoading={isSubmitting()}>
          确认
        </Button>
      </div>
    </form>
  );
}
