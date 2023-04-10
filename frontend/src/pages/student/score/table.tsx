import { Table, TableCell, TableRow } from "components/table";
import { For, Show } from "solid-js";
import { FullScore } from "utils/types";

type Props = {
  scores: FullScore[];
};

export function ScoreTable(props: Props) {
  return (
    <Table
      head={["考试", "课程", "是否缺席", "成绩"]}
      columnWidths={[2, 1, 1, 1]}
    >
      <For each={props.scores}>
        {({ exam, course, isAbsent, score }) => (
          <TableRow>
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
    </Table>
  );
}
