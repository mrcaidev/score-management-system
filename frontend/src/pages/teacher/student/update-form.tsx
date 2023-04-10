import { useRouteData } from "@solidjs/router";
import { Button, Input } from "components/form";
import { studentsData } from "pages/students.data";
import { FiCheck, FiX } from "solid-icons/fi";
import { createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import toast from "solid-toast";
import { handleRequestError, request } from "utils/request";
import { Account } from "utils/types";

type Props = {
  student: Account;
  onClose: () => void;
};

export function UpdateForm(props: Props) {
  const [, { mutate }] = useRouteData<typeof studentsData>();

  const [form, setForm] = createStore({
    name: "",
  });

  const [isSubmitting, setIsSubmitting] = createSignal(false);

  onMount(() => {
    setForm({
      name: props.student.name,
    });
  });

  const mutateFn = (students: Account[]) =>
    students.map((student) => {
      if (student.id === props.student.id) {
        return {
          ...student,
          name: form.name,
        };
      }
      return student;
    });

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      await request.patch("/accounts/" + props.student.id, { ...form });
      mutate(mutateFn);
      props.onClose();
      toast.success("更新成功");
    } catch (error) {
      handleRequestError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} class="space-y-4 w-100">
      <p class="pb-2 font-bold text-2xl">更新学生</p>
      <Input label="学号" name="id" value={props.student.id} disabled />
      <Input
        label="名称"
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
