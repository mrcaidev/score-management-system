import { useRouteData } from "@solidjs/router";
import { Option, Select } from "components/form";
import { scoresData } from "pages/scores.data";
import { For, createEffect, createResource, createSignal } from "solid-js";
import { request } from "utils/request";
import { Exam } from "utils/types";

export function ExamSelect() {
  const [, { refetch }] = useRouteData<typeof scoresData>();

  const [selectedExamId, setSelectedExamId] = createSignal("");

  const [exams] = createResource(() => request.get<Exam[]>("/exams"), {
    initialValue: [],
  });

  createEffect(() => {
    if (exams().length === 0) {
      return;
    }
    setSelectedExamId(exams().at(0)!.id);
  });

  createEffect(() => {
    if (selectedExamId()) {
      refetch({ examId: selectedExamId() });
    }
  });

  return (
    <Select
      label="考试"
      name="exam"
      value={selectedExamId()}
      placeholder={exams.loading ? "加载考试中..." : undefined}
      onChange={(e) => setSelectedExamId(e.target.value)}
      class="max-w-md"
    >
      <For each={exams()}>
        {({ id, name }) => <Option value={id}>{name}</Option>}
      </For>
    </Select>
  );
}
