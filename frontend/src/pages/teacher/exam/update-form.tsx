import { useRouteData } from "@solidjs/router";
import { Button, DatePicker, Input } from "components/form";
import { examsData } from "pages/exams.data";
import { FiCheck, FiX } from "solid-icons/fi";
import { createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import toast from "solid-toast";
import { handleRequestError, request } from "utils/request";
import { Exam } from "utils/types";

type Props = {
  examId: string;
  onClose: () => void;
};

export function UpdateForm(props: Props) {
  const [exams, { mutate }] = useRouteData<typeof examsData>();

  const exam = () => exams().find((exam) => exam.id === props.examId)!;

  const [form, setForm] = createStore({
    name: "",
    heldAt: "",
  });

  const [isSubmitting, setIsSubmitting] = createSignal(false);

  onMount(() => {
    setForm({ name: exam().name, heldAt: exam().heldAt });
  });

  const mutateFn = (exams: Exam[]) =>
    exams.map((exam) => {
      if (exam.id === props.examId) {
        return {
          ...exam,
          name: form.name,
          heldAt: form.heldAt,
        };
      }
      return exam;
    });

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      await request.patch("/exams/" + props.examId, { ...form });
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
      <p class="pb-2 font-bold text-2xl">更新考试</p>
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
