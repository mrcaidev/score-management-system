import { useRouteData } from "@solidjs/router";
import { Table, TableCell, TableRow } from "components/table";
import { scoresData } from "pages/scores.data";
import { For, Show } from "solid-js";

export function ScoreTable() {
  const [scores] = useRouteData<typeof scoresData>();

  const totalScore = () =>
    scores().reduce((acc, cur) => acc + cur.score, 0) ?? 0;

  return (
    <Show when={scores().length !== 0} fallback={<p>暂无成绩</p>}>
      <Table
        head={["考试", "课程", "是否缺席", "成绩"]}
        columnWidths={[2, 1, 1, 1]}
      >
        <For each={scores()}>
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
      <p>总分：{totalScore()}</p>
    </Show>
  );
}
