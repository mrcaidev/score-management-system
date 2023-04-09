import { TableCell } from "components/table/cell";
import { TableHead } from "components/table/head";
import { TableRow } from "components/table/row";
import { For, Show } from "solid-js";
import { FullScore } from "utils/types";

type Props = {
  scores: FullScore[];
};

export function Table(props: Props) {
  return (
    <table class="text-center">
      <colgroup>
        <col class="w-90" />
        <col class="w-80" />
        <col class="w-40" />
        <col class="w-40" />
        <col class="w-40" />
      </colgroup>
      <TableHead names={["代码", "考试", "课程", "是否缺席", "成绩"]} />
      <tbody>
        <For each={props.scores}>
          {({ id, exam, course, isAbsent, score }) => (
            <TableRow>
              <TableCell>{id}</TableCell>
              <TableCell>{exam.name}</TableCell>
              <TableCell>{course.name}</TableCell>
              <TableCell>{isAbsent ? "是" : "否"}</TableCell>
              <TableCell>
                <Show when={isAbsent} fallback={score}>
                  0
                </Show>
                &nbsp;/ {course.maxScore}
              </TableCell>
            </TableRow>
          )}
        </For>
      </tbody>
    </table>
  );
}
