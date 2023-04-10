import { useRouteData } from "@solidjs/router";
import { Button } from "components/form/button";
import { DatePicker } from "components/form/date-picker";
import { Input } from "components/form/input";
import { examsData } from "pages/exams.data";
import { FiCheck, FiX } from "solid-icons/fi";
import { createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import toast from "solid-toast";
import { handleRequestError, request } from "utils/request";
import { Exam } from "utils/types";

type Props = {
  exam: Exam;
  onClose: () => void;
};

export function UpdateForm(props: Props) {
  const [, { mutate }] = useRouteData<typeof examsData>();

  const [form, setForm] = createStore({
    name: "",
    heldAt: "",
  });

  const [isSubmitting, setIsSubmitting] = createSignal(false);

  onMount(() => {
    setForm({
      name: props.exam.name,
      heldAt: props.exam.heldAt,
    });
  });

  const mutateFn = (exams: Exam[]) =>
    exams.map((exam) => {
      if (exam.id === props.exam.id) {
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
      await request.patch("/exams/" + props.exam.id, { ...form });
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
      <Input
        id="name"
        label="名称"
        name="name"
        value={form.name}
        required
        disabled={isSubmitting()}
        onChange={(e) => setForm({ name: e.target.value })}
      />
      <DatePicker
        id="heldAt"
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
