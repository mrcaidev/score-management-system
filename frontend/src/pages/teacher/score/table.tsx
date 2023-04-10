import { Table, TableCell, TableRow } from "components/table";
import { For, Setter, Show } from "solid-js";
import { FullScore } from "utils/types";
import { DeleteButton } from "./delete-button";
import { UpdateButton } from "./update-button";

type Props = {
  scores: FullScore[];
  mutate: Setter<FullScore[]>;
};

export function ScoreTable(props: Props) {
  return (
    <Table
      head={["考试", "课程", "姓名", "是否缺席", "成绩", "操作"]}
      columnWidths={[2, 1, 1, 1, 1, 2]}
    >
      <For each={props.scores}>
        {(score) => (
          <TableRow>
            <TableCell>{score.exam.name}</TableCell>
            <TableCell>{score.course.name}</TableCell>
            <TableCell>{score.student.name}</TableCell>
            <TableCell>{score.isAbsent ? "是" : "否"}</TableCell>
            <TableCell>
              <Show when={score.isAbsent} fallback={score.score}>
                0
              </Show>
              &nbsp;/ {score.course.maxScore}
            </TableCell>
            <TableCell>
              <UpdateButton score={score} mutate={props.mutate} />
              <DeleteButton scoreId={score.id} mutate={props.mutate} />
            </TableCell>
          </TableRow>
        )}
      </For>
    </Table>
  );
}
