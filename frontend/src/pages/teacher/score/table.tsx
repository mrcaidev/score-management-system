import { useRouteData } from "@solidjs/router";
import { Table, TableCell, TableRow } from "components/table";
import { scoresData } from "pages/scores.data";
import { For, Show } from "solid-js";
import { DeleteButton } from "./delete-button";
import { UpdateButton } from "./update-button";

export function ScoreTable() {
  const [scores] = useRouteData<typeof scoresData>();

  return (
    <Show when={scores().length} fallback={<p>暂无成绩</p>}>
      <Table
        head={["考试", "课程", "姓名", "是否缺席", "成绩", "操作"]}
        columnWidths={[2, 1, 1, 1, 1, 2]}
      >
        <For each={scores()}>
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
                <UpdateButton score={score} />
                <DeleteButton scoreId={score.id} />
              </TableCell>
            </TableRow>
          )}
        </For>
      </Table>
    </Show>
  );
}
