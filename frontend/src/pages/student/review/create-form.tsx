import { Button } from "components/form/button";
import { Option } from "components/form/option";
import { Select } from "components/form/select";
import { FiCheck, FiX } from "solid-icons/fi";
import { For, Setter, createResource } from "solid-js";
import { createStore } from "solid-js/store";
import toast from "solid-toast";
import { handleRequestError, request } from "utils/request";
import { Course, Exam, FullScore } from "utils/types";

type Props = {
  onClose: () => void;
  mutate: Setter<FullScore[]>;
};

export function CreateForm(props: Props) {
  const [form, setForm] = createStore({
    examId: "",
    courseId: 0,
    isSubmitting: false,
  });

  const [exams] = createResource(() => request.get<Exam[]>("/exams"), {
    initialValue: [],
  });

  const [courses] = createResource(() => request.get<Course[]>("/courses"), {
    initialValue: [],
  });

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    setForm({ isSubmitting: true });

    try {
      const fullScore = await request.post<FullScore>("/reviews", {
        examId: form.examId,
        courseId: form.courseId,
      });
      props.mutate((fullScores) => [...fullScores, fullScore]);
      props.onClose();
      toast.success("申请成功");
    } catch (error) {
      handleRequestError(error);
    } finally {
      setForm({ isSubmitting: false });
    }
  };

  return (
    <form onSubmit={handleSubmit} class="w-100">
      <div class="mb-4">
        <Select
          id="exam"
          label="考试"
          name="exam"
          value={form.examId}
          placeholder="请选择考试"
          required
          disabled={form.isSubmitting}
          onChange={(e) => setForm({ examId: e.currentTarget.value })}
        >
          <For each={exams()}>
            {({ id, name }) => <Option value={id}>{name}</Option>}
          </For>
        </Select>
      </div>
      <div class="mb-6">
        <Select
          id="course"
          label="课程"
          name="course"
          value={form.courseId}
          placeholder="请选择课程"
          required
          disabled={form.isSubmitting}
          onChange={(e) => setForm({ courseId: +e.currentTarget.value })}
        >
          <For each={courses()}>
            {({ id, name }) => <Option value={id}>{name}</Option>}
          </For>
        </Select>
      </div>
      <div class="flex justify-end items-center gap-3">
        <Button color="ghost" onClick={props.onClose}>
          <FiX />
          取消
        </Button>
        <Button type="submit" disabled={form.isSubmitting}>
          <FiCheck />
          确认
        </Button>
      </div>
    </form>
  );
}
