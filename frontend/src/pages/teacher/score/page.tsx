import { useRouteData } from "@solidjs/router";
import { Option, Select } from "components/form";
import { Title } from "components/title";
import { examsData } from "pages/exams.data";
import { FiFileText } from "solid-icons/fi";
import {
  For,
  Show,
  createEffect,
  createResource,
  createSignal,
} from "solid-js";
import { request } from "utils/request";
import { FullScore } from "utils/types";
import { ScoreTable } from "./table";

export function Page() {
  const [exams] = useRouteData<typeof examsData>();

  const [selectedExamId, setSelectedExamId] = createSignal("");

  createEffect(() => {
    if (exams().length) {
      setSelectedExamId(exams().at(0)!.id);
    }
  });

  const [scores, { mutate }] = createResource(
    selectedExamId,
    (examId) => {
      if (!examId) {
        return [];
      }
      return request.get<FullScore[]>("/scores", { params: { examId } });
    },
    { initialValue: [] }
  );

  return (
    <div class="space-y-8 px-12 pt-8">
      <Title icon={FiFileText}>历次成绩</Title>
      <Select
        label="考试"
        name="exam"
        value={selectedExamId()}
        onChange={(e) => setSelectedExamId(e.target.value)}
        class="max-w-md"
      >
        <For each={exams()}>
          {({ id, name }) => <Option value={id}>{name}</Option>}
        </For>
      </Select>
      <Show when={scores().length} fallback={<p>暂无成绩</p>}>
        <ScoreTable scores={scores()} mutate={mutate} />
      </Show>
    </div>
  );
}
