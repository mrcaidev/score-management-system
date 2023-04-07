import { useRouteData } from "@solidjs/router";
import { Option } from "components/form/option";
import { Select } from "components/form/select";
import { TableCell } from "components/table/cell";
import { TableHead } from "components/table/head";
import { TableRow } from "components/table/row";
import { examsData } from "pages/exams.data";
import { FiFileText, FiLoader } from "solid-icons/fi";
import {
  For,
  Match,
  Show,
  Switch,
  createEffect,
  createResource,
  createSignal,
} from "solid-js";
import { request } from "utils/request";
import { FullScore } from "utils/types";

export default function StudentScore() {
  const exams = useRouteData<typeof examsData>();

  const [selectedExamId, setSelectedExamId] = createSignal("");

  createEffect(() => {
    if (exams()?.length) {
      setSelectedExamId(exams()!.at(0)!.id);
    }
  });

  const [fullScores] = createResource(selectedExamId, (examId) => {
    if (!examId) {
      return [];
    }

    return request.get<FullScore[]>("/scores", { params: { examId } });
  });

  const totalScore = () =>
    fullScores()?.reduce((acc, cur) => acc + cur.score, 0) ?? 0;

  return (
    <div class="space-y-8 px-12 pt-8">
      <h1 class="flex items-center gap-3 font-bold text-3xl">
        <FiFileText />
        历次成绩
      </h1>
      <Select
        id="exam"
        label="考试"
        name="exam"
        value={selectedExamId()}
        onChange={(e) => setSelectedExamId(e.currentTarget.value)}
        class="max-w-md"
      >
        <Show when={exams()}>
          <For each={exams()}>
            {({ id, name }) => <Option value={id}>{name}</Option>}
          </For>
        </Show>
      </Select>
      <Switch>
        <Match when={fullScores.loading}>
          <div class="grid place-items-center h-40">
            <FiLoader />
          </div>
        </Match>
        <Match when={fullScores.error}>
          <div>发生错误：{fullScores.error.message}</div>
        </Match>
        <Match when={fullScores() && fullScores()!.length === 0}>
          <p>暂无成绩</p>
        </Match>
        <Match when={fullScores() && fullScores()!.length !== 0}>
          <table class="text-center">
            <colgroup>
              <col span={1} class="w-90" />
              <col span={1} class="w-80" />
              <col span={1} class="w-40" />
              <col span={1} class="w-40" />
              <col span={1} class="w-40" />
            </colgroup>
            <TableHead names={["代码", "考试", "科目", "是否缺席", "成绩"]} />
            <tbody>
              <For each={fullScores()}>
                {({ id, exam, course, isAbsent, score }) => (
                  <TableRow>
                    <TableCell>{id}</TableCell>
                    <TableCell>{exam.name}</TableCell>
                    <TableCell>{course.name}</TableCell>
                    <TableCell>{isAbsent ? "是" : "否"}</TableCell>
                    <TableCell>{score}</TableCell>
                  </TableRow>
                )}
              </For>
            </tbody>
          </table>
          <p>总分：{totalScore()}</p>
        </Match>
      </Switch>
    </div>
  );
}
