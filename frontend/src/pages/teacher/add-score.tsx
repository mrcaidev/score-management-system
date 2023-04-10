import { Button } from "components/form/button";
import { Checkbox } from "components/form/checkbox";
import { Input } from "components/form/input";
import { Option } from "components/form/option";
import { Select } from "components/form/select";
import { Title } from "components/title";
import { FiCheck, FiEdit, FiRefreshCw } from "solid-icons/fi";
import { For, createResource, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import toast from "solid-toast";
import { handleRequestError, request } from "utils/request";
import { Course, Exam } from "utils/types";

export default function TeacherAddScore() {
  const [form, setForm] = createStore({
    examId: "",
    courseId: 0,
    studentId: "",
    score: 0,
    isAbsent: false,
  });

  const [isSubmitting, setIsSubmitting] = createSignal(false);

  const [exams] = createResource(() => request.get<Exam[]>("/exams"), {
    initialValue: [],
  });

  const [courses] = createResource(() => request.get<Course[]>("/courses"), {
    initialValue: [],
  });

  const maxScore = () =>
    courses().find((course) => course.id === form.courseId)?.maxScore ?? 0;

  const handleReset = () => {
    setForm({
      examId: "",
      courseId: 0,
      studentId: "",
      score: 0,
      isAbsent: false,
    });
  };

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      await request.post("/scores", { ...form });
      toast.success("录入成功");
    } catch (error) {
      handleRequestError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div class="space-y-8 flex flex-col h-full px-12 pt-8">
      <Title>
        <FiEdit />
        成绩录入
      </Title>
      <div class="grow relative">
        <form
          onSubmit={handleSubmit}
          class="space-y-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-3/5 w-100"
        >
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
          <Input
            label="学号"
            name="student"
            value={form.studentId}
            placeholder="13位学号"
            pattern="\d{13}"
            required
            disabled={isSubmitting()}
            onChange={(e) => setForm({ studentId: e.target.value })}
          />
          <Input
            label="成绩"
            type="number"
            name="score"
            value={form.isAbsent ? 0 : form.score}
            placeholder={"0-" + maxScore()}
            required
            min={0}
            max={maxScore()}
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
          <div class="grid grid-cols-2 gap-3 pt-2">
            <Button
              variant="ghost"
              icon={FiRefreshCw}
              onClick={handleReset}
              class="justify-center"
            >
              重置
            </Button>
            <Button
              type="submit"
              icon={FiCheck}
              isLoading={isSubmitting()}
              class="justify-center"
            >
              确认
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
