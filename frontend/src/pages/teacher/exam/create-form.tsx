import { useRouteData } from "@solidjs/router";
import { Button, DatePicker, Input } from "components/form";
import { examsData } from "pages/exams.data";
import { FiCheck, FiX } from "solid-icons/fi";
import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import toast from "solid-toast";
import { handleRequestError, request } from "utils/request";
import { Exam } from "utils/types";

type Props = {
  onClose: () => void;
};

export function CreateForm(props: Props) {
  const [, { mutate }] = useRouteData<typeof examsData>();

  const [form, setForm] = createStore({
    name: "",
    heldAt: "",
  });

  const [isSubmitting, setIsSubmitting] = createSignal(false);

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const exam = await request.post<Exam>("/exams", { ...form });
      mutate((exams) => [...exams, exam]);
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
      <p class="pb-2 font-bold text-2xl">添加考试</p>
      <Input
        label="名称"
        name="name"
        value={form.name}
        required
        disabled={isSubmitting()}
        onChange={(e) => setForm({ name: e.target.value })}
      />
      <DatePicker
        label="日期"
        name="heldAt"
        value={form.heldAt}
        required
        disabled={isSubmitting()}
        onChange={(e) =>
          setForm({ heldAt: new Date(e.target.value).toISOString() })
        }
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
