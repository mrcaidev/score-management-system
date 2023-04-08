import { Button } from "components/form/button";
import { Checkbox } from "components/form/checkbox";
import { Input } from "components/form/input";
import { FiCheck, FiLoader, FiX } from "solid-icons/fi";
import { Setter, Show, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import toast from "solid-toast";
import { handleRequestError, request } from "utils/request";
import { FullScore } from "utils/types";

type Props = {
  score: FullScore;
  mutate: Setter<FullScore[]>;
  onClose: () => void;
};

export function UpdateForm(props: Props) {
  const [form, setForm] = createStore({
    isAbsent: false,
    score: 0,
    isSubmitting: false,
  });

  onMount(() => {
    setForm({
      isAbsent: props.score.isAbsent,
      score: props.score.score,
    });
  });

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    setForm({ isSubmitting: true });

    try {
      await request.patch("/scores/" + props.score.id, {
        isAbsent: form.isAbsent,
        score: form.score,
      });
      props.mutate((scores) =>
        scores.map((score) =>
          score.id === props.score.id
            ? {
                ...score,
                isAbsent: form.isAbsent,
                score: form.score,
              }
            : score
        )
      );
      props.onClose();
      toast.success("更新成功");
    } catch (error) {
      handleRequestError(error);
    } finally {
      setForm({ isSubmitting: false });
    }
  };

  return (
    <form onSubmit={handleSubmit} class="space-y-4 w-100">
      <Input
        id="exam"
        label="考试"
        name="exam"
        value={props.score.exam.name}
        disabled
      />
      <Input
        id="course"
        label="课程"
        name="course"
        value={props.score.course.name}
        disabled
      />
      <Input
        id="student"
        label="学生"
        name="student"
        value={props.score.student.name}
        disabled
      />
      <Input
        id="score"
        label="成绩"
        type="number"
        name="score"
        value={form.score}
        placeholder={"0-" + props.score.course.maxScore}
        required
        disabled={form.isSubmitting}
        onChange={(e) => setForm({ score: +e.currentTarget.value })}
      />
      <Checkbox
        id="isAbsent"
        label="是否缺席"
        name="isAbsent"
        checked={form.isAbsent}
        disabled={form.isSubmitting}
        onChange={(e) => setForm({ isAbsent: e.currentTarget.checked })}
      />
      <div class="flex justify-end items-center gap-2 mt-2">
        <Button variant="ghost" onClick={props.onClose}>
          <FiX />
          取消
        </Button>
        <Button type="submit" disabled={form.isSubmitting}>
          <Show when={form.isSubmitting} fallback={<FiCheck />}>
            <FiLoader class="animate-spin" />
          </Show>
          确认
        </Button>
      </div>
    </form>
  );
}
