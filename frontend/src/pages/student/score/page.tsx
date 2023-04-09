import { useRouteData } from "@solidjs/router";
import { Option } from "components/form/option";
import { Select } from "components/form/select";
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
import { Table } from "./table";

export function Page() {
  const [exams] = useRouteData<typeof examsData>();

  const [selectedExamId, setSelectedExamId] = createSignal("");

  createEffect(() => {
    if (exams().length) {
      setSelectedExamId(exams().at(0)!.id);
    }
  });

  const [scores] = createResource(
    selectedExamId,
    (examId) => {
      if (!examId) {
        return [];
      }
      return request.get<FullScore[]>("/scores", { params: { examId } });
    },
    { initialValue: [] }
  );

  const totalScore = () =>
    scores()?.reduce((acc, cur) => acc + cur.score, 0) ?? 0;

  return (
    <div class="space-y-8 px-12 pt-8">
      <Title>
        <FiFileText />
        历次成绩
      </Title>
      <Select
        id="exam"
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
        <Table scores={scores()} />
        <p>总分：{totalScore()}</p>
      </Show>
    </div>
  );
}
