import { Button, Checkbox, Input, Option, Select } from "components/form";
import { FiCheck, FiX } from "solid-icons/fi";
import { Setter, createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import toast from "solid-toast";
import { handleRequestError, request } from "utils/request";
import { FullScore } from "utils/types";

type Props = {
  score: FullScore;
  onClose: () => void;
  mutate: Setter<FullScore[]>;
};

export function UpdateForm(props: Props) {
  const [form, setForm] = createStore({
    isAbsent: false,
    score: 0,
  });

  const [isSubmitting, setIsSubmitting] = createSignal(false);

  onMount(() => {
    setForm({
      isAbsent: props.score.isAbsent,
      score: props.score.score,
    });
  });

  const mutateFn = (scores: FullScore[]) =>
    scores.map((score) => {
      if (score.id === props.score.id) {
        return {
          ...score,
          isAbsent: form.isAbsent,
          score: form.score,
        };
      }

      return score;
    });

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      await request.patch("/scores/" + props.score.id, { ...form });
      props.mutate(mutateFn);
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
      <p class="pb-2 font-bold text-2xl">更新成绩</p>
      <Select label="考试" name="exam" value={props.score.exam.id} disabled>
        <Option value={props.score.exam.id}>{props.score.exam.name}</Option>
      </Select>
      <Select label="课程" name="course" value={props.score.course.id} disabled>
        <Option value={props.score.course.id}>{props.score.course.name}</Option>
      </Select>
      <Input
        label="学生"
        name="student"
        value={props.score.student.name}
        disabled
      />
      <Input
        label="成绩"
        type="number"
        name="score"
        value={form.isAbsent ? 0 : form.score}
        placeholder={"0-" + props.score.course.maxScore}
        required
        min={0}
        max={props.score.course.maxScore}
        disabled={isSubmitting() || form.isAbsent}
        onChange={(e) => setForm({ score: +e.target.value })}
      />
      <Checkbox
        label="是否缺席"
        name="isAbsent"
        checked={form.isAbsent}
        disabled={isSubmitting()}
        onChange={(e) => setForm({ isAbsent: e.target.checked })}
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
