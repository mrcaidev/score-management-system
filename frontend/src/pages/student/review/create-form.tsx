import { useRouteData } from "@solidjs/router";
import { Button, Option, Select } from "components/form";
import { reviewsData } from "pages/reviews.data";
import { FiCheck, FiX } from "solid-icons/fi";
import { For, createResource, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import toast from "solid-toast";
import { handleRequestError, request } from "utils/request";
import { Course, Exam, Score } from "utils/types";

type Props = {
  onClose: () => void;
};

export function CreateForm(props: Props) {
  const [, { mutate }] = useRouteData<typeof reviewsData>();

  const [form, setForm] = createStore({
    examId: "",
    courseId: 0,
  });

  const [isSubmitting, setIsSubmitting] = createSignal(false);

  const [exams] = createResource(() => request.get<Exam[]>("/exams"), {
    initialValue: [],
  });

  const [courses] = createResource(() => request.get<Course[]>("/courses"), {
    initialValue: [],
  });

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const score = await request.post<Score>("/reviews", { ...form });
      mutate((scores) => [...scores, score]);
      props.onClose();
      toast.success("申请成功，请等待班主任处理");
    } catch (error) {
      handleRequestError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} class="space-y-4 w-100">
      <p class="pb-2 font-bold text-2xl">添加考试</p>
      <Select
        label="考试"
        name="exam"
        value={form.examId}
        placeholder="请选择考试"
        required
        disabled={isSubmitting()}
        onChange={(e) => setForm({ examId: e.target.value })}
      >
        <For each={exams()}>
          {({ id, name }) => <Option value={id}>{name}</Option>}
        </For>
      </Select>
      <Select
        label="课程"
        name="course"
        value={form.courseId}
        placeholder="请选择课程"
        required
        disabled={isSubmitting()}
        onChange={(e) => setForm({ courseId: +e.target.value })}
      >
        <For each={courses()}>
          {({ id, name }) => <Option value={id}>{name}</Option>}
        </For>
      </Select>
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
