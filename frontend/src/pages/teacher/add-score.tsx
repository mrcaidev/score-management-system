import { Button } from "components/form/button";
import { Checkbox } from "components/form/checkbox";
import { Input } from "components/form/input";
import { Option } from "components/form/option";
import { Select } from "components/form/select";
import { PageTitle } from "components/page-title";
import { FiCheck, FiEdit, FiRefreshCw } from "solid-icons/fi";
import { For, createResource } from "solid-js";
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
    isSubmitting: false,
  });

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

    setForm({ isSubmitting: true });

    try {
      await request.post("/scores", {
        examId: form.examId,
        courseId: form.courseId,
        studentId: form.studentId,
        score: form.score,
        isAbsent: form.isAbsent,
      });
      toast.success("录入成功");
    } catch (error) {
      handleRequestError(error);
    } finally {
      setForm({ isSubmitting: false });
    }
  };

  return (
    <div class="space-y-8 flex flex-col h-full px-12 pt-8">
      <PageTitle>
        <FiEdit />
        成绩录入
      </PageTitle>
      <div class="grow grid place-items-center">
        <form onSubmit={handleSubmit} class="space-y-4 w-100">
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
          <Input
            id="student"
            label="学号"
            name="student"
            value={form.studentId}
            placeholder="学生的13位学号"
            required
            pattern="\d{13}"
            disabled={form.isSubmitting}
            onChange={(e) => setForm({ studentId: e.currentTarget.value })}
          />
          <Input
            id="score"
            label="成绩"
            type="number"
            name="score"
            value={form.score}
            placeholder={"0-" + maxScore()}
            required
            min={0}
            max={maxScore()}
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
              isLoading={form.isSubmitting}
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
